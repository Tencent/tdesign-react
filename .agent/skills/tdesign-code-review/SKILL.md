---
name: tdesign-code-review
description: This skill should be used when reviewing GitHub Pull Requests, analyzing code changes, identifying bugs or regressions, checking implementation quality, or modifying code based on an existing PR in the TDesign React repository.
---

# TDesign 组件代码审查指南

## 0. 前置检查

先执行 [PREFLIGHT_CHECK.md](reference/PREFLIGHT_CHECK.md)（`gh` 安装与登录）。

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

`baseRefName` 不是 `develop` 时停止审查。

**Bug Fix PR 继续执行 §1.3，否则跳至 §2。**

---

### 1.3 摘录 PR 要点

| 字段     | 来源                                            |
| -------- | ----------------------------------------------- |
| Issue    | `Fixes #` / `Closes #` / 正文链接               |
| 组件     | `packages/components/<name>/` 或 PR 标题        |
| 复现材料 | 正文中的代码片段、CodeSandbox、StackBlitz、截图 |

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

### 2.1 缺陷验证（仅 Bug Fix）

**首先根据 [WORKTREE.md](reference/WORKTREE.md) 准备 `$WT_DEVELOP`、`$WT_PR`。**

#### 选择验证方式

在 `$WT_DEVELOP` 将复现用例写入临时测试文件 `__tests__/review-pr-<N>.test.tsx`

| 场景                    | 做法                   |
| ----------------------- | ---------------------- |
| **PR 描述里有复现代码** | 改写为 Vitest 用例     |
| **PR diff 含测试变更**  | 复制变更               |
| **以上皆无**            | 根据 §1.3 构造最小用例 |

#### 在 develop 上证明可复现

在 `$WT_DEVELOP`：

```bash
pnpm test -- packages/components/<component>/__tests__/...
```

| 结果     | 含义                                       |
| -------- | ------------------------------------------ |
| **失败** | 缺陷成立，继续下一步                       |
| **通过** | 未复现：查 common 版本、用例强度、触发条件 |

#### 在 PR 上证明已修复

在 `$WT_PR`：

```bash
pnpm test -- <与上一步相同路径>
```

| 结果        | 含义                   |
| ----------- | ---------------------- |
| **通过**    | 修复有效               |
| **仍失败**  | 合并建议不得为「合并」 |
| PR 自带用例 | 以 PR 内正式文件为准   |

---

## 3. 输出报告

---

## 模板（复制填写）

```markdown
# PR #<N> 代码审查

## 结论

- 类型：Bug Fix / Feature / 混合
- 标题：PR 原标题中文版 / 或总结PR 内容
- 合并建议：合并 / 修改后合并 / 暂不合并

## 摘要

- <改了什么、解决什么或新增什么>
- <风险或范围；无则写「无」>

## 证据

- gh pr view：已完成 / 失败
- gh pr diff：已完成 / 失败
- worktree：已完成 / 未执行 / 失败（<原因>）

## 验证

- develop：fail / pass / 未执行 / 不适用（Bug Fix 期望 fail；附 `pnpm test` 命令或原因）
- pr：pass / fail / 未执行 / 不适用（期望 pass；附命令或原因）
- 与 PR 描述一致：是 / 否 / 未验证

## 代码建议

无则只写一行：`无`

`packages/components/xxx/Foo.tsx:42`

<建议正文>

`packages/components/yyy/bar.test.tsx:18`

<建议正文>
```

---
