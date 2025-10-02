import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Iron from '@hapi/iron';

// This route handles three critical authentication actions:
// GET /api/auth/login     - Kicks off the login process by redirecting to Mastodon.
// GET /api/auth/callback  - Handles the user being redirected back from Mastodon.
// GET /api/auth/logout    - Clears the user's session.

// --- Load Configuration from Environment Variables ---
const mastodonInstance = process.env.MASTODON_INSTANCE_URL;
const clientId = process.env.MASTODON_CLIENT_ID;
const clientSecret = process.env.MASTODON_CLIENT_SECRET;
// This is the exact URI you must add to your Mastodon app's settings.
const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
const cookieSecret = process.env.COOKIE_SECRET;
const cookieName = 'mastodon_session';

// Helper function to encrypt data into a sealed (secure) string.
async function sealData(data) {
  return Iron.seal(data, cookieSecret, Iron.defaults);
}

// The main handler for all GET requests to /api/auth/*
export async function GET(request, { params }) {
  const param = await params;
  const action = param.mastodon[0];

  // --- LOGIN ACTION ---
  if (action === 'login') {
    // We need read access (for timelines) and write access (to post statuses).
    const scopes = 'read write:statuses';
    
    // Construct the authorization URL.
    const authUrl = new URL(`${mastodonInstance}/oauth/authorize`);
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    
    // Redirect the user's browser to the Mastodon authorization screen.
    return NextResponse.redirect(authUrl.toString());
  }

  // --- CALLBACK ACTION ---
  if (action === 'callback') {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code'); // Mastodon provides a temporary code.

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is missing.' }, { status: 400 });
    }

    try {
      // Exchange the temporary code for a permanent access token.
      // This is a secure server-to-server request.
      const tokenResponse = await fetch(`${mastodonInstance}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
          code: code,
          scope: 'read write:statuses',
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Failed to get access token:", errorText);
        throw new Error('Could not retrieve access token from Mastodon.');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Now, securely store the access token in an encrypted, httpOnly cookie.
      // This cookie cannot be accessed by client-side JavaScript, preventing XSS attacks.
      const sealedToken = await sealData({ accessToken });
      const cookieStore = await cookies();
        cookieStore.set(cookieName, sealedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });


      // Redirect the user back to the application's home page.
      return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL));
      
    } catch (error) {
      console.error('Callback handler error:', error);
      return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
    }
  }
  
  // --- LOGOUT ACTION ---
  if (action === 'logout') {
    // "Delete" the cookie by setting its maxAge to a past value.
    cookies().set(cookieName, '', { maxAge: -1, path: '/' });
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL));
  }
  
  // If the action is none of the above, return a 404.
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

