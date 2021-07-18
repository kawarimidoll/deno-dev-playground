import { TwitterApi } from "https://raw.githubusercontent.com/stefanuros/deno_twitter_api/master/mod.ts";
// import { TwitterApi } from "https://deno.land/x/deno_twitter_api@v1.1.0/mod.ts";
import {
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_API_KEY,
  TWITTER_API_SECRET,
} from "./env.ts";

const sendTweet = async (status: string) => {
  try {
    const twitterApi = new TwitterApi({
      consumerApiKey: TWITTER_API_KEY,
      consumerApiSecret: TWITTER_API_SECRET,
      accessToken: TWITTER_ACCESS_TOKEN,
      accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET,
    });

    const result = await twitterApi.post("statuses/update.json", { status });

    return await result.json();
  } catch (error) {
    console.error(error);
    return `${error}`;
  }
};

export { sendTweet };
