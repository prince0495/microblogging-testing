import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Iron from "@hapi/iron";
import axios from "axios";

const mastodonInstance = process.env.MASTODON_INSTANCE_URL;
const cookieSecret = process.env.COOKIE_SECRET;
const cookieName = "mastodon_session";

// Helper function to decrypt sealed session cookie
async function unsealData(sealedData) {
  try {
    return await Iron.unseal(sealedData, cookieSecret, Iron.defaults);
  } catch (err) {
    console.error("Failed to unseal session cookie:", err);
    return null;
  }
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const cookieStore = await cookies();
    const cookie = cookieStore.get(cookieName);

    if (!cookie || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await unsealData(cookie.value);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Invalid or missing session" }, { status: 401 });
    }

    const res = await axios.get(`${mastodonInstance}/api/v1/accounts/${userId}/statuses`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    return NextResponse.json({ statuses: res.data });
  } catch (error) {
    console.error("Error in /api/user/profile:", error);
    return NextResponse.json({ error: "API proxy request failed" }, { status: 502 });
  }
}
