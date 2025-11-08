import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Iron from "@hapi/iron";
import axios from "axios";
import FormData from 'form-data'; // Use form-data library to correctly handle streams

const mastodonInstance = process.env.MASTODON_INSTANCE_URL;
const cookieSecret = process.env.COOKIE_SECRET;
const cookieName = "mastodon_session";

async function unsealData(sealedData) {
  try {
    return await Iron.unseal(sealedData, cookieSecret, Iron.defaults);
  } catch (err) {
    console.error("Failed to unseal session cookie:", err);
    return null;
  }
}

export async function PATCH(req) {
  try {
    // 1. --- Authenticate the User ---
    const cookieStore = cookies();
    const cookie = cookieStore.get(cookieName);

    if (!cookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await unsealData(cookie.value);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Invalid or missing session token" }, { status: 401 });
    }

    // 2. --- Parse Incoming FormData from the Frontend ---
    const incomingFormData = await req.formData();

    // 3. --- Construct New FormData for Mastodon API ---
    // We create a new FormData object to proxy the data, ensuring clean transmission.
    const mastodonFormData = new FormData();

    // Iterate through all entries from the frontend form
    for (const [key, value] of incomingFormData.entries()) {
      // The 'value' can be a string or a File object.
      
      if (value instanceof File) {
        // If it's a file (avatar or header), we need to convert it to a buffer/stream
        // that the 'form-data' library can handle.
        const buffer = Buffer.from(await value.arrayBuffer());
        mastodonFormData.append(key, buffer, { filename: value.name, contentType: value.type });
      } else {
        // For all other fields (display_name, note, locked, fields_attributes, etc.),
        // we just append them directly. The names already match the Mastodon API.
        mastodonFormData.append(key, value);
      }
    }

    // 4. --- Make the PATCH Request to Mastodon ---
    const mastodonApiUrl = `${mastodonInstance}/api/v1/accounts/update_credentials`;

    const response = await axios.patch(mastodonApiUrl, mastodonFormData, {
      headers: {
        // Pass the user's authorization token to Mastodon
        'Authorization': `Bearer ${session.accessToken}`,
        // Let axios set the Content-Type header with the correct boundary for multipart/form-data
        ...mastodonFormData.getHeaders(),
      },
    });

    // 5. --- Return Successful Response to Frontend ---
    // The Mastodon API returns the updated account object on success.
    // We wrap it in an `updatedAccount` key as the frontend expects.
    return NextResponse.json({ updatedAccount: response.data }, { status: 200 });

  } catch (error) {
    // 6. --- Handle Errors ---
    console.error("Error updating Mastodon profile:", error.response?.data || error.message);
    
    // Forward the error from Mastodon to the client if possible
    return NextResponse.json(
      { error: "Failed to update profile on Mastodon.", details: error.response?.data || 'Unknown error' },
      { status: error.response?.status || 500 }
    );
  }
}