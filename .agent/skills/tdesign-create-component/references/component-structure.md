# TDesign 组件目录结构参考

## 标准组件目录结构

```
packages/components/[component-name]/
├── index.ts                              # 组件入口，导出组件和类型
├── [ComponentName].tsx                   # 组件主实现文件
├── type.ts                               # 类型定义（API 平台生成）
├── defaultProps.ts                       # 默认属性（API 平台生成）
├── [component-name].md                   # 中文文档
├── [component-name].en-US.md             # 英文文档
├── style/
│   ├── index.js                          # Less 样式入口
│   └── css.js                            # CSS 样式入口
├── _example/
│   ├── base.tsx                          # 基础示例
│   ├── size.tsx                          # 尺寸示例
│   ├── disabled.tsx                      # 禁用状态示例
│   └── ...                               # 其他示例
├── _usage/                               # Live Demo 配置（可选）
│   └── props.json
└── __tests__/
    └── vitest-[component-name].test.tsx  # 单元测试
```

## 复杂组件结构（含子组件）

以 Select 为例：

```
packages/components/select/
├── index.ts
├── Select.tsx                    # 主组件
├── Option.tsx                    # 子组件
├── OptionGroup.tsx               # 子组件
├── type.ts
├── defaultProps.ts
├── base/                         # 基础实现
│   ├── Select.tsx
│   └── Option.tsx
├── hooks/                        # 组件内部 hooks
│   ├── useSelectOptions.ts
│   └── useSelectPopup.ts
├── util/                         # 工具函数
│   └── helper.ts
├── style/
├── _example/
└── __tests__/
```

## Pro 组件结构（AIGC）

```
packages/pro-components/chat/
├── chat-engine/
│   ├── index.ts
│   ├── ChatEngine.tsx
│   ├── type.ts
│   ├── _example/
│   └── chat-engine.md
├── chat-message/
│   ├── index.ts
│   ├── ChatMessage.tsx
│   └── ...
└── index.ts                      # 统一导出
```

## 文件命名规范

| 文件类型 | 命名格式 | 示例 |
|---------|---------|------|
| 组件主文件 | PascalCase | `Button.tsx`, `DatePicker.tsx` |
| 入口文件 | 固定名 | `index.ts` |
| 类型文件 | 固定名 | `type.ts` |
| 默认属性 | 固定名 | `defaultProps.ts` |
| 中文文档 | kebab-case | `date-picker.md` |
| 英文文档 | kebab-case + .en-US | `date-picker.en-US.md` |
| 示例文件 | kebab-case | `base.tsx`, `custom-style.tsx` |
| 测试文件 | vitest-kebab-case | `vitest-date-picker.test.tsx` |

## 导出规范

### index.ts 标准格式

```typescript
// 1. 导入内部组件
import _Button from './Button';

// 2. 导入样式（必须）
import './style/index.js';

// 3. 导出类型
export type { ButtonProps } from './Button';
export * from './type';

// 4. 导出组件
export const Button = _Button;
export default Button;
```

### 复合组件导出

```typescript
import _Select from './Select';
import Option from './Option';
import OptionGroup from './OptionGroup';

import './style/index.js';

export type { SelectProps, SelectValue } from './Select';
export type { SelectOptionProps } from './Option';
export * from './type';

type SelectType = typeof _Select & {
  Option: typeof Option;
  OptionGroup: typeof OptionGroup;
};

export const Select = _Select as SelectType;
Select.Option = Option;
Select.OptionGroup = OptionGroup;

export default Select;
```
