---
name: tdesign-component-test
description: This skill should be used when writing and maintaining unit tests for TDesign React components. It provides Vitest testing patterns, best practices, and snapshot testing guidance.
---

# TDesign 组件测试指南

本技能提供 TDesign React 组件单元测试的最佳实践。

## 测试触发条件

当用户需要执行以下任务时使用此技能：

- 为组件编写单元测试
- 更新或修复测试用例
- 运行快照测试
- 提高测试覆盖率

## 测试框架和工具

| 工具                        | 用途               |
| --------------------------- | ------------------ |
| Vitest                      | 测试运行器         |
| @testing-library/react      | React 组件测试工具 |
| @testing-library/user-event | 用户交互模拟       |
| @testing-library/jest-dom   | DOM 断言扩展       |

`@test/utils` 已封装常用工具，包括：

- `render` - 组件渲染
- `fireEvent` - 事件触发
- `vi` - Vitest mock 工具
- `act` - React act wrapper
- `userEvent` - 用户交互模拟
- `mockDelay` / `mockTimeout` - 异步等待
- `simulateInputChange` - 输入模拟
- `simulateKeydownEvent` - 键盘事件模拟
- `waitFor` - 异步断言

## 测试文件规范

### 文件位置和命名

```bash
packages/components/[component-name]/
└── __tests__/
    ├── [component-name].test.tsx    # 主组件单元测试（推荐）
    ├── [sub-module].test.tsx        # 子模块拆分测试（可选）
    └── __snapshots__/               # 快照目录（按需生成）
```

### 文件内容和结构

- 固定顶层结构：每个组件的测试文件仅允许以下四种顶层 describe：props、events、instanceFunctions、scenarios。无相关测试内容时可省略对应分组。

- 用例较少时：在对应的顶层 describe 中编写 `test(...)`，不额外嵌套。

- 用例较多时：在对应的顶层 describe 内，可按具体功能维度嵌套子 describe，再编写 `test(...)`。

- 层级约束：禁止在组件根 describe 下直接编写 `test(...)`，也禁止新增其他顶层 describe。

```tsx
describe("ComponentName", () => {
  describe("props", () => {
    // 1. 按需使用 `propName[type]`（如 TNode、function、number）或 `propName[enumValue]`
    // 2. 方括号仅允许具体类型或合法枚举值，禁止写具体数值。数组类型统一写成 `array<T>`，禁止使用 `string[]` 等；
    //    布尔属性按常规方式开启（传入 `true` 或使用简写）时直接写属性名；仅显式验证关闭时写 `[false]`；同一用例覆盖两种取值时才写 `[boolean]`
    // 3. 同一属性的多个枚举值若测试结构与断言一致，应提取取值列表并使用 `forEach` 生成独立的 `test('propName[enumValue]')`，避免重复编写同构用例
    // 4. 同一行为涉及多个边界值或组合条件，且无需通过标题分别表达时，合并进单个 `test('propName')`，具体阈值与数据留在用例内
    // 5. 若标题必须补充复杂目的或场景描述时才能表达，应将用例移入 scenarios
  });
  describe("events", () => {
    // 回调 prop（onChange 等）是否触发
  });
  describe("instanceFunctions", () => {
    // ref 命令式 API、Plugin 静态方法等（无则省略）
  });
  describe("scenarios", () => {
    // 1. 覆盖多 API 联动的完整业务流；复杂时可嵌套子 `describe`
    // 2. 标题应明确涉及的 API 与测试目的，优先使用自然语言，仅在枚举值是关键条件时保留 `[enumValue]`
    // 3. 单 prop、多 prop 组合的简单渲染测试归入 `props`，不应放在此模块
    // 4. 仅验证回调是否触发及参数的测试归入 `events`
});
```

## 测试命令

```bash
pnpm test                                                    # 运行所有测试
pnpm test:coverage                                           # 生成覆盖率
pnpm test:ui                                                 # 启动测试 UI
pnpm test:snap                                               # 校验全部快照
pnpm test:update                                             # 更新全部快照
pnpm exec vitest run <component>                             # 运行指定组件的测试
```

> `<component>` 替换为实际组件名，例如 `button`。

快照测试文件：

- CSR：`test/snap/csr.test.jsx`，自动为所有 `_example/*.tsx` 生成快照。
- SSR：`test/snap/ssr.test.jsx`。

---

## 常见问题

### Q: 如何处理异步组件？

A: 使用 `mockDelay`、`mockTimeout`、`waitFor` 或 `act`，在断言前等待 UI 更新。

### Q: 快照测试失败怎么办？

A: 首先检查变更是否预期内。如果是预期变更，用上面的 `pnpm test:update` 或带 `-u` 的组件命令更新快照。
