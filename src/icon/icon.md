:: BASE_DOC ::

### 安装独立 Icon 包

图标相对其他基础组件较为独立，所以作为一个独立的 npm 包做发布管理。如果项目中直接使用，请安装`tdesign-icons-react`。

### IconFont 图标

你可以使用以下方式，通过 IconFont 形式来使用图标

`import { IconFont } from 'tdesign-icons-react';`

{{ IconFontExample }}

### 全部图标

{{ IconExample }}

## API

### IconSVG Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
loadDefaultIcons | Boolean | true | 是否加载组件库内置图标 | N
name | String | - | 必需。图标名称 | Y
size | String | undefined | 图标尺寸，支持 'small', 'medium', 'large'，'35px', '3em' 等 | N
style | String | - | HTML 原生属性。可用于设置图标颜色，如：style="color: red" | N
url | String / Array | - | 图标地址，地址内容参考[组件内部默认加载图标](https://tdesign.gtimg.com/icon/web/index.js)。TS 类型：`string | Array<string>` | N
onClick | Function |  | 点击时触发。`(e: MouseEvent) => {}` | N

### Iconfont Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
loadDefaultIcons | Boolean | true | 是否加载组件库内置图标 | N
name | String | - | 必需。图标名称 | Y
size | String | undefined | 图标尺寸，支持 'small', 'medium', 'large'，'35px', '3em' 等 | N
style | String | - | HTML 原生属性。可用于设置图标颜色，如：style="color: red" | N
tag | String | i | 图标 DOM 元素，可选值：i/span/div/... | N
url | String / Array | - | 图标地址，地址内容参考[组件内部默认加载图标](https://tdesign.gtimg.com/icon/web/index.css)。也可以在 index.html 中引入图标地址。TS 类型：`string | Array<string>` | N
onClick | Function |  | 点击时触发。`(e: MouseEvent) => {}` | N
