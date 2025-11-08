import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Iron from '@hapi/iron';
import axios from 'axios';

const mastodonInstance = process.env.MASTODON_INSTANCE_URL;
const cookieSecret = process.env.COOKIE_SECRET;
const cookieName = 'mastodon_session';

async function unsealData(sealedData) {
  try {
    return Iron.unseal(sealedData, cookieSecret, Iron.defaults);
  } catch (err) {
    return null;
  }
}

export async function POST(request, {params}) {
  try {
    const cookieVal = await cookies();
    const cookie = cookieVal.get(cookieName);
    if (!cookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
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
    const searchParams = request.nextUrl.search;
    
    const apiUrl = `${mastodonInstance}/api/${endpointPath}${searchParams}`;
  
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
  
    const body = await request.text();
    const mastodonResponse = await axios.post(apiUrl, body, {headers});
  
    const data = mastodonResponse.data;
    return NextResponse.json(data, { status: mastodonResponse.status });
  } catch (error) {
  console.log(error);
    return NextResponse.json({ error: 'API proxy request failed' }, { status: 502 }); // 502 Bad Gateway
  }
}


export async function GET(request, {params}) {
  try {
    const cookieVal = await cookies();
    const cookie = cookieVal.get(cookieName);
    if (!cookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
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
    const searchParams = request.nextUrl.search;
    console.log(searchParams);
    
    const apiUrl = `${mastodonInstance}/api/${endpointPath}${searchParams}`;
  
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
    const mastodonResponse = await axios.get(apiUrl, {headers});
  
    const data = mastodonResponse.data;
    console.log('returned from normal');
    
    return NextResponse.json(data, { status: mastodonResponse.status });
  } catch (error) {
  console.log(error);
    return NextResponse.json({ error: 'API proxy request failed' }, { status: 502 }); // 502 Bad Gateway
  }
}