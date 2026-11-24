// Last Text at One Percent — the final message a dying phone sends.
//
// The harness expects exactly one artefact: entry.txt inside the directory
// named by MAKEFUN_OUTPUT_DIR (default "/output"). The entry itself is a
// single line of plain text — the phone's last text at 1% battery — so this
// program keeps the message in one constant, validates it against the gate
// rules (1 to 200 characters, not only whitespace, one clean line), and
// writes it out.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// The message is assembled from its three beats — the urgent opening, the
// phone's last requests, and the sign-off — then joined with single spaces
// so the emitted text stays exactly one line.
const MESSAGE_PARTS = [
  "At 1% so listen fast:",
  "tell my charger I forgive the tangled cord, delete the folder called 'definitely taxes',",
  "and if this cuts off mid-sen—",
] as const;

const MESSAGE = MESSAGE_PARTS.join(" ");

const MAX_CHARS = 200;

function checkMessage(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("message must not be empty or only whitespace");
  }
  if (text.trim() !== text || text.includes("\n")) {
    throw new Error("message must be one clean line, no stray whitespace");
  }
  if (text.length > MAX_CHARS) {
    throw new Error(`message is ${text.length} chars, limit is ${MAX_CHARS}`);
  }
}

async function main(): Promise<void> {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  checkMessage(MESSAGE);
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "entry.txt"), MESSAGE, "utf8");
  console.log(`wrote entry.txt (${MESSAGE.length} chars)`);
}

await main();
