import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { relative, resolve } from "https://deno.land/std@0.100.0/path/mod.ts";
import { walk, WalkEntry } from "https://deno.land/std@0.100.0/fs/mod.ts";

const { depth = "2", type, help, regex, _: [dir = "."] } = parse(Deno.args);

if (help) {
  console.log("denofind");
  console.log("Usage");
  console.log(`  denofind --type=file --regex="*.\.ts" --depth=3 target_dir`);
  Deno.exit(0);
}

const types = type ? (Array.isArray(type) ? type : [type]) : ["file", "dir"];
const match = regex
  ? (Array.isArray(regex) ? regex : [regex]).map(
    (str) => new RegExp(str),
  )
  : undefined;

const options = {
  maxDepth: Number(depth + 10),
  includeFiles: types.includes("file"),
  includeDirs: types.includes("dir"),
  match,
  skip: [/\.git$/],
};

const dirFullPath = resolve(Deno.cwd(), String(dir));
const entries: WalkEntry[] = [];
for await (const entry of walk(dirFullPath, options)) {
  entries.push(entry);
}

entries.sort((a, b) => a.path > b.path ? 1 : -1).forEach((entry) => {
  console.log(
    entry.path === dirFullPath
      ? "."
      : relative(dirFullPath, entry.path).replace(
        entry.name,
        "|--" + entry.name,
      )
        .replace(/[^\/]+\//g, "|  "),
  );
});
