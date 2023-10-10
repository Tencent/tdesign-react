:: BASE_DOC ::

## API
### ImageViewer Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
closeBtn | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
closeOnOverlay | Boolean | - | \- | N
draggable | Boolean | undefined | \- | N
imageScale | Object | - | Typescript：`ImageScale` `interface ImageScale { max: number; min: number; step: number }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/image-viewer/type.ts) | N
images | Array | [] | Typescript：`Array<string \| File \| ImageInfo>` `interface ImageInfo { mainImage: string \| File; thumbnail?: string \| File; download?: boolean }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/image-viewer/type.ts) | N
index | Number | 0 | \- | N
defaultIndex | Number | 0 | uncontrolled property | N
mode | String | modal | options: modal/modeless | N
navigationArrow | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
showOverlay | Boolean | undefined | \- | N
title | TNode | - | preview title。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
trigger | TNode | - | trigger element。Typescript：`TNode \| TNode<{ open: () => void }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
viewerScale | Object | - | Typescript：`ImageViewerScale` `interface ImageViewerScale { minWidth: number; minHeight: number }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/image-viewer/type.ts) | N
visible | Boolean | false | \- | N
defaultVisible | Boolean | false | uncontrolled property | N
zIndex | Number | - | \- | N
onClose | Function |  | Typescript：`(context: { trigger: 'close-btn' \| 'overlay' \| 'esc'; e: MouseEvent \| KeyboardEvent }) => void`<br/> | N
onIndexChange | Function |  | Typescript：`(index: number, context: { trigger: 'prev' \| 'next' \| 'current' }) => void`<br/> | N
