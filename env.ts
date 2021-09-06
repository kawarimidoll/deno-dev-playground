import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const {
  IFTTT_WEBHOOK_KEY,
  LINE_ACCESS_TOKEN,
  PIXELA_TOKEN,
  GITHUB_READ_USER_TOKEN,
  RAKUTEN_MAIL,
  RAKUTEN_PASS,
  TWITTER_API_KEY,
  TWITTER_API_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TEXTDB_UUID,
} = config({ safe: true });

export {
  GITHUB_READ_USER_TOKEN,
  IFTTT_WEBHOOK_KEY,
  LINE_ACCESS_TOKEN,
  PIXELA_TOKEN,
  RAKUTEN_MAIL,
  RAKUTEN_PASS,
  TEXTDB_UUID,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_API_KEY,
  TWITTER_API_SECRET,
};
