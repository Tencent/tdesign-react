:: BASE_DOC ::

## API

### ImageViewer Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
closeBtn | TNode | true | Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
cover | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
deleteBtn | TNode | false | Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
image | TElement | - | `0.21.1`。Typescript: `TNode<ImageSlotParams>` `interface ImageSlotParams {src: string; index?: number;  extra?: Record<string, any>; className?: string; style?: string; onLoad?: (e: Event) => void; onTransitionstart?: (e: TransitionEvent) => void; onTransitionend?: (e: TransitionEvent) => void;} `。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/image-viewer/type.ts) | N
images | Array | [] | Typescript: `Array<string \| ImageInfo>` `interface ImageInfo { url: string; align: 'start' \| 'center' \| 'end'; extra?: Record<string, any>}`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/image-viewer/type.ts) | N
index | Number | 0 | \- | N
defaultIndex | Number | 0 | uncontrolled property | N
loop | Boolean | true | \- | N
maxZoom | Number | 3 | \- | N
showIndex | Boolean | false | \- | N
visible | Boolean | false | hide or show image viewer | N
defaultVisible | Boolean | false | hide or show image viewer。uncontrolled property | N
onClose | Function |  | Typescript: `(context: { trigger: ImageViewerCloseTrigger, visible: boolean, index: number }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/image-viewer/type.ts)。<br/>`type ImageViewerCloseTrigger = 'image' \| 'overlay' \| 'close-btn'`<br/> | N
onDelete | Function |  | Typescript: `(index: number) => void`<br/> | N
onIndexChange | Function |  | Typescript: `(index: number, context: { trigger: 'prev' \| 'next' \| 'current' }) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-image-viewer-close-margin-left | @spacer-1 | -
--td-image-viewer-delete-margin-right | @spacer-1 | -
--td-image-viewer-mask-bg-color | @mask-active | -
--td-image-viewer-nav-bg-color | #000 | -
--td-image-viewer-nav-color | @font-white-1 | -
--td-image-viewer-nav-height | 48px | -
--td-image-viewer-nav-index-font-size | @font-size-base | -
