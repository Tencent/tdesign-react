---
name: tdesign-code-review
description: This skill should be used when reviewing GitHub Pull Requests, analyzing code changes, identifying bugs or regressions, checking implementation quality, or modifying code based on an existing PR in the TDesign React repository.
---

# TDesign 组件代码审查指南

## 0. 前置检查

先执行 [PREFLIGHT_CHECK.md](reference/PREFLIGHT_CHECK.md)，确保 `gh` 已安装且已登录。

默认只审查，不提交代码。

---

## 1. 获取 PR 信息

仓库固定为 `Tencent/tdesign-react`，`gh` 命令中的 `--repo` 均使用该值。

### 1.1 解析 PR 编号

从用户输入提取 `N`：

| 输入                                            | 处理                            |
| ----------------------------------------------- | ------------------------------- |
| 纯数字                                          | 直接作为 `N`                    |
| `github.com/Tencent/tdesign-react/.../pull/<N>` | 提取 `N`                        |
| 其他仓库 URL                                    | 停止，说明本 skill 仅支持该仓库 |
| 无法解析                                        | 向用户询问 PR 编号或 URL        |

### 1.2 获取 PR 内容

```bash
gh pr view "$N" --repo Tencent/tdesign-react --json title,body,baseRefName
```

**如果 PR 为 Bug Fix 类型，则需要额外执行[BUG_FIX.md](reference/BUG_FIX.md)流程；否则直接进入 §2。**

---

## 2. 分析 PR 代码变更

```bash
gh pr diff "$N" --repo Tencent/tdesign-react
```

**范围**

- [ ] 无大块无关重构

**逻辑**

- [ ] 事件调用链、模块级状态清理等

**契约**

- [ ] 公开 API / 默认值无非必要变更

**样式**

- [ ] `classPrefix`、无硬编码 `t-`；`packages/common` 改动合理

**测试**

- [ ] 新增用例格式是否遵循 [tdesign-component-test](../../tdesign-component-test/SKILL.md) 规范

---

## 3. 输出报告

## PR #<N> 审查结论

**类型**：Bug Fix | Feature（混合则两者都标注）
**标题**：简洁概括 PR
**建议**：代码是否有优化空间
**总结**：合并 | 修改后合并 | 暂不合并
