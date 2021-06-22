// import { lineNotify } from "./line_notify.ts";
// import { LINE_ACCESS_TOKEN } from "./env.ts";
import { sendTweet } from "./tweet_with_ifttt.ts";
import { IFTTT_WEBHOOK_KEY } from "./env.ts";
import { Logger } from "./logger.ts";

const json = await sendTweet({
  message: "Denoからツイート",
  key: IFTTT_WEBHOOK_KEY,
});
// const json = await lineNotify({
//   message: "good morning with image",
//   token: LINE_ACCESS_TOKEN,
//   imageFullsizeURL:
//     "https://storage.googleapis.com/zenn-user-upload/avatar/2379ac8d86.jpeg",
//   imageThumbnailURL:
//     "https://storage.googleapis.com/zenn-user-upload/avatar/2379ac8d86.jpeg",
// });

Logger.info(json);
