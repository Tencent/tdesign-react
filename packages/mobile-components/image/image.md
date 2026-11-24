:: BASE_DOC ::

## API

### Image Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
alt | String | - | 图片描述 | N
error | TNode | - | 自定义图片加载失败状态下的显示内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
fallback | String | - | 图片加载失败时，显示当前链接设置的图片地址。如果要使用组件图标或完全自定义加载失败时显示的内容，请更为使用 `error` | N
fit | String | fill | 图片填充模式。可选项：contain/cover/fill/none/scale-down | N
lazy | Boolean | false | 是否开启图片懒加载 | N
loading | TNode | - | 自定义加载中状态的图片内容，如：“加载中”。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
position | String | center | 等同于原生的 object-position 属性，可选值为 top right bottom left 或 string，可以自定义任何单位，px 或者 百分比 | N
referrerpolicy | String | - | `<img>` 标签的原生属性，[MDN 定义](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)。可选项：no-referrer/no-referrer-when-downgrade/origin/origin-when-cross-origin/same-origin/strict-origin/strict-origin-when-cross-origin/unsafe-url | N
shape | String | square | 图片圆角类型。可选项：circle/round/square | N
src | String | - | 图片链接 | N
srcset | Object | - | 图片链接集合，用于支持特殊格式的图片，如 `.avif` 和 `.webp`。会优先加载 `srcset` 中的图片格式，浏览器不支持的情况下，加载 `src` 设置的图片地址。TS 类型：`ImageSrcset` `interface ImageSrcset { 'image/avif': string; 'image/webp': string; }`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/image/type.ts) | N
onError | Function |  | TS 类型：`(context: { e: ImageEvent }) => void`<br/>图片加载失败时触发。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
onLoad | Function |  | TS 类型：`(context: { e: ImageEvent }) => void`<br/>图片加载完成时触发。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-image-color | @text-color-placeholder | -
--td-image-loading-bg-color | @bg-color-secondarycontainer | -
--td-image-loading-color | @text-color-placeholder | -
--td-image-round-radius | @radius-default | -
