---
name: tdesign-code-review
description: This skill should be used when reviewing GitHub Pull Requests, analyzing code changes, identifying bugs or regressions, checking implementation quality, or modifying code based on an existing PR in the TDesign React repository.
---

# TDesign 组件代码审查指南

## 前置依赖

先执行同目录 `PREFLIGHT_CHECK.md` 中的检查流程，确保：

- 已安装 GitHub CLI（`gh`），且确认登录状态
- 本地工作区状态已确认，避免覆盖用户未提交的修改。

本 Skill 默认只进行代码审查，不主动提交代码。

---

## 执行流程

### 1. 获取 PR 信息

本 skill 只审查 **TDesign React**。`--repo` 固定为 `Tencent/tdesign-react`。

#### 1.1 解析用户输入

从用户输入中提取 PR 编号 `N`：

- 纯数字：直接作为 PR 编号，例如 `3856`。
- PR URL：提取 `/pull/` 后面的连续数字。
- URL 必须属于 `github.com/Tencent/tdesign-react`。
- 其他仓库的 URL：停止执行，告知用户当前 Skill 只处理 `Tencent/tdesign-react`。
- 无法解析 PR 编号：向用户询问 PR 编号或 URL。

#### 1.2 获取 PR 信息

```bash
gh pr view "$N" --repo Tencent/tdesign-react --json title,body
```

#### 1.3 复现场景

如果是 API 改动 PR，跳过这一步。

如果是 Bug 修复 PR，分析 PR 描述是否有可复现步骤：

- 相关 issue：查询issue中是否有可复现代码、CodeSandbox 或 StackBlitz链接、截图，或者明确的复现步骤。
- 可复现代码
- CodeSandbox 链接
- StackBlitz 链接
- 截图
- TDesign 在线官网对应 Demo 地址

在本地执行复现步骤，确认问题是否存在。
可以在develop分支临时新建文件，并开启进行调试，确认问题是否存在。

### 2. 本地代码与测试

### 2.1 程序可执行性

```bash

# 获取远程 PR 代码，并在本地创建分支
git fetch origin pull/<N>/head:pr-<N>

# 切换到 PR 分支
git checkout pr-<N>
```

再次运行复现 Demo，验证是否能正常运行，Bug 是否不再出现。

### 2.2 代码可维护性

```bash
# 对比 PR 分支与 develop 分支的差异
git --no-pager diff origin/develop...pr-<N>
```

分析代码逻辑：

**Bug & Regression**：逻辑、兼容、边界、异步/状态；事件类改动追踪调用链

**Component API**：Props、默认值、事件、Ref/命令式 API、兼容性。

**Implementation**：React/Hooks、性能、TDesign 组件模式。

**Test Coverage**：关键路径与回归用例是否真有断言价值（参考 `tdesign-component-test` 规范）

### 3. 生成总结报告

【PR 描述简洁概括】

- Component API 改动点
- Bug / Regression 风险点
- Implementation 改进
- Test Coverage 建议

【总结：是否建议合并】
