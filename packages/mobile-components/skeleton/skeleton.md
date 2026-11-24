:: BASE_DOC ::

## API

### Skeleton Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
animation | String | none | 动画效果，有「渐变加载动画」和「闪烁加载动画」两种。值为 'none' 则表示没有动画。可选项：gradient/flashed/none | N
children | TNode | - | 加载完成的内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
delay | Number | 0 | 延迟显示加载效果的时间，用于防止请求速度过快引起的加载闪烁，单位：毫秒 | N
loading | Boolean | true | 是否为加载状态，如果是则显示骨架图，如果不是则显示加载完成的内容 | N
rowCol | Array | - | 高级设置，用于自定义行列数量、宽度高度、间距等。【示例一】，`[1, 1, 2]` 表示输出三行骨架图，第一行一列，第二行一列，第三行两列。【示例二】，`[1, 1, { width: '100px' }]` 表示自定义第三行的宽度为 `100px`。【示例三】，`[1, 2, [{ width, height }, { width, height, marginLeft }]]` 表示第三行有两列，且自定义宽度、高度、尺寸（圆形或方形使用）、间距、内容等。TS 类型：`SkeletonRowCol` `type SkeletonRowCol = Array<number \| SkeletonRowColObj \| Array<SkeletonRowColObj>>` `interface SkeletonRowColObj { width?: string; height?: string; size?: string; marginRight?: string; marginLeft?: string; margin?: string; content?: string \| TNode; type?: 'rect' \| 'circle' \| 'text' }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/skeleton/type.ts) | N
theme | String | text | 骨架图风格，有基础、头像组合等两大类。可选项：avatar/image/text/paragraph | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-skeleton-animation-flashed | rgba(90%, 90%, 90%, 0.3) | -
--td-skeleton-animation-gradient | @text-color-placeholder | -
--td-skeleton-bg-color | @bg-color-secondarycontainer | -
--td-skeleton-circle-border-radius | @radius-circle | -
--td-skeleton-circle-height | 48px | -
--td-skeleton-rect-border-radius | @radius-default | -
--td-skeleton-rect-height | 16px | -
--td-skeleton-row-spacing | @spacer-2 | -
--td-skeleton-text-border-radius | @radius-small | -
--td-skeleton-text-height | 16px | -
