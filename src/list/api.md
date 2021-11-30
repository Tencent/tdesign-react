
### List Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
asyncLoading | TNode | - | 自定义加载中。值为空不显示加载中，值为 'loading' 显示加载中状态，值为 'load-more' 显示加载更多状态。值类型为函数，则表示自定义加载状态呈现内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
footer | TNode | - | 底部。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
header | TNode | - | 头部。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
layout | String | horizontal | 排列方式（待设计稿输出）。可选值：horizontal/vertical | N
size | String | medium | 尺寸。可选值：small/medium/large | N
split | Boolean | false | 是否展示分割线 | N
stripe | Boolean | false | 是否展示斑马纹 | N
onLoadMore | Function |  | 点击加载更多时触发。`(options: { e: MouseEvent }) => {}` | N
onScroll | Function |  | 列表滚动时触发，scrollTop 表示顶部滚动距离，scrollBottom 表示底部滚动距离。`(options: { e: Event | WheelEvent; scrollTop: number; scrollBottom: number }) => {}` | N


### ListItem Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
action | TNode | - | 操作栏。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
children | TNode | - | 内容，同 content。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
content | TNode | - | 内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N


### ListItemMeta Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
avatar | TNode | - | 列表项图片。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
description | TNode | - | 列表项内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
title | TNode | - | 列表项标题。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N