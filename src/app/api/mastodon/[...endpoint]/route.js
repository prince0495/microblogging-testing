import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Iron from '@hapi/iron';

// This is a proxy route. It catches all requests to /api/mastodon/*
// Its job is to:
// 1. Get the user's encrypted session cookie.
// 2. Decrypt the access token from it.
// 3. Forward the original request to the real Mastodon API, adding the Authorization header.
// 4. Return the response from Mastodon back to the frontend.

const mastodonInstance = process.env.MASTODON_INSTANCE_URL;
const cookieSecret = process.env.COOKIE_SECRET;
const cookieName = 'mastodon_session';

// Helper function to decrypt the sealed cookie data.
async function unsealData(sealedData) {
  try {
    return Iron.unseal(sealedData, cookieSecret, Iron.defaults);
  } catch (err) {
    return null; // The cookie is invalid, expired, or tampered with.
  }
}

// A generic handler for both GET and POST requests.
async function handler(request, { params }) {
  // 1. Check for the session cookie.
  const cookieVal = await cookies();
  const cookie = cookieVal.get(cookieName);
  if (!cookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // 2. Decrypt the cookie to get the access token.
  const session = await unsealData(cookie.value);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
  const { accessToken } = session;
  
  // 3. Reconstruct the target Mastodon API URL from the request.
  // e.g., a request to `/api/mastodon/v1/timelines/home` becomes
  // `https://mastodon.social/api/v1/timelines/home`
  const { endpoint } = await params;
const endpointPath = endpoint.join('/');
  const apiUrl = `${mastodonInstance}/api/${endpointPath}`;

  try {
    // 4. Prepare the request to be forwarded.
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };
    
    let body = null;
    // If it's a POST request (like creating a status), we need to pass the body along.
    if (request.method === 'POST') {
        headers['Content-Type'] = 'application/json';
        body = await request.text();
    }

    // 5. Make the actual request to the Mastodon API.
    const mastodonResponse = await fetch(apiUrl, {
      method: request.method,
      headers,
      body,
      // Pass duplex stream for POST requests in Next.js 13+ Edge runtime
      ...(request.method === 'POST' && { duplex: 'half' }),
    });
    
    // 6. Send Mastodon's response and status code back to our frontend.
    const data = await mastodonResponse.json();
    return NextResponse.json(data, { status: mastodonResponse.status });

  } catch (error) {
    console.error(`API proxy error for /${endpointPath}:`, error);
    return NextResponse.json({ error: 'API proxy request failed' }, { status: 502 }); // 502 Bad Gateway
  }
}

// Export the handler for both GET and POST HTTP methods.
export { handler as GET, handler as POST };

