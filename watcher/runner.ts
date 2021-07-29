import { fail } from "./colored_log.ts";

function denoRun(cmd: string[], currentProcess?: Deno.Process) {
  if (currentProcess) {
    currentProcess.close();
  }

  if (!cmd || !cmd[0]) {
    throw new Error("Command inputs are required");
  }
  return Deno.run({ cmd: ["deno", ...cmd] });
}

async function watchProcessError(process: Deno.Process, onError: VoidFunction) {
  try {
    if ((await process.status()).success === false) {
      onError();
    }
  } catch (error) {
    fail(error);
  }
}

export function runAndWatchErrors(
  cmd: string[],
  onError: VoidFunction,
  ongoingProcess?: Deno.Process,
) {
  const process = denoRun(cmd, ongoingProcess);
  watchProcessError(process, onError);
  return process;
}
