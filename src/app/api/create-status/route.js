import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import Iron from '@hapi/iron';

const mastodonInstance = process.env.MASTODON_INSTANCE_URL;
const cookieSecret = process.env.COOKIE_SECRET;
const cookieName = 'mastodon_session';

// Helper function to decrypt sealed session cookie
async function unsealData(sealedData) {
  try {
    return Iron.unseal(sealedData, cookieSecret, Iron.defaults);
  } catch (err) {
    console.error('Failed to unseal session cookie:', err);
    return null;
  }
}

// POST /api/create-status
export async function POST(request) {
  // 1️⃣ Authenticate the user (Mastodon OAuth)
  const cookieVal = await cookies();
  const cookie = cookieVal.get(cookieName);
  if (!cookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const session = await unsealData(cookie.value);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Invalid or missing session' }, { status: 401 });
  }

  const accessToken = session.accessToken;

  try {
    const formData = await request.formData();
    const status = formData.get('status');
    const postType = formData.get('postType');
    const visibility = formData.get('visibility');
    const mediaFiles = formData.getAll('media'); // real File objects


    console.log(mediaFiles);

    if (postType === 'normal') {
      const mediaIds = [];
      for (const file of mediaFiles) {
        const media = await uploadMedia(file, accessToken);
        mediaIds.push(media.id);
      }

      const body = new FormData();
      body.append('status', status);
      body.append('visibility', visibility);
      mediaIds.forEach((id) => body.append('media_ids[]', id));

      const res = await fetch(`${mastodonInstance}/api/v1/statuses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      }
      )

      if (!res.ok) {
        const err = await res.json();
        // throw new Error(`Post creation failed: ${err.error}`);
        return NextResponse.json({ error: err }, { status: res.status })
      }

      const newStatus = await res.json();

      return NextResponse.json({ status: newStatus }, { status: 200 });
    }
    else if(postType === 'stream') {
      
    }


  } catch (error) {
    console.error('🔥 Error in create-status route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create status' },
      { status: 500 }
    );
  }
}


// async function uploadMedia(file, accessToken) {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('description', file.name || 'uploaded media');

//   console.log('uploading');

//   const response = await fetch(`${mastodonInstance}/api/v2/media`, {
//     method: 'POST',
//     headers: { Authorization: `Bearer ${accessToken}` },
//     body: formData,
//   });

//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(`Upload failed: ${err.error}`);
//   }

//   const media = await response.json();

//   // If it's being processed (video/gifv/audio)
//   if (!media.url) {
//     return await waitForMediaReady(media.id, accessToken);
//   }

//   return media;
// }
async function uploadMedia(file, accessToken) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', file.name || 'uploaded media');

  console.log('uploading', file.name);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // ⏳ 60s timeout

  try {
    const response = await fetch(`${mastodonInstance}/api/v2/media`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Upload failed: ${err.error || response.statusText}`);
    }

    const media = await response.json();

    // If Mastodon is still processing (videos/gifs)
    if (!media.url) {
      return await waitForMediaReady(media.id, accessToken);
    }

    return media;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Upload timed out after 60s — try a smaller file.');
    }
    throw error;
  }
}


async function waitForMediaReady(mediaId, accessToken) {
  while (true) {
    const res = await fetch(`${mastodonInstance}/api/v1/media/${mediaId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();

    if (data.url) return data; // Ready
    await new Promise(r => setTimeout(r, 2000)); // Wait 2 sec
  }
}