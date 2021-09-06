import { TwitterApi } from "./deps.ts";

import {
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_API_KEY,
  TWITTER_API_SECRET,
} from "./env.ts";

export async function sendTweet(status: string) {
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
}
