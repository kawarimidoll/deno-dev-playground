import { watchChanges } from "./watcher.ts";
import { runAndWatchErrors } from "./runner.ts";
import { fail, load, success, update } from "./colored_log.ts";

function onError() {
  fail("Error detected. Waiting for changes...");
}

let process = runAndWatchErrors(Deno.args, onError);

load("Process is started. Watching for changes...");

await watchChanges(".", (event) => {
  success("File change detected.");
  update(event.paths[0]);
  process = runAndWatchErrors(Deno.args, onError, process);
  setTimeout(() => success("Watching for changes..."), 2500);
});
