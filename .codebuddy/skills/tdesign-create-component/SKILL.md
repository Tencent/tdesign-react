---
name: tdesign-create-component
description: This skill should be used when creating a new TDesign React component. It provides a complete SOP for scaffolding components in the packages/components or packages/pro-components directories, including file structure, code patterns, and registration steps.
---

# TDesign 组件创建脚手架

本技能提供 TDesign React 新组件开发的完整 SOP 流程。

## 触发条件

当用户需要执行以下任务时使用此技能：
- 创建新的 TDesign 组件
- 初始化组件脚手架
- 添加新的基础组件或高阶组件

## SOP 流程

### Step 1: 确定组件类型和目标目录

根据组件性质选择目标位置：

| 组件类型 | 目录 | 说明 |
|---------|------|------|
| 基础组件 | `packages/components/` | 通用 UI 组件（button, input, select 等） |
| 高阶组件 | `packages/pro-components/` | 业务/AIGC 组件（chat, copilot 等） |

### Step 2: 创建组件目录结构

以组件名 `example-component`（PascalCase: `ExampleComponent`）为例：

```
packages/components/example-component/
├── index.ts                    # 组件入口
├── ExampleComponent.tsx        # 组件主文件
├── type.ts                     # 类型定义（由 API 平台生成）
├── defaultProps.ts             # 默认属性（由 API 平台生成）
├── example-component.md        # 中文文档
├── example-component.en-US.md  # 英文文档
├── style/
│   ├── index.js               # Less 样式入口
│   └── css.js                 # CSS 样式入口
├── _example/
│   └── base.tsx               # 基础示例
├── _usage/                    # Live Demo 配置（可选）
│   └── props.json
└── __tests__/
    └── vitest-example-component.test.tsx
```

### Step 3: 编写组件入口文件 (index.ts)

```typescript
import _ExampleComponent from './ExampleComponent';

import './style/index.js';

export type { ExampleComponentProps } from './ExampleComponent';
export * from './type';

export const ExampleComponent = _ExampleComponent;
export default ExampleComponent;
```

### Step 4: 编写组件主文件（标准模式）

使用 `forwardRef` + `useDefaultProps` 标准模式：

```typescript
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { TdExampleComponentProps } from './type';
import { exampleComponentDefaultProps } from './defaultProps';

export interface ExampleComponentProps extends TdExampleComponentProps {
  // 扩展属性（如原生 HTML 属性）
}

const ExampleComponent = forwardRef<HTMLDivElement, ExampleComponentProps>(
  (originProps, ref) => {
    // 1. 合并默认属性
    const props = useDefaultProps(originProps, exampleComponentDefaultProps);
    const { className, style, ...restProps } = props;

    // 2. 获取前缀配置
    const { classPrefix } = useConfig();
    const componentClass = `${classPrefix}-example-component`;

    // 3. 计算类名
    const rootClassName = classNames(componentClass, className);

    // 4. 渲染
    return (
      <div ref={ref} className={rootClassName} style={style}>
        {/* 组件内容 */}
      </div>
    );
  }
);

ExampleComponent.displayName = 'ExampleComponent';

export default ExampleComponent;
```

### Step 5: 编写类型定义文件 (type.ts)

⚠️ **重要**：此文件由 API 平台生成，不应手动编辑。

临时开发时可以先写一个简化版本，后续由 API 平台覆盖：

```typescript
/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TNode, StyledProps } from '../common';

export interface TdExampleComponentProps extends StyledProps {
  /**
   * 组件内容
   */
  children?: TNode;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
}
```

### Step 6: 编写默认属性文件 (defaultProps.ts)

⚠️ **重要**：此文件由 API 平台生成，不应手动编辑。

```typescript
/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TdExampleComponentProps } from './type';

export const exampleComponentDefaultProps: TdExampleComponentProps = {
  disabled: false,
};
```

### Step 7: 编写样式入口文件

**style/index.js**（引用 Less 源文件）：
```javascript
import '../../_common/style/web/components/example-component/index.less';
```

**style/css.js**（引用编译后 CSS）：
```javascript
import '../../_common/style/web/components/example-component/index.css';
```

### Step 8: 编写基础示例 (_example/base.tsx)

```tsx
import React from 'react';
import { ExampleComponent } from 'tdesign-react';

export default function ExampleComponentBase() {
  return <ExampleComponent>基础用法</ExampleComponent>;
}
```

### Step 9: 编写测试文件

位置: `__tests__/vitest-example-component.test.tsx`

```tsx
import { render } from '@testing-library/react';
import ExampleComponent from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders correctly', () => {
    const { container } = render(<ExampleComponent />);
    expect(container.firstChild).toHaveClass('t-example-component');
  });

  it('supports disabled state', () => {
    const { container } = render(<ExampleComponent disabled />);
    expect(container.firstChild).toHaveClass('t-is-disabled');
  });
});
```

### Step 10: 注册组件到导出入口

编辑 `packages/components/index.ts`，添加导出：

```typescript
// 在文件末尾添加
export * from './example-component';
```

### Step 11: 注册组件到站点配置

编辑 `packages/tdesign-react/site/site.config.mjs`：

```javascript
{
  title: '基础组件',
  type: 'component',
  children: [
    // ... 其他组件
    {
      title: 'ExampleComponent 示例组件',
      name: 'example-component',
      path: '/react/components/example-component',
      component: () => import('tdesign-react/example-component/example-component.md'),
    },
  ],
}
```

### Step 12: 编写组件文档 (example-component.md)

组件文档采用 **Markdown + `{{ xxx }}` 占位符** 机制，占位符会在站点构建时自动解析为 `_example/xxx.tsx` 中导出的 React 组件。

**基础组件** 使用双层拼接：
- **文档主体**（跨框架通用）：`packages/common/docs/web/api/<component>.md` — 包含使用说明文本和 `{{ xxx }}` 示例占位符，这是文档的核心内容
- **框架入口**（React 特有）：`packages/components/<component>/<component>.md` — 以 `:: BASE_DOC ::` 开头自动引入上层文档主体，后面追加 React 特有的 API 表格

> ⚠️ 当 `<component>.md` 以 `:: BASE_DOC ::` 开头时，文档的使用说明和示例占位符**不在这个文件中**，而是在 `packages/common/docs/web/api/<component>.md` 里。

**映射规则**：每个 `{{ xxx }}` 对应 `_example/xxx.tsx`，文件必须默认导出一个 React 组件。

```markdown
---
title: ExampleComponent 示例组件
description: 组件的一句话描述。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

:: BASE_DOC ::

## API

{{ api }}
```

> ⚠️ 新增示例时，必须同时：
> 1. 在 `_example/` 下创建对应的 `.tsx` 文件
> 2. 在 Markdown 中添加对应的 `{{ xxx }}` 占位符
> 占位符名称必须与文件名（不含扩展名）**完全一致**。

## 关键规范引用

执行时应参考以下规范：

1. **CSS 命名**: 参考 `.codebuddy/specs/css-naming-spec.md`
   - 前缀使用 `t-`
   - BEM 命名：`t-[component]__[element]--[modifier]`
   - 状态类：`t-is-*`

2. **API 设计**: 参考 `.codebuddy/specs/api-design-spec.md`
   - 使用 `TNode` 类型定义可定制内容
   - 事件命名使用 `on` 前缀
   - `size` 属性固定三档：`small/medium/large`

3. **构建产物**: 参考 `.codebuddy/specs/build-output-spec.md`
   - 确保 style/ 目录正确配置

## 常见模式

### 受控/非受控模式

```typescript
import useControlled from '../hooks/useControlled';

const [value, onChange] = useControlled(props, 'value', props.onChange);
```

### TNode 渲染

```typescript
import parseTNode from '../_util/parseTNode';

// 在 JSX 中
{parseTNode(props.content)}
```

### 静态方法组件（如 Message）

使用 `forwardRefWithStatics` 挂载静态方法：

```typescript
import { forwardRefWithStatics } from '../_util/forwardRefWithStatics';

const ComponentWithStatics = forwardRefWithStatics(Component, {
  info: MessagePlugin.info,
  success: MessagePlugin.success,
});
```

## 检查清单

创建完成后，请确认：

- [ ] 组件目录结构完整
- [ ] 使用 forwardRef + useDefaultProps 标准模式
- [ ] 使用 useConfig() 获取前缀，未硬编码 `t-`
- [ ] type.ts 和 defaultProps.ts 标记为自动生成
- [ ] 已注册到 index.ts 和 site.config.mjs
- [ ] 基础示例可正常运行
- [ ] 测试文件可通过
