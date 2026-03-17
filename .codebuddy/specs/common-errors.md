# TDesign 常见错误参考 (Common Errors Reference)

> 本文档收录 TDesign React 开发中的常见错误、反模式及其正确解决方案。
> 定位：静态知识参考，供 AI 和开发者在遇到问题时查阅。

---

## Error 1: lodash 导入错误

**错误现象**：
```
Error: Cannot find module 'lodash'
```

**❌ 错误代码**：
```typescript
import { debounce } from 'lodash';
import _ from 'lodash';
```

**✅ 正确代码**：
```typescript
import debounce from 'lodash/debounce';
import { debounce } from 'lodash-es';
```

**说明**：TDesign 使用 `lodash-es` 或按需导入 `lodash/xxx`，以支持 tree-shaking。

---

## Error 2: 手动修改自动生成文件

**错误现象**：
- PR 中包含对 `type.ts` 或 `defaultProps.ts` 的修改
- API 变更后本地代码与 API 平台不一致

**❌ 错误操作**：
直接编辑 `type.ts` 或 `defaultProps.ts` 文件

**✅ 正确操作**：
1. 在 [tdesign-api](https://github.com/tdesignoteam/tdesign-api) 提交 PR
2. 等待 API 平台审核通过
3. 使用同步工具更新本地文件

**识别标志**：文件头部包含以下注释
```typescript
/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */
```

---

## Error 3: 硬编码 CSS 前缀

**错误现象**：
- 主题切换后样式不生效
- 与其他 TDesign 项目样式冲突

**❌ 错误代码**：
```typescript
const Button = () => {
  return <button className="t-button">Click</button>;
};
```

**✅ 正确代码**：
```typescript
import useConfig from '../hooks/useConfig';

const Button = () => {
  const { classPrefix } = useConfig();
  return <button className={`${classPrefix}-button`}>Click</button>;
};
```

**说明**：始终使用 `useConfig()` 获取前缀，支持运行时配置。

---

## Error 4: 未使用 useDefaultProps

**错误现象**：
- Props 默认值不生效
- undefined 值覆盖默认值

**❌ 错误代码**：
```typescript
const Button = ({ size = 'medium', disabled = false }) => {
  // size 可能是 undefined，覆盖默认值
};
```

**✅ 正确代码**：
```typescript
import useDefaultProps from '../hooks/useDefaultProps';
import { buttonDefaultProps } from './defaultProps';

const Button = forwardRef((originProps, ref) => {
  const props = useDefaultProps(originProps, buttonDefaultProps);
  const { size, disabled } = props;
  // size 现在正确获取默认值
});
```

---

## Error 5: forwardRef 使用不当

**错误现象**：
- ref 无法正确传递
- 使用 `useRef` 无法获取 DOM 引用

**❌ 错误代码**：
```typescript
const Button = (props) => {
  return <button>{props.children}</button>;
};
```

**✅ 正确代码**：
```typescript
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref}>{props.children}</button>;
});

Button.displayName = 'Button';
```

**注意**：必须设置 `displayName` 以便 DevTools 调试。

---

## Error 6: 状态类名使用错误

**错误现象**：
- 状态样式不生效
- 样式选择器权重过高

**❌ 错误代码**：
```css
/* 错误：使用后代选择器 */
.t-button .t-is-disabled { }

/* 错误：状态作为修饰符 */
.t-button--disabled { }
```

**✅ 正确代码**：
```css
/* 正确：联合选择器 */
.t-button.t-is-disabled { }
```

```typescript
// React 中的正确使用
className={classNames(`${classPrefix}-button`, {
  [`${classPrefix}-is-disabled`]: disabled,
})}
```

---

## Error 7: TNode 渲染错误

**错误现象**：
- 函数类型的 TNode 不执行
- 渲染结果不符合预期

**❌ 错误代码**：
```typescript
// 直接渲染，函数不会被调用
return <div>{props.content}</div>;
```

**✅ 正确代码**：
```typescript
import parseTNode from '../_util/parseTNode';

// 使用 parseTNode 正确处理
return <div>{parseTNode(props.content)}</div>;
```

---

## Error 8: 事件命名不规范

**错误现象**：
- 事件回调不触发
- TypeScript 类型错误

**❌ 错误代码**：
```typescript
interface Props {
  // 错误：缺少 on 前缀
  change?: (value: string) => void;
  // 错误：使用中划线
  'on-change'?: (value: string) => void;
}
```

**✅ 正确代码**：
```typescript
interface Props {
  // 正确：on 前缀 + 小驼峰
  onChange?: (value: string) => void;
  onVisibleChange?: (visible: boolean) => void;
}
```

---

## Error 9: 受控组件实现错误

**错误现象**：
- 值变化后组件不更新
- 非受控模式不工作

**❌ 错误代码**：
```typescript
const [value, setValue] = useState(props.value || props.defaultValue);

// 问题：props.value 变化时不会更新 state
```

**✅ 正确代码**：
```typescript
import useControlled from '../hooks/useControlled';

const [value, onChange] = useControlled(props, 'value', props.onChange);
```

---

## Error 10: 样式入口配置错误

**错误现象**：
- 组件无样式
- 构建产物缺少样式文件

**❌ 错误代码**：
```typescript
// index.ts 中遗漏样式导入
import _Button from './Button';
export const Button = _Button;
```

**✅ 正确代码**：
```typescript
// index.ts 必须包含样式导入
import _Button from './Button';
import './style/index.js';  // ← 必须添加

export const Button = _Button;
```

---

## Error 11: React 19 兼容性问题

**错误现象**：
- React 19 下组件报错
- `forwardRef` 行为异常

**解决方案**：
检查是否使用了 `react-19-adapter`，确保组件兼容 React 19 的新特性。

---

## Error 12: 子仓库未更新

**错误现象**：
- 样式与预期不符
- common 中的修改未生效

**解决方案**：
```bash
# 更新子仓库
git submodule update --init --remote

# 或执行初始化脚本
pnpm run init
```

---

## 诊断流程

遇到问题时，按以下顺序排查：

1. **检查控制台错误** — 查看具体报错信息
2. **检查导入语句** — 确认 lodash-es 和样式导入
3. **检查前缀使用** — 确认使用 useConfig()
4. **检查类名格式** — 确认 BEM 命名和状态类
5. **检查子仓库** — 运行 `pnpm run init`
6. **检查 API 文件** — 确认未手动修改自动生成文件

## 参考资源

- API 设计规范: `.codebuddy/specs/api-design-spec.md`
- CSS 命名规范: `.codebuddy/specs/css-naming-spec.md`
- 构建产物规范: `.codebuddy/specs/build-output-spec.md`
- 项目架构总览: `.codebuddy/specs/project-architecture-spec.md`
