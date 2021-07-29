import {
  bold,
  green,
  magenta,
  red,
  underline,
  yellow,
} from "https://deno.land/std@0.103.0/fmt/colors.ts";

export function update(text: string) {
  console.log(magenta(bold(underline(text))));
}

export function fail(text: string) {
  console.log(red(bold(underline(text))));
}

export function load(text: string) {
  console.log(yellow(bold(underline(text))));
}

export function success(text: string) {
  console.log(green(bold(underline(text))));
}
