:: BASE_DOC ::

### 安装独立 Icon 包

图标相对其他基础组件较为独立，所以作为一个独立的 npm 包做发布管理。如果项目中直接使用，请安装`tdesign-icons-react`。

### 按需引入图标

推荐使用按需引入的方式使用图标，通过如下方式按需引入。

`import { CloseIcon } from 'tdesign-icons-react';`

{{ IconExample }}

### IconFont 图标

您也可以以 IconFont 的形式使用图标，通过如下来使用图标。

`import { IconFont } from 'tdesign-icons-react';`

{{ IconFontExample }}

### SVG 高级用法

可以传入 url 加入新的 SVG 图标。

引入新的图标 Url 之后，图标名称必须写全称，以作区分，如：`"name='home'"` 需要写成 `"name='t-icon-home'"`。

组件会引入默认的 SVG 图标，如果希望禁止组件加载默认的 SVG 图标，将 `loadDefaultIcons` 置为 false 即可。

{{ Enhanced }}


### IconFont 高级用法

可以传入 url 加入新的 iconfont 图标。

引入新的图标 Url 之后，图标名称必须写全称，以作区分，如：`"name='home'"` 需要写成 `"name='t-icon-home'"`。

组件会引入默认的 iconfont 图标，如果希望禁止组件加载默认的 iconfont 图标，将 `loadDefaultIcons` 置为 false 即可。

{{ IconFontEnhanced }}

### 图标选择器

在一些业务场景中，存在需要选择图标的情况，可以配合`Select`组件来实现`图标选择器`。

{{ IconSelect }}

### FAQ

#### 如何获取全部图标的名称列表？

可以通过`import { manifest } from 'tdesign-icons-react'` 获取全部图标的名称列表。

### iconfont和icon使用时都会发起网络请求，我的项目是无网络场景，如何使用？

`iconfont`需要加载图标的字体资源，而`icon`需要加载图标的 svgsprite 资源，这些资源都是相对来说比较大的，所以没有直接放在包里（当然不排除未来会做改动），所以会发起网络请求。

所以如果你的项目是无网络场景，请使用按需加载的图标，如`<AddIcon />`。

### 全部图标

<td-icons-view />

## API
### IconSVG Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
loadDefaultIcons | Boolean | true | 是否加载组件库内置图标 | N
name | String | - | 必需。图标名称 | Y
size | String | undefined | 图标尺寸，支持 'small', 'medium', 'large'，'35px', '3em' 等 | N
style | String | - | HTML 原生属性。可用于设置图标颜色，如：style=\"color: red\" | N
url | String / Array | - | 图标地址，地址内容参考[组件内部默认加载图标](https://tdesign.gtimg.com/icon/web/index.js)。TS 类型：`string \| Array<string>` | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发 | N

### Iconfont Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
loadDefaultIcons | Boolean | true | 是否加载组件库内置图标 | N
name | String | - | 必需。图标名称 | Y
size | String | undefined | 图标尺寸，支持 'small', 'medium', 'large'，'35px', '3em' 等 | N
style | String | - | HTML 原生属性。可用于设置图标颜色，如：style=\"color: red\" | N
tag | String | i | 图标 DOM 元素，可选值：i/span/div/... | N
url | String / Array | - | 图标地址，地址内容参考[组件内部默认加载图标](https://tdesign.gtimg.com/icon/web/index.css)。也可以在 index.html 中引入图标地址。TS 类型：`string \| Array<string>` | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发 | N
