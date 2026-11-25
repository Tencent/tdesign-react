:: BASE_DOC ::

## API

### ImageViewer Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
closeBtn | TNode | true | 是否展示关闭按钮，值为 `true` 显示默认关闭按钮；值为 `false` 则不显示关闭按钮；也可以完全自定义关闭按钮。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
cover | TElement | - | 支持自定义覆盖在图片预览最上方的内容。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
deleteBtn | TNode | false | 是否显示删除操作，前提需要开启页码。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
image | TElement | - | `0.21.1`。自定义图片内容。TS 类型：`TNode<ImageSlotParams>` `interface ImageSlotParams {src: string; index?: number;  extra?: Record<string, any>; className?: string; style?: string; onLoad?: (e: Event) => void; onTransitionstart?: (e: TransitionEvent) => void; onTransitionend?: (e: TransitionEvent) => void;} `。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/image-viewer/type.ts) | N
images | Array | [] | 图片数组。TS 类型：`Array<string \| ImageInfo>` `interface ImageInfo { url: string; align: 'start' \| 'center' \| 'end'; extra?: Record<string, any>}`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/image-viewer/type.ts) | N
index | Number | 0 | 当前预览图片所在的下标 | N
defaultIndex | Number | 0 | 当前预览图片所在的下标。非受控属性 | N
loop | Boolean | true | 是否开启循环滚动 | N
maxZoom | Number | 3 | 图片最大放大比例 | N
showIndex | Boolean | false | 是否显示页码 | N
visible | Boolean | false | 隐藏/显示预览 | N
defaultVisible | Boolean | false | 隐藏/显示预览。非受控属性 | N
onClose | Function |  | TS 类型：`(context: { trigger: ImageViewerCloseTrigger, visible: boolean, index: number }) => void`<br/>关闭时触发。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/image-viewer/type.ts)。<br/>`type ImageViewerCloseTrigger = 'image' \| 'overlay' \| 'close-btn'`<br/> | N
onDelete | Function |  | TS 类型：`(index: number) => void`<br/>点击删除操作按钮时触发 | N
onIndexChange | Function |  | TS 类型：`(index: number, context: { trigger: 'prev' \| 'next' \| 'current' }) => void`<br/>预览图片切换时触发，`context.prev` 切换到上一张图片，`context.next` 切换到下一张图片 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-image-viewer-close-margin-left | @spacer-1 | -
--td-image-viewer-delete-margin-right | @spacer-1 | -
--td-image-viewer-mask-bg-color | @mask-active | -
--td-image-viewer-nav-bg-color | #000 | -
--td-image-viewer-nav-color | @font-white-1 | -
--td-image-viewer-nav-height | 48px | -
--td-image-viewer-nav-index-font-size | @font-size-base | -
