---
name: tdesign-code-review
description: This skill should be used when reviewing GitHub Pull Requests, analyzing code changes, identifying bugs or regressions, checking implementation quality, or modifying code based on an existing PR in the TDesign React repository. First complete PREFLIGHT_CHECK.md (install and gh auth login).
---

# TDesign 组件代码审查指南

## 前置依赖

先完成同目录 **[PREFLIGHT_CHECK.md](./PREFLIGHT_CHECK.md)**，确保 `gh` 已安装且已登录。  
拉取 PR 见下文 **步骤 1**。

---

## 执行流程

### 1. 用 `gh` 获取 PR

**解析目标 PR**

- URL：`https://github.com/Tencent/tdesign-react/pull/<N>`

- 或 PR 编号 `<N>`

**拉取**

```bash
gh pr view <N> --repo <owner>/<repo> --json \
  title,body,state,author,baseRefName,headRefName,baseRepository,headRepository,\
  additions,deletions,changedFiles,commits,url,reviews,comments

gh pr view <N> --repo <owner>/<repo>          # 可读摘要，按需
gh pr diff <N> --repo <owner>/<repo>            # diff 主入口
gh pr checks <N> --repo <owner>/<repo>          # CI，按需
gh api repos/<owner>/<repo>/pulls/<N>/comments  # 按需
gh api repos/<owner>/<repo>/pulls/<N>/reviews   # 按需
```

从 PR `body` 记录：Issue、StackBlitz、pkg.pr.new、作者自测说明（报告中注明是否核对）。

审查报告 **数据源（必填）**：`GitHub CLI`。

---

### 2. 本地代码与测试（建议）

```bash
git fetch origin pull/<N>/head:pr-<N>
git diff origin/<baseRefName>...pr-<N>    # baseRefName 来自 gh pr view
pnpm exec vitest run <本次变更涉及的测试文件>
```

- `gh pr diff` 与本地 `git diff` 互相印证；不一致时以本地 `git` 为准并说明。
- 可选：`gh pr checkout <N> --repo <owner>/<repo>` 或 `git checkout pr-<N>` 跑测后切回。

---

### 3. 执行 Code Review

**Bug & Regression**：逻辑、兼容、边界、异步/状态；事件类改动追踪调用链（如 Table：`THead` ↔ `useColumnResize`），关注 ref/模块级状态是否在边界清空。

**Component API**：Props、默认值、事件、Ref/命令式 API、兼容性。

**Implementation**：React/Hooks、性能、TDesign 组件模式。

**Test Coverage**：关键路径与回归用例是否真有断言价值。

**Project Conventions**：目录与风格、`packages/common` submodule、`type.ts` / `defaultProps.ts` 禁止手改等（见 `AGENTS.md`）。

---

### 4. 测试文件规范

涉及测试时同步 **`tdesign-component-test`**：文件位置、`describe` 结构、用例标题；回归用例需修复前 fail / 修复后 pass。

---

### 5. Review Findings 验证

- 问题与本 PR diff 直接相关，有文件行号、触发条件、可执行建议。
- 无实据不报；无问题不凑 Findings。

---

## Review Report

### 0. 数据源

`GitHub CLI`；是否执行本地 vitest。

### 1. Summary

变更概览与总体结论。

### 2. Findings

| Severity | 含义                 |
| -------- | -------------------- |
| Critical | 核心功能/安全        |
| Major    | 明确 Bug、Regression |
| Minor    | 非阻塞问题           |

每项：**[Severity]**、File、Issue、Impact、Suggestion。

### 3. Test Review

覆盖度、规范、建议补充的回归用例。

### 4. Conclusion

**Approve** / **Request Changes** / **Needs Investigation**（`gh` 或本地测未跑通、diff 无法确认时）。

---

## PR Code Modification

1. 完成 **PREFLIGHT_CHECK.md**；读远程 PR 时执行 **步骤 1** 拉取。
2. `git fetch origin pull/<N>/head:pr-<N>` → `git checkout pr-<N>`（或 `gh pr checkout`）。
3. 改码、跑测；Push 前确认 head 仓库与分支。用户只要本地修改时不主动 Push。

---

## Review Principles

- 前置：**PREFLIGHT_CHECK** 保证 `gh` 已安装且已登录；**PR 数据**在步骤 1。
- 本地 `git` 用于 diff 对齐与测试，不替代 `gh` 拉 PR。
- Findings 须有代码依据；遵循 `AGENTS.md`。
- 未经用户授权不 Push、Merge。
