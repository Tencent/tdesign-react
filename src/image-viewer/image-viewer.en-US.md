:: BASE_DOC ::

## API

### ImageViewer Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
closeBtn | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
closeOnEscKeydown | Boolean | true | trigger image viewer close event on `ESC` keydown | N
closeOnOverlay | Boolean | - | \- | N
draggable | Boolean | undefined | \- | N
imageReferrerpolicy | String | - | attribute of `<img>`, [MDN Definition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)。options: no-referrer/no-referrer-when-downgrade/origin/origin-when-cross-origin/same-origin/strict-origin/strict-origin-when-cross-origin/unsafe-url | N
imageScale | Object | - | Typescript：`ImageScale` `interface ImageScale { max: number; min: number; step: number; defaultScale?: number; }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/image-viewer/type.ts) | N
images | Array | [] | Typescript：`Array<string \| File \| ImageInfo>` `interface ImageInfo { mainImage: string \| File; thumbnail?: string \| File; download?: boolean }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/image-viewer/type.ts) | N
index | Number | 0 | \- | N
defaultIndex | Number | 0 | uncontrolled property | N
mode | String | modal | options: modal/modeless | N
navigationArrow | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
showOverlay | Boolean | undefined | \- | N
title | TNode | - | preview title。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
trigger | TNode | - | trigger element。Typescript：`TNode \| TNode<{ open: () => void }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
viewerScale | Object | - | Typescript：`ImageViewerScale` `interface ImageViewerScale { minWidth: number; minHeight: number }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/image-viewer/type.ts) | N
visible | Boolean | false | hide or show image viewer | N
defaultVisible | Boolean | false | hide or show image viewer。uncontrolled property | N
zIndex | Number | - | \- | N
onClose | Function |  | Typescript：`(context: { trigger: 'close-btn' \| 'overlay' \| 'esc'; e: MouseEvent \| KeyboardEvent }) => void`<br/> | N
onIndexChange | Function |  | Typescript：`(index: number, context: { trigger: 'prev' \| 'next' \| 'current' }) => void`<br/> | N
