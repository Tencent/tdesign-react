# TDesign React Hooks 目录与用法 (Hooks Catalog Spec)

> 本规范列出 `packages/components/hooks/` 下所有公共 hooks 的完整目录、用途和使用示例。
> 在开发或修改组件时，应优先使用这些已有的 hooks，避免重复实现。

## 核心 Hooks（几乎每个组件都会用到）

### useConfig

**用途**：获取全局配置（classPrefix、globalConfig 等），**禁止硬编码前缀**。

```typescript
import useConfig from '../hooks/useConfig';

const { classPrefix } = useConfig();
// classPrefix 默认为 't'
// 使用方式：`${classPrefix}-button`
```

**返回值**：`GlobalConfigProvider` 对象，包含 `classPrefix`、全局图标配置、国际化配置等。

---

### useDefaultProps

**用途**：替代 React 19 已废弃的 `defaultProps`，在组件内部合并默认 props。只有 `undefined` 的字段才会被默认值覆盖。

```typescript
import useDefaultProps from '../hooks/useDefaultProps';
import { buttonDefaultProps } from './defaultProps';

const Button = forwardRef<HTMLButtonElement, ButtonProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, buttonDefaultProps);
  const { size, disabled } = props;
});
```

**⚠️ 重要**：不要在参数解构中写默认值 `({ size = 'medium' })`，必须使用此 hook。

---

### useControlled

**用途**：统一处理受控/非受控模式，自动管理 `value` + `defaultValue` + `onChange`。

```typescript
import useControlled from '../hooks/useControlled';

const [value, onChange] = useControlled(props, 'value', props.onChange);
// 如果 props.value 存在 → 受控模式
// 如果 props.value 未传 → 非受控模式，使用 props.defaultValue
```

**签名**：`useControlled<P, R, K>(props, valueKey, onChange, defaultOptions?)`

---

### useCommonClassName

**用途**：返回通用 CSS 类名映射对象，包含 SIZE 和 STATUS 的标准类名。

```typescript
import useCommonClassName from '../hooks/useCommonClassName';

const { SIZE, STATUS } = useCommonClassName();
// SIZE.small → 't-size-s'
// SIZE.medium → 't-size-m'
// STATUS.disabled → 't-is-disabled'
// STATUS.loading → 't-is-loading'
```

---

## DOM 操作 Hooks

### useDomRefCallback

**用途**：基于 React FAQ "How to measure a DOM node" 的 ref callback 模式。

```typescript
import useDomRefCallback from '../hooks/useDomRefCallback';

const [refCurrent, setRefCurrent] = useDomRefCallback();
return <div ref={setRefCurrent}>{refCurrent && /* 使用 refCurrent */}</div>;
```

---

### useResizeObserver

**用途**：监听容器元素大小变化，自动清理。

```typescript
import useResizeObserver from '../hooks/useResizeObserver';

useResizeObserver(containerRef.current, (entries) => {
  const { width, height } = entries[0].contentRect;
}, { enabled: true });
```

---

### useMutationObserver

**用途**：MutationObserver 封装，支持 debounce，默认监听 attributes/childList/characterData/subtree。

```typescript
import useMutationObserver from '../hooks/useMutationObserver';

useMutationObserver(targetRef.current, (mutations) => {
  // 处理 DOM 变化
});
```

---

### useClickOutside

**用途**：监听元素外部点击事件，支持多个 refs 和 popup 过滤。

```typescript
import useClickOutside from '../hooks/useClickOutside';

useClickOutside([containerRef], () => {
  // 点击外部时关闭
  setVisible(false);
});
```

---

### useWindowSize

**用途**：监听窗口大小变化，带 400ms debounce。

```typescript
import useWindowSize from '../hooks/useWindowSize';

const { width, height } = useWindowSize();
```

---

## 状态管理 Hooks

### useSetState

**用途**：管理 object 类型 state，类似 class 组件 `this.setState`，支持合并更新。

```typescript
import useSetState from '../hooks/useSetState';

const [state, setState] = useSetState({ name: '', age: 0 });
setState({ name: 'TDesign' }); // 只更新 name，age 保持不变
```

---

### useSwitch

**用途**：开关状态管理，返回状态和操作方法。

```typescript
import useSwitch from '../hooks/useSwitch';

const [visible, { on, off, set }] = useSwitch(false);
on();   // visible = true
off();  // visible = false
set(v); // visible = v
```

---

### usePrevious

**用途**：缓存上一次的 state 值，用于前后比较。

```typescript
import usePrevious from '../hooks/usePrevious';

const prevValue = usePrevious(currentValue);
```

---

### useIsFirstRender

**用途**：判断是否为首次渲染。

```typescript
import useIsFirstRender from '../hooks/useIsFirstRender';

const isFirstRender = useIsFirstRender();
// 首次渲染 true，之后 false
```

---

## 函数引用 Hooks

### useLatest

**用途**：始终返回指向最新值的 ref，每次渲染同步更新 `ref.current`。

```typescript
import useLatest from '../hooks/useLatest';

const latestCallback = useLatest(callback);
// latestCallback.current 始终是最新的 callback
```

---

### usePersistFn

**用途**：持久化函数引用，保证函数地址永远不变，避免子组件重复 render。

```typescript
import { usePersistFn } from '../hooks/usePersistFn';

const handleClick = usePersistFn((e) => {
  // 函数引用永远不变，但内部闭包始终是最新的
});
```

---

### useEventCallback

**用途**：实现 React RFC `useEvent` 提案，使用 `useInsertionEffect` 确保回调引用最新闭包。

```typescript
import { useEventCallback } from '../hooks/useEventCallback';

const onClick = useEventCallback((e) => {
  console.log(latestState); // 始终访问最新 state
});
```

**注意**：组件挂载前调用会抛错。

---

### usePropsRef (usePropRef)

**用途**：将 prop 值同步到 ref 中，在 effect 中获取最新 prop 值。

```typescript
import { usePropRef } from '../hooks/usePropsRef';

const valueRef = usePropRef(props.value);
// useEffect 中通过 valueRef.current 获取最新值
```

---

## Effect Hooks

### useUpdateEffect

**用途**：跳过首次渲染的 useEffect，仅在依赖更新时触发。

```typescript
import useUpdateEffect from '../hooks/useUpdateEffect';

useUpdateEffect(() => {
  // 首次渲染不执行，后续依赖变化时执行
}, [dependency]);
```

---

### useUpdateLayoutEffect

**用途**：跳过首次渲染的 useLayoutEffect（同构版本，SSR 安全）。

```typescript
import useUpdateLayoutEffect from '../hooks/useUpdateLayoutEffect';

useUpdateLayoutEffect(() => {
  // 同 useUpdateEffect，但使用 LayoutEffect 时序
}, [dependency]);
```

---

### useLayoutEffect (useIsomorphicLayoutEffect)

**用途**：SSR 兼容的同构 LayoutEffect，浏览器端用 `useLayoutEffect`，服务端用 `useEffect`。

```typescript
import useLayoutEffect from '../hooks/useLayoutEffect';

useLayoutEffect(() => {
  // SSR 安全的 LayoutEffect
}, [dependency]);
```

---

### useDeepEffect

**用途**：对依赖数组进行深比较的 useEffect，适用于复杂对象依赖场景。

```typescript
import useDeepEffect from '../hooks/useDeepEffect';

useDeepEffect(() => {
  // 仅在 options 深层值真正变化时触发
}, [options]);
```

---

## 功能性 Hooks

### useDebounce

**用途**：对函数进行 debounce 封装，组件卸载时自动 cancel。

```typescript
import useDebounce from '../hooks/useDebounce';

const debouncedSearch = useDebounce((keyword) => {
  fetchResults(keyword);
}, 300);
```

---

### useAnimation

**用途**：根据全局配置判断是否保留动画效果。

```typescript
import useAnimation from '../hooks/useAnimation';

const { keepExpand, keepRipple, keepFade } = useAnimation();
// keepExpand: 展开动画
// keepRipple: 水波纹动画
// keepFade: 渐变动画
```

---

### useRipple

**用途**：水波纹点击效果，支持动态/固定颜色，200ms 动画周期。

```typescript
import { useRipple } from '../hooks/useRipple';

useRipple(buttonRef);
// 自动为 buttonRef 元素添加水波纹效果
```

---

### useAttach

**用途**：挂载节点优先级处理。

```typescript
import useAttach from '../hooks/useAttach';

const attachNode = useAttach('popup', props.attach);
// 优先级: props.attach > globalConfig.attach.popup > globalConfig.attach > 'body'
```

---

### usePopper

**用途**：基于 `@popperjs/core` 的 Popper 定位，支持 React 19 `flushSync`。

```typescript
import { usePopper } from '../hooks/usePopper';

const { styles, attributes, update } = usePopper(referenceRef, popperRef, {
  placement: 'bottom-start',
});
```

---

### useVirtualScroll

**用途**：通用虚拟滚动，支持 Select/List/Table/TreeSelect/Cascader。

```typescript
import { useVirtualScroll } from '../hooks/useVirtualScroll';

const { visibleData, handleScroll, scrollHeight } = useVirtualScroll({
  data: list,
  scroll: { type: 'virtual' },
});
```

---

### useDragSorter

**用途**：拖拽排序，提供 onDragStart/onDragOver/onDrop/onDragEnd 事件处理。

```typescript
import { useDragSorter } from '../hooks/useDragSorter';

const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragSorter({
  sortOnDraggable: true,
  onDragSort: ({ currentIndex, targetIndex }) => { /* 更新排序 */ },
});
```

---

### useElementLazyRender

**用途**：元素懒加载渲染，使用 IntersectionObserver 监听元素是否进入视口。

```typescript
import { useElementLazyRender } from '../hooks/useElementLazyRender';

const { showElement } = useElementLazyRender(containerRef, contentRef);
// showElement 为 true 时才渲染内容
```

---

### useImagePreviewUrl

**用途**：将 `string | File` 类型的图片转换为可预览的 URL。

```typescript
import { useImagePreviewUrl } from '../hooks/useImagePreviewUrl';

const { previewUrl } = useImagePreviewUrl(imageUrl);
```

---

### useInnerPopupVisible

**用途**：处理 Popup 内部可见性，自动忽略 clear icon/tag close icon 的点击。

```typescript
import useInnerPopupVisible from '../hooks/useInnerPopupVisible';

useInnerPopupVisible(props, { component: 'Select' });
```

---

### useGlobalIcon

**用途**：从 globalConfig 获取 icon 配置，用于覆盖组件内置 icon。

```typescript
import useGlobalIcon from '../hooks/useGlobalIcon';

const { ChevronDownIcon, CloseIcon } = useGlobalIcon({
  ChevronDownIcon: TdChevronDownIcon,
  CloseIcon: TdCloseIcon,
});
```

---

### usePluginConfig

**用途**：插件配置管理，合并默认配置与运行时配置。

```typescript
import usePluginConfig from '../hooks/usePluginConfig';

const { getConfig, setGlobalConfig } = usePluginConfig();
```

---

### useVariables

**用途**：监听 CSS 变量变化并返回实时值，支持暗色主题检测，带 250ms debounce。

```typescript
import { useVariables } from '../hooks/useVariables';

const variables = useVariables(['--td-brand-color', '--td-text-color-primary']);
```

---

### useMouseEvent

**用途**：鼠标/触摸事件处理，追踪鼠标相对元素坐标。

```typescript
import { useMouseEvent } from '../hooks/useMouseEvent';

const { onDown, onMove, onUp } = useMouseEvent({
  containerRef,
  onMove: ({ x, y }) => { /* 处理移动 */ },
});
```

---

## 工具函数 (_util/)

除了 hooks，`packages/components/_util/` 下还有 16 个工具模块：

| 工具 | 路径 | 说明 |
|------|------|------|
| `parseTNode` | `_util/parseTNode` | 解析 TNode 类型（函数 → 调用，ReactNode → 直接使用） |
| `forwardRefWithStatics` | `_util/forwardRefWithStatics` | forwardRef + 静态属性组合 |
| `dom` | `_util/dom` | DOM 操作（canUseDocument, getWindowSize 等） |
| `copyText` | `_util/copyText` | 复制文本到剪贴板 |
| `createHookContext` | `_util/createHookContext` | Hook Context 工厂函数 |
| `easing` | `_util/easing` | 缓动函数（动画曲线） |
| `helper` | `_util/helper` | 通用辅助函数 |
| `insertCSS` | `_util/insertCSS` | 动态插入 CSS 到 DOM |
| `isFragment` | `_util/isFragment` | 判断 React 元素是否为 Fragment |
| `listener` | `_util/listener` | 事件监听器工具 |
| `noop` | `_util/noop` | 空函数 |
| `number` | `_util/number` | 数字处理工具 |
| `react-19-adapter` | `_util/react-19-adapter` | React 19 适配器 |
| `react-render` | `_util/react-render` | React 渲染工具（兼容 16/17/18/19） |
| `ref` | `_util/ref` | Ref 操作工具 |
| `scroll` | `_util/scroll` | 滚动相关工具 |
| `style` | `_util/style` | 样式处理工具 |
