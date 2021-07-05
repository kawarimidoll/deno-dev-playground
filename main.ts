import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { resolve } from "https://deno.land/std@0.100.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.100.0/fs/mod.ts";

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
  maxDepth: Number(depth),
  includeFiles: types.includes("file"),
  includeDirs: types.includes("dir"),
  match,
  skip: [/\.git$/],
};

const dirFullPath = resolve(Deno.cwd(), String(dir));
console.log(dirFullPath);
for await (const entry of walk(dirFullPath, options)) {
  console.log(entry.name + (entry.isDirectory ? "/" : ""));
}
