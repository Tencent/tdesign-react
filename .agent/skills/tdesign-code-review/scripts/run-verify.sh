#!/usr/bin/env bash

# 在 develop 或审查分支上执行验证测试

set -euo pipefail

MODE="${1:?usage: run-verify.sh <develop|pr> <test-path> [test-util-path...]}"
TEST_PATH="${2:?usage: run-verify.sh <develop|pr> <test-path> [test-util-path...]}"
shift 2

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$(dirname "${SCRIPT_DIR}")"
STATE_FILE="${RUNTIME_DIR}/restore-state.env"

if [[ ! -f "${STATE_FILE}" ]]; then
  echo "[run-verify] 缺少运行状态：${STATE_FILE}" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "${STATE_FILE}"
: "${WORKTREE_DIR:?WORKTREE_DIR missing from restore-state.env}"

PR_BRANCH="pr-$(basename "${RUNTIME_DIR}" | sed 's/^pr-//')"

case "${MODE}" in
  develop)
    git -C "${WORKTREE_DIR}" switch --detach origin/develop
    ;;
  pr)
    if [[ $# -gt 0 ]]; then
      echo "[run-verify] pr 模式不接受测试工具路径" >&2
      exit 1
    fi
    if ! git -C "${WORKTREE_DIR}" switch "${PR_BRANCH}"; then
      git -C "${WORKTREE_DIR}" reset --merge "${PR_BRANCH}"
      git -C "${WORKTREE_DIR}" switch "${PR_BRANCH}"
    fi
    ;;
  *)
    echo "[run-verify] 不支持的模式：${MODE}" >&2
    exit 1
    ;;
esac

git -C "${WORKTREE_DIR}" submodule update --init packages/common
bash "${SCRIPT_DIR}/sync-deps.sh"

if [[ "${MODE}" == "develop" && $# -gt 0 ]]; then
  git -C "${WORKTREE_DIR}" checkout "${PR_BRANCH}" -- "$@"
fi

pnpm --dir "${WORKTREE_DIR}" exec vitest run "${TEST_PATH}"
