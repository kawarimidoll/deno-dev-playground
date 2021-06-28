import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const {
  IFTTT_WEBHOOK_KEY,
  LINE_ACCESS_TOKEN,
  PIXELA_TOKEN,
  GITHUB_READ_USER_TOKEN,
} = config({ safe: true });

export {
  GITHUB_READ_USER_TOKEN,
  IFTTT_WEBHOOK_KEY,
  LINE_ACCESS_TOKEN,
  PIXELA_TOKEN,
};
