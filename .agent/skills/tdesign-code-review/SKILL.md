---
name: tdesign-code-review
description: Reviews Tencent/tdesign-react GitHub pull requests through static analysis, targeted regression tests, browser demos. Use when the user explicitly invokes this skill with a PR number or URL.
---

# TDesign 组件代码审查指南

## 0. 全程规范

- `reference/*.md` 仅在流程推进到对应章节时读取。
- `scripts/` 的实现仅在命令退出码非 0 且 stderr 不足以定位问题时阅读源码。正常流程时直接执行文档中的完整命令。
- 默认只审查，不提交代码。

### 0.1 流程状态

严格按以下状态推进，禁止跳过提及的 `AskQuestion` 交互状态：

预检 → 获取 PR → 静态审查 → 本地验证 → 输出报告 → 准备演示 → 输出地址 → 清理文件 → 结束

### 0.1 安装依赖

根据 [PREFLIGHT_CHECK.md](reference/PREFLIGHT_CHECK.md) 确认 `gh` 的安装与登录。

---

## 1. 获取 PR 信息

### 1.1 解析编号

从用户输入提取 `N`：

| 输入                                        | 处理       |
| ------------------------------------------- | ---------- |
| 纯数字                                      | 即 `N`     |
| `github.com/Tencent/tdesign-react/pull/<N>` | 提取 `N`   |
| 其他仓库                                    | 停止       |
| 无法解析                                    | 向用户询问 |

### 1.2 拉取信息

```bash
# 读取 PR 标题、正文与目标分支
gh pr view "$N" --repo Tencent/tdesign-react --json title,body,baseRefName
```

`baseRefName` ≠ `develop` 时停止审查流程，并告知用户。

---

## 2. 静态审查

```bash
# 列出变更文件及增删行数
gh pr view "$N" --repo Tencent/tdesign-react --json files --jq '.files[] | "\(.path)\t+\(.additions)\t-\(.deletions)"'

# 展开源码变更（排除快照）
gh pr diff "$N" --repo Tencent/tdesign-react | awk '/^diff --git /{skip=($0 ~ /\.snap( |$)|\/__snapshots__\//)} !skip'
```

### 2.1 审查标准

#### 变更范围

是否存在大规模重构、意外删改、或偏离 PR 目标的变更。

#### 逻辑正确性

是否事件链、状态流转、生命周期、边界条件均正确。

#### API 契约

是否公开 API、类型、默认值、行为与文档及历史用法兼容。

#### 样式与结构

涉及类名、内联 `style` 或 `packages/common/style` 时，须对照该组件 `packages/common/style/web/components/<组件>/` 后再判断：

- **ClassName**：是否使用 `classPrefix`，且 BEM 与同组件 common Less 一致。
- **Inline style**：是否仅用于运行时测量或交互结果（例如宽高、transform 等）。禁止将静态间距、颜色、对齐以内联补丁代替 common Less，从而破坏组件样式，导致观感与 TDesign 设计风格不一致。

#### 测试质量

严格遵循 [tdesign-component-test](../tdesign-component-test/SKILL.md) **§3** 的规范。

### 2.2 合并判定

| 建议       | 条件                           |
| ---------- | ------------------------------ |
| 暂不合并   | 生产与测试通过未达标           |
| 修改后合并 | 生产与测试通过，但存在代码建议 |
| 合并       | 无任何代码建议                 |

---

## 3. 本地验证

本地验证以测试断言为准。开始前不沿调用链预推断言结果。

### 3.1 创建审查 worktree

主工作区不进行修改。每个 PR 使用独立 worktree，多个 PR 可以并行准备。

在主工作区执行：

```bash
SKILL_DIR="$(git rev-parse --show-toplevel)/.agent/skills/tdesign-code-review"
bash "${SKILL_DIR}/scripts/prepare-review.sh" "$N"
```

执行后：

- 从 `origin` 更新 `develop`，并将该 PR 的头部提交写入本地分支 `pr-<N>`，同时绑定该分支的 push remote；
- 在主工作区之外创建 worktree 并 checkout `pr-<N>`，按该提交记录的 submodule 指针初始化 `packages/common`；
- 将主工作区已安装的 `node_modules` 链接到 worktree。

读取输出字段：

| 字段           | 含义                                   |
| -------------- | -------------------------------------- |
| `WORKTREE_DIR` | 测试文件、分支切换和 Vitest 的工作目录 |
| `RUNTIME_DIR`  | 演示与清理脚本所在目录                 |
| `PR_BRANCH`    | 本地审查分支，值为 `pr-<N>`            |

### 3.2 编写测试用例

在 `WORKTREE_DIR` 中编写未跟踪的验证测试。PR 已包含新增或修改的测试时，将对应场景并入该文件，沿用其断言与测试工具：

```bash
TEST_PATH="packages/components/<component>/__tests__/review-pr-<N>.test.tsx"
```

`TEST_PATH` 相对于 `WORKTREE_DIR`。

### 3.3 执行测试与核验结果

#### 修复类

如果测试依赖本次 PR 新增或修改的工具（`test/utils/` 等）。根据 §2 变更列出的测试工具文件路径，记为 `TEST_UTIL_PATHS`。没有此类路径时，`TEST_UTIL_PATHS` 为空。

1. 在 `origin/develop` 执行，确认**失败**，且失败为该缺陷的断言。未失败时禁止进入第 2 步。

   ```bash
   bash "${RUNTIME_DIR}/scripts/run-verify.sh" develop "${TEST_PATH}" ${TEST_UTIL_PATHS}
   ```

2. 回到 `PR_BRANCH` 执行，确认**通过**。此后保持在该分支，供后续演示使用。

   ```bash
   bash "${RUNTIME_DIR}/scripts/run-verify.sh" pr "${TEST_PATH}"
   ```

#### 功能类

只在 `PR_BRANCH` 执行新增或修改的测试，确认**通过**。不在 `origin/develop` 上执行。新增 API 在 `develop` 上没有对应实现，测试失败是必然结果，不能说明该功能是否成立：

```bash
pnpm --dir "${WORKTREE_DIR}" exec vitest run "${TEST_PATH}"
```

---

## 4. 输出报告

审查报告消息**有且仅有**下方 Markdown 模板的填充结果；完整审查仍须继续执行 **§5**。

```markdown
# PR #<N> 代码审查

## 合并建议

合并 / 修改后合并 / 暂不合并

## 变更日志

中文简洁摘要（默认使用一句话总结；仅当多个组件各自存在独立的可见变更时，按组件分别撰写一句话。）

## 代码解释

采用工程化、正式、严谨的技术文档表达，避免口语化描述及无关细节。

变更可定位至具体代码行时，根据代码段逐项输出，格式如下：

`packages/components/xxx/Foo.tsx:23-45`

- **场景**：说明触发该改动的具体条件及执行场景。
- **原始缺陷**：说明旧实现在该场景下的错误结果。
- **本段改动**：说明本次代码如何约束或修正上述行为。

当代码改动较为分散、单一修改点不足以说明变更动机时，无需引用具体行号，应从整体逻辑出发，以一段完整文字概述本次改动的设计意图，说明原有逻辑的设计原因、适用条件及其失效场景，以及本次改动如何在原有行为基础上进行衔接和完善，确保变更背景、问题原因与解决方案之间的逻辑关系清晰。

## 代码建议

从以下两个维度评估代码改进空间：

1. **更优方案**：判断当前实现是否存在更合理、高效或简洁的替代方案。
2. **书写逻辑**：判断现有逻辑是否存在可合并的分支、可提前返回的路径或可消除的重复逻辑。

仅输出实际成立的建议；两项均无改进空间时，仅输出：`无`。

每条建议必须对应一处具体代码，并标注文件路径及行号，输出格式：

`packages/components/xxx/Foo.tsx:42`

- **更优方案**：说明当前实现的局限性，并给出可替代的实现方案及其改进价值。
- **书写逻辑**：说明可合并的分支、可提前返回的路径或可消除的重复逻辑，并明确具体优化方式。
```

**报告正文严禁在模板之外追加任何说明。**

---

## 5. 示例演示

### 5.1 准备文件

`WORKTREE_DIR` 的 HEAD 保持 `PR_BRANCH`，并获取 `RUNTIME_DIR`：

```bash
RUNTIME_DIR="$(git rev-parse --path-format=absolute --git-common-dir)/tdesign-code-review/pr-${N}"
```

编写 `/tmp/review-pr-<N>-demo.tsx`：

- 导出 `export function Demo`，依赖自行 React 相关 `import`；
- 被测的 TDesign 组件从 `components` 解构，子组件通过主组件访问（例如 `Form.FormItem`），禁止从 `tdesign-react` 导入。

例如：

```tsx
import { useState } from "react";

export function Demo({ components }: { components: Record<string, any> }) {
  const { Button } = components;
  const [count, setCount] = useState(0);
  return (
    <Button onClick={() => setCount((value) => value + 1)}>{count}</Button>
  );
}
```

`<description>` 须写明 UI 页面上的操作步骤及预期现象。

### 5.2 生成演示

`pack-published.mjs` 把 npm 上最新的 `tdesign-react` 解压到 worktree 的 `.review/packages/tdesign-react`。

`write-demo.mjs` 用复现文件生成 `.review/pr-<N>` 演示应用。参数依次为 PR 编号、场景描述、复现文件路径、展示模式。

#### 修复类

先准备已发布包，再生成线上版本与 PR 实现的对比页面：

```bash
node "${RUNTIME_DIR}/scripts/pack-published.mjs"
node "${RUNTIME_DIR}/scripts/write-demo.mjs" \
  "$N" "<description>" "/tmp/review-pr-${N}-demo.tsx" compare
```

#### 功能类

只生成 PR 源码页，不下载已发布包，生成仅包含 PR 实现的独立展示页面：

```bash
node "${RUNTIME_DIR}/scripts/write-demo.mjs" \
  "$N" "<description>" "/tmp/review-pr-${N}-demo.tsx" standalone
```

### 5.3 启动服务

执行服务检测与启动脚本并从输出结果提取地址：

```bash
DEV_RESULT="$(bash "${RUNTIME_DIR}/scripts/ensure-dev.sh")"
REVIEW_URL="$(node -e 'process.stdout.write(JSON.parse(process.argv[1]).url)' "${DEV_RESULT}")"
```

### 5.4 确认效果

#### 演示页面

调用 `AskQuestion`，并使用下面的模板，将 `${REVIEW_URL}` 填入地址：

```text
请核验演示效果 ${REVIEW_URL} 是否符合预期。
```

选项与后续操作：

| 选项         | 操作                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| **符合预期** | 进入第 2 步                                                                              |
| **存在问题** | 停留在该 worktree 的 `pr-<N>`，依据反馈重新验证、更新报告并重新生成演示，再次进入第 1 步 |

#### 清理环境

如果用户选择 **符合预期**，另行调用 `AskQuestion` 询问是否移除该 PR 的审查产物：

| 选项     | 操作                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| **保留** | 保留该 worktree、测试文件与演示进程，不修改主工作区                                                           |
| **删除** | 执行 `bash "${RUNTIME_DIR}/scripts/cleanup-review.sh" "$N" "${TEST_PATH:-}"`，移除 worktree、本地 `pr-<N>` 等 |
