import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";
const { LINE_ACCESS_TOKEN } = config();

import * as log from "https://deno.land/std@0.98.0/log/mod.ts";
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),

    file: new log.handlers.FileHandler("DEBUG", {
      filename: "./app.log",
      formatter: "{levelName} {msg}",
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },
  },
});
// get default logger.
const Logger = log.getLogger();

export { LINE_ACCESS_TOKEN, Logger };
