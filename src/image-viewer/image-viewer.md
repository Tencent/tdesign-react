:: BASE_DOC ::

## API
### ImageViewer Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
src | String | - | 基本展示图片 | Y
alt | String | - | 加载失败时提示文本，同 img[alt]。TS 类型：`string `| N
title | String | - | 按钮内容。TS 类型：`string`。| N
titleIcons | Array | [] | 是否展示可操作图标TS 类型：`(browse|ellipsis)[]` | N
type | String | normal | 大图弹窗模式。 TS 类型`'mini' | 'normal'`| N
miniWidth | Number | 1000 | mini类型弹窗最小宽度。| N
miniHeight | Number | 1000 | mini类型弹窗最小高度 | N
movable | Boolean | false | mini类型弹窗是否支持拖动位置 | N
previewSrcList | Array | [] | 预览图片列表。 TS 类型：`string[]`| N
zIndex | Number | 2000 | 弹窗层级 | N
startIndex | Number | 0 | 开启弹窗时默认展示图片下标 | N
closeOnMark | Boolean | false | 点击遮罩是否关闭弹窗 | N
mask | Boolean | true | 是否需要弹窗 | N
maxScale | Number | 2 | 图片放大比例 | N
scaleStep | Number | 0.5 | 鼠标滚动放大速度 | N
onClose | Function |  | TS 类型：`(e: MouseEvent) => void`<br/>关闭弹窗触发 | N
onOpen | Function |  | TS 类型：`(e: MouseEvent) => void`<br/>开启弹窗触发 | N
onClick | Function |  | TS 类型：`(e: MouseEvent) => void`<br/>点击时触发 | N
:: BASE_PROPS ::
