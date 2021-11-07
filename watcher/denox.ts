import { Log } from "https://deno.land/x/tl_log@0.1.1/mod.ts";
import { blue } from "https://deno.land/std@0.113.0/fmt/colors.ts";
import { parse as parseCliArgs } from "https://deno.land/std@0.113.0/flags/mod.ts";

const log = new Log({ datetimeFormat: "" });

function runAndWatchErrors(cmd: string[], ongoingProcess?: Deno.Process) {
  if (ongoingProcess) {
    ongoingProcess.close();
  }
  const process = Deno.run({ cmd });
  process.status().then((status) => {
    if (Object.hasOwn(status, "signal")) {
      // info(`Process finished by signal ${status.signal}`);
    } else {
      info("Process finished. Restarting on file change...");
    }
  });
  return process;
}

const VERSION = "0.1.0";
const versionInfo = `dex ${VERSION}`;
const logPrefix = blue("dex");
const helpMsg = `
${versionInfo}
An easy deno runner for development.

EXAMPLE:
  dex hello.ts

USAGE:
  dex [OPTIONS] <FILENAME>

OPTIONS:
  -v, --version           Show the version number.
  -h, --help              Show the help message.
  -c, --clear             Clear console every running.
  -q, --quiet             Suppress console messages of dex.
  -w, --watch <filenames> Watch the given files.
`;

const {
  "_": args,
  clear,
  help,
  quiet,
  version,
  watch,
} = parseCliArgs(
  Deno.args,
  {
    boolean: [
      "clear",
      "help",
      "quiet",
      "version",
    ],
    string: [
      "watch",
    ],
    alias: {
      c: "clear",
      h: "help",
      q: "quiet",
      v: "version",
      w: "watch",
    },
  },
);

if (version) {
  console.log(versionInfo);
  Deno.exit(0);
}
if (help) {
  console.log(helpMsg);
  Deno.exit(0);
}

if (!args[0]) {
  log.error("Error: filename is required");
  Deno.exit(1);
} else if (args.length > 1) {
  log.error("Error: too many arguments");
  Deno.exit(1);
}

const filename = `${args[0]}`;
const watchedFiles = watch ? [filename, ...watch.split(",")] : [filename];

const cmd = [
  "deno",
  /^(.*[._])?test\.m?[tj]sx?$/.test(filename) ? "test" : "run",
  "--allow-all",
  "--no-check",
  "--unstable",
  "--watch",
  filename,
];

const info = quiet
  ? () => {}
  : (...args: unknown[]) => log.info(logPrefix, ...args);

info("Process is started.");
info("Watching files:", watchedFiles);

let process = runAndWatchErrors(cmd);
// https://github.com/denoland/deno/blob/0ec151b8cb2a92bb1765672fa15de23e6c8842d4/cli/file_watcher.rs#L32
const DEBOUNCE_INTERVAL = 200;
let reloading = false;

for await (const event of Deno.watchFs(watchedFiles)) {
  if (event.kind !== "modify" || reloading) {
    continue;
  }
  reloading = true;

  if (clear) {
    console.clear();
  } else {
    info("File changed:", event.paths[0]);
  }

  try {
    process.kill("SIGTERM");
  } catch (error) {
    if (error.message !== "ESRCH: No such process") {
      throw error;
    }
  }

  process = runAndWatchErrors(cmd, process);

  setTimeout(() => (reloading = false), DEBOUNCE_INTERVAL);
}
