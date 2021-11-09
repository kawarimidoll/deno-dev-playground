import {
  bold,
  brightBlue,
  red,
} from "https://deno.land/std@0.113.0/fmt/colors.ts";
import {
  dirname,
  join,
  relative,
  resolve,
} from "https://deno.land/std@0.113.0/path/mod.ts";
import { parse as parseCliArgs } from "https://deno.land/std@0.113.0/flags/mod.ts";
import { ensureDir } from "https://deno.land/std@0.113.0/fs/ensure_dir.ts";

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

async function getDenoDir() {
  const p = Deno.run({
    cmd: ["deno", "info"],
    stdout: "piped",
    stderr: "piped",
  });
  const denoDir = new TextDecoder().decode(await p.output())
    .replace(/\n.*/g, "")
    .replace(/^[^"]*"|"$/g, "");
  p.close();
  return denoDir;
}

const VERSION = "0.1.0";
const versionInfo = `dex ${VERSION}`;
const logPrefix = brightBlue("Watcher");

const DENO_DIR = await getDenoDir();
const DEX_SCRIPT_PATH = join(DENO_DIR, "dex/script.ts");

const helpMsg = `${versionInfo}
An easy deno runner for development.

Repository: https://github.com/kawarimidoll/deno-dex

EXAMPLE:
  dex hello.ts

USAGE:
  dex [OPTIONS] <FILENAME>

OPTIONS:
  -v, --version           Show the version number.
  -h, --help              Show the help message.
  -c, --clear             Clear console every running.
  -q, --quiet             Suppress console messages of dex.
  -w, --watch <filenames> Watch the given files. Comma-separated list is allowed.

ARGS:
  <FILENAME>              The file to run or test.`;

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

const cliError = (message: string) => {
  const errorMsg = `${message}

USAGE:
  dex [OPTIONS] <FILENAME>

For more information try --help`;
  console.error(bold(red("error")) + ":", errorMsg);
};

if (!args[0]) {
  cliError("Filename is required as argument.");
  Deno.exit(1);
} else if (args.length > 1) {
  cliError("Too many arguments found.");
  Deno.exit(1);
}

const filename = resolve(Deno.cwd(), `${args[0]}`);

const watchedFiles = (watch ? [filename, ...watch.split(",")] : [filename]).map(
  (path) => relative(Deno.cwd(), path),
);

await ensureDir(dirname(DEX_SCRIPT_PATH));
await Deno.writeTextFile(
  DEX_SCRIPT_PATH,
  (clear ? "console.clear();" : "") + `import("${filename}")`,
);

const cmd = [
  "deno",
  /^(.*[._])?test\.m?[tj]sx?$/.test(filename) ? "test" : "run",
  "--allow-all",
  "--no-check",
  "--unstable",
  "--watch",
  DEX_SCRIPT_PATH,
];

const info = quiet
  ? () => {}
  : (...args: unknown[]) => console.log(logPrefix, ...args);

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

  info("File change detected! Restarting!");

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
