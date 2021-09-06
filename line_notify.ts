import { ky } from "./deps.ts";
const url = "https://notify-api.line.me/api/notify";

export async function lineNotify(
  params: {
    message: string;
    token: string;
    imageThumbnailURL?: string;
    imageFullsizeURL?: string;
  },
) {
  const { message, token, imageThumbnailURL, imageFullsizeURL } = params;

  if (!message || !token) {
    throw new Error("Missing message or token");
  }

  const body = new URLSearchParams();
  body.set("message", message);
  if (imageThumbnailURL) {
    // validate url
    new URL(imageThumbnailURL);
    body.set("imageThumbnail", imageThumbnailURL);
  }
  if (imageFullsizeURL) {
    // validate url
    new URL(imageFullsizeURL);
    body.set("imageFullsize", imageFullsizeURL);
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    return await ky.post(url, { headers, body }).json();
  } catch (error) {
    console.error(`${error}`);
    return error;
    // return await error.response.json();
  }
}
