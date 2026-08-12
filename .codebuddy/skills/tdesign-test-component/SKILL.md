---
name: tdesign-test-component
description: This skill should be used when writing or maintaining unit tests for TDesign React components. It provides testing patterns, best practices, and SOP for Vitest-based component testing including snapshot tests.
---

# TDesign 组件测试指南

本技能提供 TDesign React 组件单元测试的完整 SOP 和最佳实践。

## 触发条件

当用户需要执行以下任务时使用此技能：
- 为组件编写单元测试
- 更新或修复测试用例
- 运行快照测试
- 提高测试覆盖率

## 测试框架和工具

| 工具 | 用途 |
|------|------|
| Vitest | 测试运行器 |
| @testing-library/react | React 组件测试工具 |
| @testing-library/user-event | 用户交互模拟 |
| @testing-library/jest-dom | DOM 断言扩展 |

## 测试文件规范

### 文件位置和命名

```
packages/components/[component-name]/
└── __tests__/
    ├── vitest-[component-name].test.jsx   # 单元测试
    └── __snapshots__/                     # 快照文件（自动生成）
```

**命名格式**：`vitest-[component-name].test.jsx`

⚠️ **注意**：测试文件由 API 平台生成，文件头部有注释标记。

### 测试工具导入

```javascript
import { render, fireEvent, vi } from '@test/utils';
import { ComponentName } from '..';
```

`@test/utils` 已封装常用工具，包括：
- `render` - 组件渲染
- `fireEvent` - 事件触发
- `vi` - Vitest mock 工具
- `act` - React act wrapper
- `userEvent` - 用户交互模拟
- `mockDelay` - 异步延迟模拟
- `simulateInputChange` - 输入模拟
- `simulateKeydownEvent` - 键盘事件模拟

## SOP 流程

### Step 1: 基础渲染测试

测试组件能否正常渲染：

```javascript
describe('ExampleComponent', () => {
  it('renders correctly', () => {
    const { container } = render(<ExampleComponent />);
    expect(container.firstChild).toHaveClass('t-example-component');
  });
});
```

### Step 2: Props 测试

为每个 prop 编写测试用例：

```javascript
// Boolean prop 测试模式
it('props.disabled works fine', () => {
  // 默认值测试
  const { container: container1 } = render(<Button>Text</Button>);
  expect(container1.querySelector('.t-is-disabled')).toBeFalsy();
  
  // disabled = true
  const { container: container2 } = render(<Button disabled={true}>Text</Button>);
  expect(container2.firstChild).toHaveClass('t-is-disabled');
  expect(container2).toMatchSnapshot();
  
  // disabled = false
  const { container: container3 } = render(<Button disabled={false}>Text</Button>);
  expect(container3.querySelector('.t-is-disabled')).toBeFalsy();
});

// 枚举 prop 测试模式
['small', 'medium', 'large'].forEach((item) => {
  it(`props.size is equal to ${item}`, () => {
    const { container } = render(<Button size={item}>Text</Button>);
    // medium 是默认值，不添加额外类名
    if (item !== 'medium') {
      expect(container.firstChild).toHaveClass(`t-size-${item[0]}`);
    }
    expect(container).toMatchSnapshot();
  });
});
```

### Step 3: TNode 渲染测试

测试自定义渲染内容：

```javascript
it('props.children works fine', () => {
  const { container } = render(
    <Button>
      <span className="custom-node">TNode</span>
    </Button>
  );
  expect(container.querySelector('.custom-node')).toBeTruthy();
  expect(container).toMatchSnapshot();
});

it('props.icon works fine', () => {
  const { container } = render(
    <Button icon={<span className="custom-icon">Icon</span>}>Text</Button>
  );
  expect(container.querySelector('.custom-icon')).toBeTruthy();
});
```

### Step 4: 事件测试

测试组件事件回调：

```javascript
it('events.click works fine', () => {
  const fn = vi.fn();
  const { container } = render(<Button onClick={fn}>Click</Button>);
  
  fireEvent.click(container.firstChild);
  
  expect(fn).toHaveBeenCalled();
  expect(fn.mock.calls[0][0].type).toBe('click');
});

// 禁用状态下事件不触发
it('disabled button should not trigger click', () => {
  const fn = vi.fn();
  const { container } = render(<Button disabled onClick={fn}>Click</Button>);
  
  fireEvent.click(container.firstChild);
  
  expect(fn).not.toHaveBeenCalled();
});
```

### Step 5: 异步操作测试

测试异步行为：

```javascript
import { mockDelay } from '@test/utils';

it('async operation works fine', async () => {
  const { container } = render(<AsyncComponent />);
  
  // 触发异步操作
  fireEvent.click(container.querySelector('.trigger'));
  
  // 等待异步完成
  await mockDelay(300);
  
  expect(container.querySelector('.result')).toBeTruthy();
});
```

### Step 6: 用户交互测试

使用 userEvent 进行复杂交互测试：

```javascript
import { userEvent } from '@test/utils';

it('user input works fine', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  
  const { container } = render(<Input onChange={onChange} />);
  const input = container.querySelector('input');
  
  await user.type(input, 'hello');
  
  expect(onChange).toHaveBeenCalled();
  expect(input.value).toBe('hello');
});
```

## 快照测试

### CSR 快照测试

位置：`test/snap/csr.test.jsx`

自动为所有 `_example/*.tsx` 生成快照：

```bash
# 运行 CSR 快照测试
NODE_ENV=test-snap pnpm test
```

### SSR 快照测试

位置：`test/snap/ssr.test.jsx`

测试服务端渲染输出。

### 更新快照

```bash
# 更新所有快照
pnpm test -- --update

# 更新特定组件快照
pnpm test button -- --update
```

## 运行测试命令

```bash
# 运行所有单元测试
pnpm test

# 运行特定组件测试
pnpm test button

# 运行测试并生成覆盖率报告
pnpm test -- --coverage

# 运行快照测试
NODE_ENV=test-snap pnpm test

# 交互式测试模式
pnpm test -- --ui
```

## 常见测试模式

### 测试 Loading 状态

```javascript
it('loading state shows loading indicator', () => {
  const { container } = render(<Button loading>Text</Button>);
  
  expect(container.firstChild).toHaveClass('t-is-loading');
  expect(container.querySelector('.t-loading')).toBeTruthy();
});
```

### 测试 DOM 属性

```javascript
it('href attribute works fine', () => {
  const { container } = render(<Button href="https://example.com">Link</Button>);
  
  expect(container.firstChild.getAttribute('href')).toBe('https://example.com');
  expect(container.firstChild.tagName.toLowerCase()).toBe('a');
});
```

### 测试 className 组合

```javascript
it('custom className is merged', () => {
  const { container } = render(<Button className="custom-class">Text</Button>);
  
  expect(container.firstChild).toHaveClass('t-button');
  expect(container.firstChild).toHaveClass('custom-class');
});
```

### Mock ResizeObserver

```javascript
class ResizeObserver {
  observe() { return this; }
  unobserve() { return this; }
}

beforeAll(() => {
  global.ResizeObserver = ResizeObserver;
});
```

### Mock 时间

```javascript
import MockDate from 'mockdate';

beforeEach(() => {
  MockDate.set('2020-12-28 00:00:00');
});

afterEach(() => {
  MockDate.reset();
});
```

## 测试检查清单

编写测试时，确保覆盖：

- [ ] 默认渲染
- [ ] 所有 boolean props（true/false 两种情况）
- [ ] 所有枚举 props 的每个值
- [ ] TNode 类型 props
- [ ] 事件回调触发
- [ ] 禁用状态下的行为
- [ ] 加载状态
- [ ] 边界情况（空值、极端值）
- [ ] 快照测试

## 测试覆盖率要求

- 整体覆盖率目标：> 80%
- 新组件要求：> 90% 行覆盖率
- 核心逻辑：100% 分支覆盖

## 常见问题

### Q: 测试文件是否可以手动编辑？

A: `vitest-*.test.jsx` 文件由 API 平台生成，文件头有注释标记。可以在其基础上添加额外测试，但核心测试应通过 API 平台维护。

### Q: 如何处理异步组件？

A: 使用 `mockDelay` 或 `act` wrapper，确保异步操作完成后再进行断言。

### Q: 快照测试失败怎么办？

A: 首先检查变更是否预期内。如果是预期变更，使用 `--update` 参数更新快照。
