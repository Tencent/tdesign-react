:: BASE_DOC ::

## API

### List Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
asyncLoading | TNode | - | 自定义加载中。值为空不显示加载中，值为 'loading' 显示加载中状态，值为 'load-more' 显示加载更多状态。值类型为函数，则表示自定义加载状态呈现内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
footer | TNode | - | 底部。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
header | TNode | - | 头部。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
onLoadMore | Function |  | TS 类型：`() => void`<br/>点击加载更多时触发 | N
onScroll | Function |  | TS 类型：`(bottomDistance: number, scrollTop: number) => void`<br/>列表滚动时触发，bottomDistance 表示底部距离；scrollTop 表示顶部滚动距离 | N
