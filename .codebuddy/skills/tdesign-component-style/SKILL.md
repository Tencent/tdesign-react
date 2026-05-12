---
name: tdesign-component-style
description: This skill should be used when developing or modifying styles for TDesign React components. It provides guidance on BEM naming conventions, CSS Variables usage, state classes, and the relationship between component code and common submodule styles.
---

# TDesign 组件样式开发 SOP

本技能提供 TDesign React 组件样式开发的操作流程。静态规则参见 `.codebuddy/specs/css-naming-spec.md`。

## 触发条件

当用户需要执行以下任务时使用此技能：
- 为新组件创建样式
- 修改现有组件样式
- 配置组件样式入口

## 前置知识

执行本 SOP 前，需要了解以下 spec 中的静态规则：
- **CSS 命名规范**: `.codebuddy/specs/css-naming-spec.md`（BEM 命名、状态类、尺寸类、Design Token）

## SOP 流程

### Step 1: 创建样式入口文件

在组件目录下创建 `style/` 目录：

**style/index.js**（引用 Less 源文件）：
```javascript
import '../../_common/style/web/components/{component-name}/index.less';
```

**style/css.js**（引用编译后 CSS）：
```javascript
import '../../_common/style/web/components/{component-name}/index.css';
```

### Step 2: 确保组件入口导入样式

在 `index.ts` 中导入样式：

```typescript
import _ExampleComponent from './ExampleComponent';
import './style/index.js';  // ← 必须添加

export const ExampleComponent = _ExampleComponent;
```

### Step 3: 在 Common 子仓库开发样式

样式文件位于 `packages/common/style/web/components/{component-name}/index.less`

```less
@import "../../_variables/index.less";

.@{prefix}-{component-name} {
  // 基础样式，使用 Design Token（参见 css-naming-spec.md §8）
  display: inline-flex;
  align-items: center;
  padding: @comp-paddingLR-s @comp-paddingTB-s;
  border-radius: @radius-default;
  font-size: @font-size-base;
  color: @text-color-primary;
  background-color: @bg-color-container;

  // 元素样式（BEM element）
  &__icon {
    margin-right: @comp-margin-xs;
  }

  &__content {
    flex: 1;
  }

  // 修饰类（BEM modifier）
  &--primary {
    background-color: @brand-color;
    color: @text-color-anti;
  }

  // 尺寸修饰
  &--small {
    padding: @comp-paddingLR-xs @comp-paddingTB-xs;
    font-size: @font-size-s;
  }
}

// 状态类（联合选择器，参见 css-naming-spec.md §3）
.@{prefix}-{component-name}.@{prefix}-is-disabled {
  cursor: not-allowed;
  opacity: @disabled-opacity;
}

.@{prefix}-{component-name}.@{prefix}-is-loading {
  cursor: wait;
}
```

### Step 4: 在 React 组件中应用类名

使用 `useConfig` 获取前缀，使用 `classNames` 组合类名：

```typescript
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';

const ExampleComponent = forwardRef((props, ref) => {
  const { classPrefix } = useConfig();
  const { size, disabled, loading, className } = props;

  const componentClass = `${classPrefix}-example-component`;

  const rootClassName = classNames(
    componentClass,
    className,
    {
      [`${componentClass}--${size}`]: size !== 'medium',
      [`${classPrefix}-is-disabled`]: disabled,
      [`${classPrefix}-is-loading`]: loading,
    }
  );

  return (
    <div ref={ref} className={rootClassName}>
      <span className={`${componentClass}__icon`}>{icon}</span>
      <span className={`${componentClass}__content`}>{content}</span>
    </div>
  );
});
```

### Step 5: 子仓库提交

组件样式在 `packages/common` 子仓库开发，修改后需单独提交：

```bash
cd packages/common
git add .
git commit -m "style({component-name}): description"
# 推送到 tdesign-common 仓库
```

## 检查清单

完成样式开发后，对照 `css-naming-spec.md` 中的检查清单验证：

- [ ] 样式入口文件正确配置（style/index.js + style/css.js）
- [ ] 组件入口导入了样式文件
- [ ] 使用 `@{prefix}` 变量而非硬编码 `t-`
- [ ] React 中使用 `useConfig()` 获取前缀
- [ ] 元素类名不体现 DOM 层级
- [ ] 状态类使用联合选择器
- [ ] 使用 Design Token 而非硬编码值
- [ ] 支持 className 透传
- [ ] 子仓库修改已单独提交
