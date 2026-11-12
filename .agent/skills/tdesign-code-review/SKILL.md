---
name: tdesign-code-review
description: This skill should be used when reviewing GitHub Pull Requests, analyzing code changes, identifying bugs or regressions, checking implementation quality, or modifying code based on an existing PR in the TDesign React repository.
---

# TDesign 组件代码审查指南

## 前置依赖

先完成同目录 **[PREFLIGHT_CHECK.md](./PREFLIGHT_CHECK.md)**的流程，确保 `gh` 已安装且已登录。

---

## 执行流程

### 1. 用 `gh` 获取 PR

本 skill 只审查 **TDesign React**。`--repo` 固定为 `Tencent/tdesign-react`。

**从用户输入取出编号 `<N>`**

- 纯数字：直接作为 `<N>`，例如 `3856`
- URL：`https://github.com/Tencent/tdesign-react/pull/<N>`。只取 `/pull/` 后面的连续数字；`/files`、`/commits`、`/checks`、`?query`、`#fragment` 都丢掉
- 不是这个仓库的 URL：停止，并告诉用户本流程只处理 `Tencent/tdesign-react`

```bash
# INPUT 为 用户给的 URL 或 PR 数字
N=$(printf '%s\n' "$INPUT" | sed -nE 's#.*github\.com/Tencent/tdesign-react/pull/([0-9]+).*#\1#p')
[ -z "$N" ] && N=$INPUT

# 获取 PR 描述
gh pr view "$N" --repo Tencent/tdesign-react --json title,body
```

---

### 2. 本地代码与测试

```bash

# 获取远程 PR 代码，并在本地创建分支
git fetch origin pull/<N>/head:pr-<N>

# 对比 PR 分支与 develop 分支的差异
git diff origin/develop...pr-<N>
```

---

### 3. 执行 Code Review

**Bug & Regression**：逻辑、兼容、边界、异步/状态；事件类改动追踪调用链

**Component API**：Props、默认值、事件、Ref/命令式 API、兼容性。

**Implementation**：React/Hooks、性能、TDesign 组件模式。

**Test Coverage**：关键路径与回归用例是否真有断言价值（参考 `tdesign-component-test` 规范）

---

### 4. 生成总结报告

【PR 描述简洁概括】

- Component API 改动点
- Bug / Regression 风险点
- Implementation 改进
- Test Coverage 建议

【总结：是否建议合并】
