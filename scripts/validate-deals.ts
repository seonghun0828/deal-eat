import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { dealsFileSchema } from "../lib/schema";

const currentFilePath = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(currentFilePath), "..");
const dealsPath = resolve(repoRoot, "deals.json");

function readCurrentDealsFile() {
  const raw = readFileSync(dealsPath, "utf8");
  const parsed = JSON.parse(raw);
  return dealsFileSchema.parse(parsed);
}

function readPreviousDealsFile() {
  try {
    const raw = execSync("git show HEAD^:deals.json", {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "ignore"],
    }).toString("utf8");

    return dealsFileSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

function stableStringify(value: unknown): string {
  return JSON.stringify(value);
}

function validateUpdatedAtChange() {
  const current = readCurrentDealsFile();
  const previous = readPreviousDealsFile();

  if (!previous) {
    return;
  }

  const dealsChanged =
    stableStringify(previous.deals) !== stableStringify(current.deals);
  const updatedAtChanged = previous.updated_at !== current.updated_at;

  if (dealsChanged && !updatedAtChanged) {
    throw new Error("updated_at must change when deals[] changes");
  }
}

function main() {
  readCurrentDealsFile();
  validateUpdatedAtChange();
  console.log("deals.json is valid");
}

main();
