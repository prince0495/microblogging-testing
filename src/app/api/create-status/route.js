export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import Iron from '@hapi/iron';
import globalPrisma from '@/lib/prisma';
import { StreamCurrency } from '@/generated/prisma';
import { Decimal } from '@/generated/prisma/runtime/library';

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

  console.log(accessToken);

  try {
    const formData = await request.formData();
    const status = formData.get('status');
    const postType = formData.get('postType');
    const visibility = formData.get('visibility');
    const mediaFiles = formData.getAll('media'); // real File objects

    const mediaIds = [];
    for (const file of mediaFiles) {
      const media = await uploadMedia(file, accessToken);
      mediaIds.push(media.id);
    }

    const body = new FormData();
    body.append('visibility', visibility);
    mediaIds.forEach((id) => body.append('media_ids[]', id));
    
    if (postType === 'normal') {
      body.append('status', status);

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
    else if (postType === 'stream') {
      const price = formData.get('price');
      const currency = formData.get('currency');
      const scheduleTime = formData.get('scheduleTime')
      const userId = formData.get('userId');
      const scheduledAt = new Date(scheduleTime);
      
      const decimalPrice = new Decimal(price);
      const streamCurrency = StreamCurrency[currency] || StreamCurrency.INR;
      
            console.log(price, currency, scheduleTime, userId, scheduledAt, decimalPrice, streamCurrency);
            console.log(typeof price, typeof currency, typeof scheduleTime, typeof userId, typeof scheduledAt, typeof decimalPrice, typeof streamCurrency);

      try {

        const prisma = globalPrisma;
        const stream = await prisma.stream.create({
          data: {
            description: status,
            price: decimalPrice,
            currency: currency,
            authorId: userId,
            scheduledAt: scheduledAt
          }
        });

        const sealed = await Iron.seal({ authorId: userId, price, currency, streamId: stream.id }, cookieSecret, Iron.defaults);
        // const formData = new FormData();
        
    //    const imagePath = path.join(process.cwd(), 'public', 'tp_image.jpg');

    // // 2. Read the image file into a Buffer
    // const imageBuffer = await fs.readFile(imagePath);

    // // 3. Create a Blob from the Buffer (This is the crucial step)
    // const imageBlob = new Blob([imageBuffer]);

    // // 4. Create FormData and append the Blob and other data
    // const formData = new FormData();
    // formData.append('file', imageBlob, 'tp_image.jpg');

    //     formData.append('description', `Tradegospel:verification_v1 ${sealed}`);
    //     const res = await fetch(`${mastodonInstance}/api/v2/media`, {
    //       method: 'POST',
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //       body: formData
    //     });

    //     const media = await res.json();
    //     console.log('media', media);
        
    //     body.append('media_ids[]', media.id);

        const statusText = `${status} Tradegospel_v1:${sealed}`;
        body.append('status', statusText);

        const response = await fetch(`${mastodonInstance}/api/v1/statuses`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body,
        });
        
        if (!response.ok) {
          console.log('response is not ok');
          
          const err = await response.json();
          console.log(err);
          
          return NextResponse.json({ error: err }, { status: res.status })
        };

        const newStatus = await response.json();

        await prisma.stream.update({
          where: {
            id: stream.id
          },
          data: {
            statusId: newStatus.id
          }
        })

        return NextResponse.json({ status: newStatus }, { status: 200 });

      } catch (error) {
        console.error('🔥 Error in create-status route:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to create status, internal error' },
          { status: 500 }
        );
      }
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
async function uploadMedia(file, accessToken, secretDescription = null) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', secretDescription || file.name || 'uploaded media');

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