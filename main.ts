// import { Logger } from "./logger.ts";
// import { lineNotify } from "./line_notify.ts";
// import { LINE_ACCESS_TOKEN } from "./env.ts";
// const json = await lineNotify({
//   message: "good morning with image",
//   token: LINE_ACCESS_TOKEN,
//   imageFullsizeURL:
//     "https://storage.googleapis.com/zenn-user-upload/avatar/2379ac8d86.jpeg",
//   imageThumbnailURL:
//     "https://storage.googleapis.com/zenn-user-upload/avatar/2379ac8d86.jpeg",
// });

// import { sendTweet } from "./tweet_with_ifttt.ts";
// import { IFTTT_WEBHOOK_KEY } from "./env.ts";
// const json = await sendTweet({
//   message: "Denoからツイート",
//   key: IFTTT_WEBHOOK_KEY,
// });
// Logger.info(json);

// import { FeedType } from "./deps.ts";
// import { rss } from "./rss.ts";
//
// const { feed, feedType } = await rss("https://zenn.dev/kawarimidoll/feed");
// if (feedType !== FeedType.Rss2) {
//   console.error("Invalid feed type");
//   // Deno.exit(1);
// }
//
// console.log(feed);

import { genPromotion } from "./promote_zenn_article.ts";
console.log(await genPromotion("kawarimidoll"));
