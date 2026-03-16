# TDesign CSS 命名规范 (CSS Naming Spec)

> 本规范定义 TDesign 组件的 CSS 命名标准，采用 BEM 方法论。
> 源文档: `packages/common/css-naming.md`

## BEM 命名结构

```
[prefix]-[block]__[element]--[modifier]
```

| 部分 | 说明 | 示例 |
|------|------|------|
| **prefix** | 全局前缀，固定为 `t-` | `t-` |
| **block** | 组件最外层，可重用功能 | `button`, `tabs` |
| **element** | 组件内元素，用 `__` 连接 | `tabs__item` |
| **modifier** | 变体修饰，用 `--` 连接 | `button--primary` |

---

## 1. 基本命名规则

### 1.1 前缀规范

**强制要求**：所有组件样式必须以 `t-` 为前缀

```css
/* ✅ 正确 */
.t-button { }
.t-input { }
.t-table__row { }

/* ❌ 错误 */
.button { }
.td-button { }
.tdesign-button { }
```

### 1.2 单词连接

- 使用**连字符**（`-`）连接多个单词
- **不使用**驼峰命名
- 类名全部小写

```css
/* ✅ 正确 */
.t-date-picker { }
.t-tree-select { }
.t-input-number { }

/* ❌ 错误 */
.t-datePicker { }
.t-DatePicker { }
.t-date_picker { }
```

### 1.3 元素命名

- 元素类名无需反映 DOM 层级
- 只需包含 **block 名 + element 名**

```css
/* ✅ 正确：扁平化命名 */
.t-tabs { }
.t-tabs__item { }
.t-tabs__content { }
.t-tabs__panel { }

/* ❌ 错误：体现 DOM 层级 */
.t-tabs__header__item { }
.t-tabs__body__panel__content { }
```

---

## 2. 修饰类（Modifier）

### 2.1 基本用法

修饰类表示组件变体，**不能单独使用**：

```css
/* ✅ 正确：修饰类与基类同时使用 */
.t-button { }
.t-button--primary { }
.t-button--large { }

/* HTML 使用 */
<button class="t-button t-button--primary">主要按钮</button>
```

### 2.2 元素修饰

元素也可以有修饰类：

```css
.t-tabs__item { }
.t-tabs__item--active { }
.t-tabs__item--disabled { }
```

---

## 3. 状态类（State）

### 3.1 状态类命名

状态类以 **`t-is-`** 开头，表示组件当前状态：

```css
/* 状态类定义 */
.t-is-loading { }
.t-is-disabled { }
.t-is-active { }
.t-is-checked { }
```

### 3.2 状态类使用规范

**强制要求**：状态类必须与元素类名**联合使用**（`.a.b` 形式）

```css
/* ✅ 正确：联合选择器 */
.t-tabs__item.t-is-active {
  color: var(--td-brand-color);
}
.t-tabs__item.t-is-disabled {
  cursor: not-allowed;
}

/* ❌ 错误：后代选择器 */
.t-tabs__item .t-is-active { }

/* ❌ 错误：单独使用 */
.t-is-active { }
```

### 3.3 HTML 使用示例

```html
<div class="t-tabs">
  <ul class="t-tabs__list">
    <li class="t-tabs__item t-is-active">Tab 1</li>
    <li class="t-tabs__item t-is-disabled">Tab 2</li>
    <li class="t-tabs__item">Tab 3</li>
  </ul>
</div>
```

### 3.4 常用状态类清单

| 状态 | 类名 | 说明 |
|------|------|------|
| 加载中 | `t-is-loading` | |
| 禁用 | `t-is-disabled` | |
| 成功 | `t-is-success` | |
| 错误 | `t-is-error` | |
| 警告 | `t-is-warning` | |
| 聚焦 | `t-is-focused` | |
| 选中 | `t-is-selected` | |
| 勾选 | `t-is-checked` | |
| 可关闭 | `t-is-closable` | |
| 激活 | `t-is-active` | 如当前 tab 选中项 |
| 当前项 | `t-is-current` | 如 step 当前步骤 |
| 隐藏/显示 | `t-is-hidden` / `t-is-visible` | |
| 展开/折叠 | `t-is-expanded` / `t-is-collapsed` | |

---

## 4. 尺寸类（Size）

### 4.1 标准尺寸

| 尺寸 | 类名 | 说明 |
|------|------|------|
| 较小 | `t-size-xs` | extra small |
| 小 | `t-size-s` | small |
| 中（默认） | `t-size-m` | medium |
| 大 | `t-size-l` | large |
| 较大 | `t-size-xl` | extra large |

### 4.2 特殊尺寸

| 尺寸 | 类名 |
|------|------|
| 高度 100% | `t-size-full-height` |
| 宽度 100% | `t-size-full-width` |
| 宽度自适应 | `t-size-auto-width` |

---

## 5. 图标类

以 `t-icon-` 为前缀：

```css
/* 基础图标 */
.t-icon-info { }
.t-icon-success { }
.t-icon-warning { }
.t-icon-error { }

/* 图标变体：使用修饰类 */
.t-icon-info.t-icon-info--danger { }

/* 图标尺寸：使用尺寸类 */
.t-icon-info.t-size-l { }
```

---

## 6. 常用单词参考

### 6.1 结构类

| 用途 | 推荐类名 |
|------|---------|
| 头部 | `header` |
| 主体 | `body` |
| 尾部 | `footer` |
| 容器/内容 | `container` / `wrap` / `content` |
| 侧边 | `side` / `sidebar` / `sidemenu` |

### 6.2 边框修饰

```css
.t-table--bordered { }    /* 有边框 */
.t-table--borderless { }  /* 无边框 */
```

---

## 7. 样式架构

### 7.1 目录结构

```
TDesign 样式分为两层：
├── packages/common/style/web/          # 公共样式（子仓库）
│   ├── components/                     # 组件样式
│   │   └── [component-name]/
│   │       └── index.less
│   └── _variables/                     # Design Token
│       ├── global.less
│       └── component/
└── packages/components/[component]/style/  # 组件样式入口
    ├── index.js                        # Less 入口
    └── css.js                          # CSS 入口
```

### 7.2 Less 变量写法

```less
// 使用变量前缀
@prefix: t;

.@{prefix}-button {
  // block

  &__text {
    // element: .t-button__text
  }

  &--primary {
    // modifier: .t-button--primary
  }
}

// 状态类（联合选择器）
.@{prefix}-button.@{prefix}-is-disabled {
  cursor: not-allowed;
}
```

### 7.3 引用组件样式

```less
// 组件样式入口
@import '~tdesign-react/esm/button/style/index.less';

// 或引用公共样式
@import '~tdesign-common/style/web/components/button/index.less';
```

---

## 8. Design Token

### 8.1 颜色 Token

```less
// 品牌色
@brand-color
@brand-color-hover
@brand-color-active

// 文字色
@text-color-primary
@text-color-secondary
@text-color-placeholder
@text-color-disabled
@text-color-anti        // 反色文字（深色背景）

// 背景色
@bg-color-container
@bg-color-page
@bg-color-component
@bg-color-container-hover

// 功能色
@success-color
@warning-color
@error-color
```

### 8.2 间距 Token

```less
// 组件内间距
@comp-paddingTB-xxs     // 2px
@comp-paddingTB-xs      // 4px
@comp-paddingTB-s       // 8px
@comp-paddingTB-m       // 12px
@comp-paddingTB-l       // 16px

@comp-paddingLR-xs      // 8px
@comp-paddingLR-s       // 12px
@comp-paddingLR-m       // 16px
@comp-paddingLR-l       // 24px

// 元素间距
@comp-margin-xxs        // 4px
@comp-margin-xs         // 8px
@comp-margin-s          // 12px
@comp-margin-m          // 16px
```

### 8.3 圆角 Token

```less
@radius-small           // 3px
@radius-default         // 6px
@radius-medium          // 9px
@radius-large           // 12px
@radius-extraLarge      // 16px
@radius-round           // 999px
@radius-circle          // 50%
```

### 8.4 字体 Token

```less
@font-size-s            // 12px
@font-size-base         // 14px
@font-size-m            // 16px
@font-size-l            // 18px
@font-size-xl           // 20px

@font-family
@font-family-mono
```

### 8.5 CSS Variables

TDesign 支持运行时主题切换，通过 CSS Variables 实现：

```css
:root {
  --td-brand-color: #0052d9;
  --td-brand-color-hover: #0034b5;
  --td-text-color-primary: rgba(0, 0, 0, 0.9);
  /* ... */
}
```

在组件中可以直接使用：

```less
.@{prefix}-button {
  background-color: var(--td-brand-color);
  color: var(--td-text-color-anti);
}
```

---

## 9. 在 React 中使用前缀

### 9.1 useConfig Hook

**强制要求**：使用 `useConfig()` 获取前缀，禁止硬编码

```typescript
// ✅ 正确
import useConfig from '../hooks/useConfig';

const Button = () => {
  const { classPrefix } = useConfig();
  return <button className={`${classPrefix}-button`}>Click</button>;
};

// ❌ 错误：硬编码前缀
const Button = () => {
  return <button className="t-button">Click</button>;
};
```

### 9.2 classnames 工具

```typescript
import classNames from 'classnames';

const Button = ({ size, disabled }) => {
  const { classPrefix } = useConfig();

  const buttonClass = classNames(
    `${classPrefix}-button`,
    `${classPrefix}-button--${size}`,
    { [`${classPrefix}-is-disabled`]: disabled }
  );

  return <button className={buttonClass}>Click</button>;
};
```

---

## CSS 命名检查清单

- [ ] 所有类名以 `t-` 为前缀
- [ ] 使用连字符连接多单词，全小写
- [ ] 元素类名不体现 DOM 层级
- [ ] 修饰类不单独使用
- [ ] 状态类以 `t-is-` 开头
- [ ] 状态类与元素类联合使用（`.a.b`）
- [ ] React 中使用 `useConfig()` 获取前缀
- [ ] 尺寸类使用 `t-size-*` 系列
- [ ] 使用 Design Token 而非硬编码值
- [ ] 使用 `@{prefix}` 变量而非硬编码 `t-`
- [ ] 样式入口文件正确配置（style/index.js + style/css.js）
- [ ] 组件入口导入了样式文件
- [ ] 支持 className 透传
