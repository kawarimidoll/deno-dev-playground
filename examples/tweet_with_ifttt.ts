import { Logger } from "./../logger.ts";
import { sendTweet } from "./../tweet_with_ifttt.ts";
import { IFTTT_WEBHOOK_KEY } from "./../env.ts";
Logger.info(await sendTweet({ message: "Denoからツイート", key: IFTTT_WEBHOOK_KEY }));
