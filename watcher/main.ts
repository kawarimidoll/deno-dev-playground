import { watchChanges } from "./watcher.ts";
import { runAndWatchErrors } from "./runner.ts";

function onError() {
  console.log("Error detected. Waiting for changes...");
}

let process = runAndWatchErrors(Deno.args, onError);

console.log("Process is started. Watching for changes...");

await watchChanges(".", (event) => {
  console.log("File change detected.");
  console.log(event.paths);
  process = runAndWatchErrors(Deno.args, onError, process);
  setTimeout(() => console.log("Watching for changes..."), 2500);
});
