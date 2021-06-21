import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const {
  LINE_ACCESS_TOKEN,
} = config({ safe: true });

export { LINE_ACCESS_TOKEN };
