import { Log } from "https://deno.land/x/tl_log@0.1.1/mod.ts";

const log = new Log({ datetimeFormat: "" });

async function watchChanges(
  path: string,
  onChange: (event: Deno.FsEvent) => void,
  config = { interval: 500 },
) {
  let reloading = false;
  for await (const event of Deno.watchFs(path)) {
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

const filename = Deno.args[0];
if (!filename) {
  log.error("filename is required");
  Deno.exit(1);
}
const toClear = Deno.args[1] === "--clear";

const cmd = [
  "deno",
  /^(.*[._])?test\.m?[tj]sx?$/.test(filename) ? "test" : "run",
  "-A",
  "--no-check",
  "--unstable",
  filename,
];

let process = runAndWatchErrors(cmd);

log.debug("Process is started.");
log.info("Watching for changes...");

await watchChanges(filename, (event) => {
  if (toClear) {
    console.clear();
  } else {
    log.info("File change detected.");
    log.info(event.paths[0]);
  }

  process = runAndWatchErrors(cmd, process);
  setTimeout(() => log.info("Watching for changes..."), 2500);
});
