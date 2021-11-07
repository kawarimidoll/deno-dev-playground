import { Log } from "https://deno.land/x/tl_log@0.1.1/mod.ts";
import { parse as parseCliArgs } from "https://deno.land/std@0.113.0/flags/mod.ts";

const log = new Log({ datetimeFormat: "" });

async function watchChanges(
  paths: string[],
  onChange: (event: Deno.FsEvent) => void,
  config = { interval: 500 },
) {
  let reloading = false;
  for await (const event of Deno.watchFs(paths)) {
    if (event.kind !== "modify" || reloading) {
      continue;
    }
    reloading = true;
    onChange(event);
    setTimeout(() => (reloading = false), config.interval);
  }
}

async function watchProcessError(process: Deno.Process) {
  try {
    if ((await process.status()).success === false) {
      log.warn("Error detected. Waiting for changes...");
    }
  } catch (error) {
    log.warn(error);
  }
}

function runAndWatchErrors(
  cmd: string[],
  ongoingProcess?: Deno.Process,
) {
  if (ongoingProcess) {
    ongoingProcess.close();
  }
  const process = Deno.run({ cmd });
  watchProcessError(process);
  return process;
}

const VERSION = "0.1.0";
const versionInfo = `dr ${VERSION}`;
const helpMsg = `Usage:
${versionInfo}

  Easy deno runner for development.

USAGE:
  dr hello.ts

OPTIONS:
  -v, --version           Shows the version number.
  -h, --help              Shows the help message.
  -c, --clear             Clears console every running.
  -q, --quiet             Dismiss console messages.
  -w, --watch             Reveals the given arguments.
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
  log.error("filename is required");
  Deno.exit(1);
} else if (args.length > 1) {
  log.error("too many arguments");
  Deno.exit(1);
}

const filename = `${args[0]}`;
const watchedFiles = watch ? [filename, ...watch.split(",")] : [filename];

const cmd = [
  "deno",
  /^(.*[._])?test\.m?[tj]sx?$/.test(filename) ? "test" : "run",
  "-A",
  "--no-check",
  "--unstable",
  filename,
];

const info = quiet ? () => {} : (...args: unknown[]) => log.info(...args);

info("Process is started.");
info("Watching files:", watchedFiles);

let process = runAndWatchErrors(cmd);

info("Watching for changes...");

await watchChanges(watchedFiles, (event) => {
  if (clear) {
    console.clear();
  } else {
    info("File changed:", event.paths[0]);
  }

  process = runAndWatchErrors(cmd, process);
  info("Watching for changes...");
});
