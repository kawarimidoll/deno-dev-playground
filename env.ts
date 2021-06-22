import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const {
  IFTTT_WEBHOOK_KEY,
  LINE_ACCESS_TOKEN,
} = config({ safe: true });

export { IFTTT_WEBHOOK_KEY, LINE_ACCESS_TOKEN };
