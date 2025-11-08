import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Iron from '@hapi/iron';
import axios from "axios";


const mastodonInstance = process.env.MASTODON_INSTANCE_URL;
const cookieSecret = process.env.COOKIE_SECRET;
const cookieName = 'mastodon_session';

async function unsealData(sealedData) {
  try {
    return await Iron.unseal(sealedData, cookieSecret, Iron.defaults);
  } catch (err) {
    return null;
  }
}

export async function GET(request) {
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
        const searchParams = request.nextUrl.search;
        const res = await axios.get(`${mastodonInstance}/api/v1/timelines/home${searchParams}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })

        const newData = await Promise.all(res.data.map(async(obj) => {
            const splitedString = obj?.content.split('Tradegospel_v1:');
            const secondPart = splitedString[1];
        
            if(secondPart) {
                const sealedData = secondPart.slice(0, -4);
                const unsealedData = await unsealData(sealedData);             
                return {...obj, authorId: unsealedData.authorId, price: unsealedData.price, currency: unsealedData.currency, streamId: unsealedData.streamId, content: `${splitedString[0]}</p>`};
            }
            else {
                return obj;
            }
        }))
        
        console.log(newData);
        
        return NextResponse.json(newData);
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'API proxy request failed' }, { status: 502 }); // 502 Bad Gateway   
    }
}