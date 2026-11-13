# 审查用 Git Worktree

凡需在本地 **跑测试、复现行为** 的审查，**一律**使用本文流程；**不在主工作区 `git checkout`**。

静态审查（`gh pr diff`）不需要 worktree。

合并目标分支固定为 **`develop`**（非 develop 为 base 的 PR 一般不入库，遇到时停止审查并告知用户）。

---

## 1. 目录约定

worktree 放在主仓库同级 `.tdesign-react-cr/pr-<N>/` 下：

- **develop**：`$WT_DEVELOP` → `${REPO}/../.tdesign-react-cr/pr-${N}/develop`（`origin/develop`）
- **pr**：`$WT_PR` → `${REPO}/../.tdesign-react-cr/pr-${N}/pr`（本地分支 `pr-${N}`）

`REPO=$(git rev-parse --show-toplevel)`，`N` 为 PR 编号。

---

## 2. 创建

```bash
N=<PR编号>
REPO=$(git rev-parse --show-toplevel)

git fetch origin develop "pull/${N}/head:pr-${N}"

WT_DEVELOP="${REPO}/../.tdesign-react-cr/pr-${N}/develop"
WT_PR="${REPO}/../.tdesign-react-cr/pr-${N}/pr"

test -d "$WT_DEVELOP" || git worktree add -d "$WT_DEVELOP" origin/develop
test -d "$WT_PR" || git worktree add -d "$WT_PR" "pr-${N}"
```

使用 **`-d`（detached HEAD）**，避免与主工作区争抢分支名。

---

## 3. 依赖

在 `$WT_DEVELOP` 与 `$WT_PR` **分别**执行：

```bash
pnpm run init
pnpm install
```

---

## 4. 清理

```bash
git worktree remove "$WT_DEVELOP"
git worktree remove "$WT_PR"
git branch -d "pr-${N}"
```

`git worktree list` 查看残留。
