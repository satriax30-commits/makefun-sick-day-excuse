// main.ts — "The Funniest Sick-Day Excuse"
// make.fun bounty: u-zeroxfive-the-funniest-sick-day-excuse-37423a36
//
// Writes exactly one original one-line sick-day excuse to
// <output-dir>/entry.txt (default output dir is /output, as the grader
// expects).
//
// Deterministic by construction: no network, no wall-clock, no randomness.
// Node 22, stdlib only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse (chosen direction: a sore throat, half-believable, with the
// punchline — "fax me" — landing on the very last words).
// Single line, no trailing newline in the entry file.
const EXCUSE =
  "I woke up sounding like a dial-up modem, so I'm staying home before anyone tries to fax me.";

// Gate: the entry must be UTF-8 text of 1-200 characters, not only
// whitespace, and a single line (the bounty is one line, nothing else).
function validateEntry(text: string): void {
  const length = [...text].length; // code-point count, not UTF-16 units
  if (length < 1 || length > 200) {
    throw new Error(`entry length ${length} is outside the 1-200 gate`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  // Optional first argument overrides the output directory (used for
  // local verification runs); the grader runs with no argument and
  // gets /output/entry.txt.
  const outDir = process.argv[2] ?? "/output";
  const outPath = join(outDir, "entry.txt");

  // Validate before writing: nothing invalid ever reaches the file.
  validateEntry(EXCUSE);

  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the gate counts the whole file content, so the
  // file is exactly the excuse and nothing else.
  writeFileSync(outPath, EXCUSE, "utf8");

  // Read-back self-check: what is on disk must be byte-identical to
  // the validated excuse, and must still pass the gate.
  const back = readFileSync(outPath, "utf8");
  if (back !== EXCUSE) {
    throw new Error("read-back mismatch: entry.txt differs from the excuse");
  }
  validateEntry(back);

  console.log(`wrote ${outPath} (${[...EXCUSE].length} chars)`);
}

main();
