:: BASE_DOC ::

## API

### Loading Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
attach | String / Function | '' | 挂载元素，默认挂载到组件本身所在的位置。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`AttachNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
children | TNode | - | 子元素，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | 子元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
delay | Number | 0 | 延迟显示加载效果的时间，用于防止请求速度过快引起的加载闪烁，单位：毫秒 | N
duration | Number | 800 | 加载动画执行完成一次的时间，单位：毫秒 | N
fullscreen | Boolean | false | 是否显示为全屏加载 | N
indicator | TNode | true | 加载指示符，值为 true 显示默认指示符，值为 false 则不显示，也可以自定义指示符。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
inheritColor | Boolean | false | 是否继承父元素颜色 | N
layout | String | horizontal | 对齐方式。可选项：horizontal/vertical | N
loading | Boolean | true | 是否处于加载状态 | N
pause | Boolean | false | 是否暂停动画 | N
preventScrollThrough | Boolean | true | 防止滚动穿透，全屏加载模式有效 | N
reverse | Boolean | - | 加载动画是否反向 | N
size | String | '20px' | 尺寸，示例：20px | N
text | TNode | - | 加载提示文案。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
theme | String | circular | 加载组件类型。可选项：circular/spinner/dots | N

### loading 或 LoadingPlugin

参数名称 | 参数类型 | 参数默认值 | 参数描述
-- | -- | -- | --
options | Function | - | 必需。TS 类型：`boolean \| TdLoadingProps`

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-loading-color | @brand-color | -
--td-loading-full-bg-color | rgba(255, 255, 255, 60%) | -
--td-loading-line-bg-color | @text-color-primary | -
--td-loading-text-color | @text-color-primary | -
--td-loading-text-font | @font-body-small | -
--td-loading-z-index | @z-index-loading | -
