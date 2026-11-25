:: BASE_DOC ::

## API

### PullDownRefresh Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
disabled | Boolean | false | 是否禁用下拉刷新 | N
loadingBarHeight | String / Number | 50 | 加载中下拉高度，如果值为数字则单位是：'px' | N
loadingProps | Object | - | 加载loading样式。TS 类型：`LoadingProps`，[Loading API Documents](./loading?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/pull-down-refresh/type.ts) | N
loadingTexts | Array | [] | 提示语，组件内部默认值为 ['下拉刷新', '松手刷新', '正在刷新', '刷新完成']。TS 类型：`string[]` | N
maxBarHeight | String / Number | 80 | 最大下拉高度，如果值为数字则单位是：'px' | N
refreshTimeout | Number | 3000 | 刷新超时时间 | N
successDuration | String / Number | 500 | 刷新成功提示展示时长，单位 'ms' | N
value | Boolean | false | 组件状态，值为 `true` 表示下拉状态，值为 `false` 表示收起状态 | N
defaultValue | Boolean | false | 组件状态，值为 `true` 表示下拉状态，值为 `false` 表示收起状态。非受控属性 | N
onChange | Function |  | TS 类型：`(value: boolean) => void`<br/>下拉或收起时触发，用户手势往下滑动触发下拉状态，手势松开触发收起状态 | N
onRefresh | Function |  | TS 类型：`() => void`<br/>结束下拉时触发 | N
onScrolltolower | Function |  | TS 类型：`() => void`<br/>滚动到页面底部时触发 | N
onTimeout | Function |  | TS 类型：`() => void`<br/>刷新超时触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-pull-down-refresh-color | @text-color-placeholder | -
