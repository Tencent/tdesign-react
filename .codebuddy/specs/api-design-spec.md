# TDesign API 设计规范 (API Design Spec)

> 本规范定义 TDesign 组件的 API 设计标准，包括属性命名、类型系统、事件规范等。
> 源文档: `packages/common/api.md`

## 核心原则

1. **跨框架一致性**：同平台不同框架（React/Vue）遵循同一份 API 定义
2. **原生属性透传**：原生 HTML 属性支持透传，API 中不重复声明
3. **语义化命名**：属性和事件使用小驼峰命名，含义清晰

---

## 1. 属性命名规范

### 1.1 基本规则

- 所有属性使用**小驼峰**命名
- 避开 HTML 原生属性名（如 Button 的风格用 `theme` 而非 `type`）
- 原生 HTML 属性自动透传，无需在 API 中声明

### 1.2 常见属性命名

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸，固定三档 |
| `disabled` | `boolean` | `false` | 禁用状态 |
| `loading` | `boolean` | `false` | 加载状态 |
| `visible` | `boolean` | - | 显示/隐藏（受控） |
| `defaultVisible` | `boolean` | - | 显示/隐藏（非受控默认值） |
| `value` | `T` | - | 值（受控） |
| `defaultValue` | `T` | - | 值（非受控默认值） |

### 1.3 size 属性标准

**强制规范**：`size` 属性默认值固定为以下三档：

```typescript
type Size = 'small' | 'medium' | 'large';
```

---

## 2. TNode 类型系统

`TNode` 是 TDesign 定义的**可定制内容**类型，用于表示可以渲染自定义内容的属性。

### 2.1 React TNode 定义

```typescript
// TElement：只接受 ReactElement
declare type TElement = ReactElement;

// TNode：接受 ReactNode（含字符串、数字、null 等）
declare type TNode<T = undefined> = T extends {} 
  ? ((props: T) => ReactNode) 
  : ReactNode;
```

### 2.2 使用场景

| 类型 | 使用场景 | 示例 |
|------|---------|------|
| `TNode` | 简单的自定义内容 | `icon?: TNode` |
| `TNode<T>` | 需要传递参数的内容 | `renderItem?: TNode<{ item: T; index: number }>` |
| `TElement` | 仅接受组件 | `header?: TElement` |

### 2.3 使用示例

```typescript
// 简单 TNode
interface ButtonProps {
  icon?: TNode;           // 可以是 ReactNode
  content?: TNode;        // 按钮内容
}

// 带参数的 TNode
interface TableProps<T> {
  // 会输出 row 和 index 参数给渲染函数
  renderCell?: TNode<{ row: T; rowIndex: number; col: Column; colIndex: number }>;
}
```

---

## 3. 事件命名规范

### 3.1 API 定义层

事件在 API 定义中使用**小驼峰**命名（不带 `on` 前缀）：

```typescript
// API 定义
{
  visibleChange: (visible: boolean) => void;
  valueChange: (value: T, context: { e: Event }) => void;
}
```

### 3.2 React 实现层

React 组件实现时，事件名转换为**带 `on` 前缀的小驼峰**：

```typescript
// React Props
interface SelectProps {
  onVisibleChange?: (visible: boolean) => void;
  onValueChange?: (value: T, context: { e: Event }) => void;
  onChange?: (value: T, context: { e: Event }) => void;  // 简写形式
}
```

### 3.3 事件参数规范

多参数事件使用以下格式：

```typescript
// 推荐：第一个参数是主要值，第二个参数是上下文对象
(value: T, context: { index: number; item: Item; event: Event; ...otherFields }) => void

// 示例
onChange?: (value: string[], context: { 
  trigger: 'check' | 'uncheck' | 'clear';
  e: MouseEvent;
  node: TreeNode;
}) => void;
```

---

## 4. 受控与非受控模式

### 4.1 命名约定

| 受控属性 | 非受控默认值 | 变化事件 |
|---------|-------------|---------|
| `value` | `defaultValue` | `onChange` |
| `visible` | `defaultVisible` | `onVisibleChange` |
| `expanded` | `defaultExpanded` | `onExpandChange` |
| `checked` | `defaultChecked` | `onCheckedChange` |

### 4.2 实现模式

```typescript
// 使用 useControlled hook 实现受控/非受控
const [value, setValue] = useControlled(props, 'value', onChange);
```

### 4.3 v-model 对应（Vue 参考）

在 Vue 中对应的 v-model 语法糖：

| React Props | Vue v-model |
|-------------|-------------|
| `value` + `onChange` | `v-model:value` |
| `visible` + `onVisibleChange` | `v-model:visible` |

---

## 5. 类型文件规范

### 5.1 type.ts 文件

每个组件必须有 `type.ts` 文件，定义所有 Props 类型：

```typescript
// packages/components/button/type.ts

import { TNode, StyledProps } from '../common';

export interface ButtonProps extends StyledProps {
  /**
   * 按钮内容
   */
  children?: TNode;
  /**
   * 按钮风格
   * @default 'default'
   */
  theme?: 'default' | 'primary' | 'danger' | 'warning' | 'success';
  /**
   * 按钮尺寸
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 点击事件
   */
  onClick?: (e: MouseEvent) => void;
}
```

### 5.2 ⚠️ 重要警告

```
/* 请勿随意修改此文件，如需修改请在 API 平台提交 PR */
```

- `type.ts` 和 `defaultProps.ts` 由 API 平台自动生成
- 禁止手动修改这些文件
- 如需修改 API，请在 [tdesign-api](https://github.com/tdesignoteam/tdesign-api) 提交 PR

---

## 6. StyledProps 公共属性

所有组件继承 `StyledProps`，包含以下公共属性：

```typescript
export interface StyledProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: CSSProperties;
}
```

---

## 7. 组件插件方法命名

插件式组件的方法命名规范：

```typescript
// 推荐格式：$ComponentName.method
$Message.info('提示信息');
$Message.success('成功');
$Message.warning('警告');
$Message.error('错误');

$Notification.info({ title: '标题', content: '内容' });

$Dialog.confirm({ header: '确认', body: '确定要删除吗？' });
```

---

## API 设计检查清单

在设计新组件 API 时，请确保：

- [ ] 属性使用小驼峰命名
- [ ] 避开了 HTML 原生属性名
- [ ] `size` 属性使用 `small/medium/large` 三档
- [ ] 可定制内容使用 `TNode` 类型
- [ ] 事件命名带 `on` 前缀（React）
- [ ] 多参数事件使用 `(value, context)` 格式
- [ ] 受控属性配有对应的 `default*` 非受控版本
- [ ] 类型定义文件包含完整的 JSDoc 注释
