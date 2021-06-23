import { IFTTT_WEBHOOK_KEY ,LINE_ACCESS_TOKEN} from "./env.ts";
import { sendTweet } from "./tweet_with_ifttt.ts";
import { genPromotion } from "./promote_zenn_article.ts";

const message = await genPromotion("kawarimidoll");
console.log(LINE_ACCESS_TOKEN);
console.log({ message });
console.log(await sendTweet({ message, key: IFTTT_WEBHOOK_KEY }));
