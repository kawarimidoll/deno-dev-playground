import { watcher } from "./watcher.ts";

console.log("Watching for file changes.");

await watcher(".", (event) => {
  console.log("File change detected.");
  console.log(event.paths);
});
