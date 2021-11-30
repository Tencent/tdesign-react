
### Loading Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
attach | String / Function | '' | 挂载元素，默认挂载到组件本身所在的位置。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`AttachNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
children | TNode | - | 子元素，同 content。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
content | TNode | - | 子元素。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
delay | Number | 0 | 延迟显示加载效果的时间，用于防止请求速度过快引起的加载闪烁，单位：毫秒 | N
fullscreen | Boolean | false | 是否全屏遮罩，遮罩会挂载到 body | N
indicator | TNode | true | 加载指示符，值为 true 显示默认指示符，值为 false 则不显示，也可以自定义指示符。TS 类型：`boolean | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
loading | Boolean | true | 是否处于加载状态 | N
preventScrollThrough | Boolean | true | 防止滚动穿透 | N
showOverlay | Boolean | false | 是否需要遮罩层，遮罩层对包裹元素才有效 | N
size | String | medium | 尺寸。可选值：small/medium/large | N
text | TNode | - | 加载提示文案。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
zIndex | Number | - | 消息通知层级，样式默认为 3500 | N


### Loading
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
options | Function | - | 必需。TS 类型：`boolean | TdLoadingProps`

插件返回值：`LoadingInstance【interface LoadingInstance { hide: () => void }】`
