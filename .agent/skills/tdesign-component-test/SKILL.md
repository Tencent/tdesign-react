---
name: tdesign-component-test
description: This skill should be used when writing and maintaining unit tests for TDesign React components. It provides Vitest testing patterns, best practices, and snapshot testing guidance.
---

# TDesign 组件测试指南

本技能提供 TDesign React 组件单元测试的最佳实践。

## 触发条件

当用户需要执行以下任务时使用此技能：

- 为新增的组件或 API 编写单元测试
- 为出现的 Bug 编写回归测试
- 提高测试覆盖率

### 设计原则

- 优先编写精简、针对性强的用例，避免冗长的测试逻辑。
- 针对 Bug 修复新增的回归测试，必须满足：
  - 在修复前的 develop 分支上测试失败。
  - 在 Bug 修复后的分支上测试通过。
  - 测试必须准确复现 Bug 场景，并验证修复后的预期行为。

## 框架和工具

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

## 文件规范

### 文件位置和命名

```bash
packages/components/[component-name]/
└── __tests__/
    ├── [component-name].test.tsx     # 主组件
    ├── [exported-component].test.tsx # 独立导出的子组件
    ├── [logic-module].test.ts        # 纯逻辑模块
    └── __snapshots__/                # 快照目录
```

- 测试用例优先写入被测对象已有的测试文件：主组件写入 [component-name].test.tsx；独立文件中的导出组件或纯逻辑模块写入对应测试文件，
  仅当被测对象尚无测试文件时，允许新建测试文件，且仅限两类：独立导出的组件（如 FormList、EnhancedTable 等）和 hooks、utils 等纯逻辑模块。
- 同一组件的附属节点不单独建测试文件，应在所属主组件的测试文件中覆盖，如 ListItem 写入 list.test.tsx。
- 测试用例数量不影响文件归属，禁止以用例数量为由拆分或新建测试文件。

### 文件内容和结构

- 固定顶层结构：组件渲染测试只允许以下四种顶层 describe：`props`、`events`、`instanceFunctions`、`scenarios`。禁止在组件根 describe 下直接编写 `test(...)`；禁止新增与上述四类平级的顶层 describe。hooks、utils 等纯逻辑测试文件按被测模块组织 describe，不套用这四种分类。
- 同一 prop、API 或场景存在 ≥ 3 条 `test`，或存在组内共用的 render、fixture、mock 数据时，在已选定的顶层 describe 内新增子 describe；否则直接编写 `test`，不新增子 describe。

#### 骨架示例

缺少对应示例时，可按需省略 `describe`。

```tsx
describe("ComponentName", () => {
  describe("props", () => {});
  describe("events", () => {});
  describe("instanceFunctions", () => {});
  describe("scenarios", () => {});
});
```

#### `props` — 属性与渲染

| 要点         | 说明                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| 合并同构用例 | 同一属性、同一行为下的多种类型、边界值及组合条件，优先合并为一个用例，具体取值写在用例内部 |
| 按需拆分     | 断言无法共用时再拆分；每条用例只覆盖一种类型或一个枚举值                                   |

**标题命名**

- 方括号内只写具体类型或合法枚举值；多种类型或枚举值写在同一对方括号内，用斜杠分隔，例如 `propName[boolean/TNode]`、`propName[TNode/function]`、`propName[top/bottom/left]`
- 禁止把同一属性拆成 `propName[boolean] and propName[TNode]`
- 不同属性各自一条用例；一条用例必须同时覆盖多个属性时用 `and` 连接，各属性内部的多种类型仍用斜杠，例如 `cancelBtn[object/TNode] and confirmBtn[object/TNode]`
- 不得在方括号内写具体数值
- 数组类型写成 `array<T>`，禁止 `string[]`
- 布尔属性：常规开启时标题直接写属性名；只验证关闭时写 `propName[false]`；同一条用例同时覆盖开/关时写 `propName[boolean]`；与其他类型同测时放进斜杠，例如 `propName[false/TNode/function]`

#### `events` — 事件与回调

- 覆盖回调 prop（如 `onChange`）是否按预期触发，以及回调参数是否符合约定

#### `instanceFunctions` — 命令式 API

- 覆盖 `ref` 暴露的命令式方法、Plugin 静态方法等；组件无此类 API 时省略整个 describe

#### `scenarios` — 联动与业务流

| 要点               | 说明                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------- |
| 范围               | 多 API 联动的完整业务流，而非单点渲染                                                     |
| 标题               | 写清涉及的 API 与测试目的，优先自然语言；仅当枚举值是关键前提时在标题中保留 `[enumValue]` |
| 与 `props` 的边界  | 单 prop 或多 prop 组合的简单渲染测试归入 `props`，不放在此处                              |
| 与 `events` 的边界 | 仅验证回调是否触发及参数的测试归入 `events`                                               |

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
