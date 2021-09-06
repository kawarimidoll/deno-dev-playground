import { ky } from "./deps.ts";
const url = "https://notify-api.line.me/api/notify";

export async function lineNotify(
  params: {
    message: string;
    token: string;
    imageThumbnailURL?: string;
    imageFullsizeURL?: string;
    imageFile?: File;
  },
) {
  const { message, token, imageThumbnailURL, imageFullsizeURL, imageFile } =
    params;

  if (!message || !token) {
    throw new Error("Missing message or token");
  }

  const body = new FormData();
  body.append("message", message);
  if (imageThumbnailURL) {
    // validate url
    new URL(imageThumbnailURL);
    body.append("imageThumbnail", imageThumbnailURL);
  }
  if (imageFullsizeURL) {
    // validate url
    new URL(imageFullsizeURL);
    body.append("imageFullsize", imageFullsizeURL);
  }
  if (imageFile) {
    body.append("imageFile", imageFile);
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    return await ky.post(url, { headers, body }).json();
  } catch (error) {
    return await error.response.json();
  }
}
