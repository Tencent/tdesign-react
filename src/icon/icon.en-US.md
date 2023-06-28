:: BASE_DOC ::

### Install tdesign-icons-react

Icons are published and managed as a separate npm package. If you want to use it directly in your project, please install `tdesign-icons-react`. 
### Import on-demand

SVG icons can be imported on demand. When using the Icon component in component development, SVG icons are imported on demand.

`import { CloseIcon } from 'tdesign-icons-react';`

{{ IconExample }}

### Iconfont

{{ IconFontExample }}

### Advanced usage of SVG


New svg icons can be added by passing in the URL. 

The component will import default svg icons. If you want to disable the loading of default svg icons, set `loadDefaultIcons` to `false`.

{{ Enhanced }}

### Advanced usage of iconfont

New iconfont icons can be added by passing in the URL. 

The component will import default iconfont icons. If you want to disable the loading of default iconfont icons, set `loadDefaultIcons` to `false`.

{{ IconFontEnhanced }}

### Icon Selector

If you need to select icons in your project, please use `Select` to implement an icon selector.

{{ IconSelect }}

### FAQ

#### How to get all the names of icons？

You can get all the name of icon by import manifest from the bundle `import { manifest } from 'tdesign-icons-react'`

#### the usage of full import needs network. What if my project is in a no-network scenario?

if your project is in a no-network scenario, please use on-demand loading of icons. For example,`<t-icon name="add" />` should be changed to `<AddIcon />`
### All Icons

<td-icons-view />


## API

### IconSVG Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
loadDefaultIcons | Boolean | true | \- | N
name | String | - | required | Y
size | String | undefined | \- | N
style | String | - | html attribute | N
url | String / Array | - | Typescript：`string \| Array<string>` | N
onClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N

### Iconfont Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
loadDefaultIcons | Boolean | true | \- | N
name | String | - | required | Y
size | String | undefined | \- | N
style | String | - | html attribute | N
tag | String | i | \- | N
url | String / Array | - | Typescript：`string \| Array<string>` | N
onClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
