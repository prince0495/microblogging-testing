import { NextResponse } from "next/server";

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

        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'API proxy request failed' }, { status: 502 }); // 502 Bad Gateway   
    }
}