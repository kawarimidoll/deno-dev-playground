// [Build a live reloader and explore Deno! 🦕 - DEV Community](https://dev.to/otanriverdi/let-s-explore-deno-by-building-a-live-reloader-j47)
export async function watcher(
  path: string,
  onChange: (event: Deno.FsEvent) => void,
  config = { interval: 500 },
) {
  const watcher = Deno.watchFs(path);
  let reloading = false;

  for await (const event of watcher) {
    if (event.kind !== "modify" || reloading) {
      continue;
    }
    reloading = true;
    onChange(event);
    setTimeout(() => (reloading = false), config.interval);
  }
}
