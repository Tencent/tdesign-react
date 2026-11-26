/* 读取审查运行时的 worktree 目录 */

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function reviewWorktreeDir() {
  const libDir = path.dirname(fileURLToPath(import.meta.url));
  const stateFile = path.join(libDir, "../../restore-state.env");
  const worktreeDir = execFileSync(
    "bash",
    ["-c", 'source "$1" && printf %s "$WORKTREE_DIR"', "bash", stateFile],
    { encoding: "utf8" },
  );
  if (!worktreeDir) {
    throw new Error(`WORKTREE_DIR missing from ${stateFile}`);
  }
  return worktreeDir;
}
