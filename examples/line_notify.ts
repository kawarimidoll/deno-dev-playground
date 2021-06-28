import { Logger } from "./../logger.ts";
import { lineNotify } from "./../line_notify.ts";
import { LINE_ACCESS_TOKEN } from "./../env.ts";
Logger.info(
  await lineNotify({
    message: "good morning with image",
    token: LINE_ACCESS_TOKEN,
    imageFullsizeURL:
      "https://storage.googleapis.com/zenn-user-upload/avatar/2379ac8d86.jpeg",
    imageThumbnailURL:
      "https://storage.googleapis.com/zenn-user-upload/avatar/2379ac8d86.jpeg",
  }),
);
