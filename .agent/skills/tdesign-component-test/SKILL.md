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

- 固定顶层结构：每个组件的测试文件仅允许以下四种顶层 describe：`props`、`events`、`instanceFunctions`、`scenarios`。禁止在组件根 describe 下直接编写 `test(...)`；禁止新增以下四类平级的顶层 describe。

- 同一 prop、API 或场景存在 ≥ 3 条 `test`，或存在组内共用的 render、fixture、mock 数据时，在已选定的顶层 describe 内新增子 describe；否则直接编写 `test`，不新增子 describe。

```tsx
describe("ComponentName", () => {
  describe("props", () => {
    // 1. 优先合并同构用例。同一属性、同一行为下的多种类型、边界值及组合条件，合并为一个用例，具体取值留在用例内部。

    // 2. 按需拆分用例。断言无法共用时再拆分，每条用例只覆盖一种类型或一个枚举值。

    // 3. 规范用例标题。方括号内只写具体类型或合法枚举值；同一条用例覆盖多种类型或枚举值时，用斜杠写在同一个方括号内，如 `propName[boolean/TNode]`、`propName[TNode/function]`、`propName[top/bottom/left]`。禁止把同一属性写成 `propName[boolean] and propName[TNode]`。不同属性各自编写；一条用例必须同时覆盖多个属性时用 `and` 连接，各属性自己的多种类型仍用斜杠，如 `cancelBtn[object/TNode] and confirmBtn[object/TNode]`。不得在方括号内写具体数值。数组类型写成 `array<T>`，禁止 `string[]`。布尔属性常规开启时直接写属性名；只验证关闭时写 `propName[false]`；同一用例同时覆盖开启和关闭时写 `propName[boolean]`；与其他类型一起出现时放进斜杠，如 `propName[false/TNode/function]`。
  });
  describe("events", () => {
    // 回调 prop（onChange 等）是否触发
  });
  describe("instanceFunctions", () => {
    // ref 命令式 API、Plugin 静态方法等（无则省略）
  });
  describe("scenarios", () => {
    // 1. 覆盖多 API 联动的完整业务流

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
