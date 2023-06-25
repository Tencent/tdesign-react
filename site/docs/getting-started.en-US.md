---
title: React for Web
description: TDesign React is a UI component library for React and desktop application.
spline: explain
---

### 安装

#### 使用 npm 安装

推荐使用 npm 方式进行开发

```bash
npm i tdesign-react
```

## Installation

### npm

```shell
npm i tdesign-react
```

#### unpkg

```html
<link rel="stylesheet" href="https://unpkg.com/tdesign-react/dist/tdesign.min.css" />
<script src="https://unpkg.com/tdesign-react/dist/tdesign.min.js"></script>
```

The package of tdesign-react provides kinds of bundles, read [the documentation](https://github.com/Tencent/tdesign/blob/main/docs/develop-install.md) for the detail of differences between bundles.

### Usage

With the help of building tools such as `Webpack` or `Rollup` that support tree-shaking features, you can achieve the effect of importing on demand.

```javascript
import { Button } from 'tdesign-react';
import 'tdesign-react/es/style/index.css'; // global design variables
```

### Customize theme

由于原始样式基于 less 编写，需要自行处理 less 文件的编译（例如安装 less、less-loader）

read [this file](https://github.com/Tencent/tdesign-common/blob/main/style/web/_variables.less) fro the complete less variables definition of TDesign.

```javascript
import { Button } from 'tdesign-react/esm/';
import 'tdesign-react/esm/style/index.js'; // 少量公共样式
```

to customize theme with vite

```javascript
// vite.config.js
export default {
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '@btn-height-default': '40px',
        },
      },
    },
  },
};
```

to customize theme with webpack

```javascript
// webpack.config.js
module.exports = {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
+     options: {
+       lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
+         modifyVars: {
+           '@btn-height-default': '40px',
+         },
+         javascriptEnabled: true,
+       },
+     },
    }],
  }],
}
```

### How to use React with next.js

在 `next.js` 中并不支持引入 `css` 样式文件，而默认导入的 `es` 产物中会自动引入相应 `css` 文件导致项目报错，我们提供了一套无样式的组件库代码存放在 `lib` 目录下。

所以在 `next.js` 中需要调整下使用方式：

```js
import { Button } from 'tdesign-react/lib/'; // 按需引入无样式组件代码
import 'tdesign-react/dist/tdesign.css'; // 全局引入所有组件样式代码
```

此外 `lib` 包导出的是 `es6` 的代码且在 `node_modules` 中，会被 `webpack` 在编译时跳过，还需配置下 `next.config.js`。

```js
const nextConfig = {
  experimental: {
    transpilePackages: ['tdesign-react'],
  },
};

module.exports = nextConfig;
```

## Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=91                                                                                                                                                                                                        | Firefox >=83                                                                                                                                                                                                      | Chrome >=91                                                                                                                                                                                                   | Safari >=14.1                                                                                                                                                                                                 |

Read our [browser compatibility](https://github.com/Tencent/tdesign/wiki/Browser-Compatibility) for more details.

## FAQ

Q: Does TDesign have a built-in reset style for unifying the default styles of page elements?

A: Since version `0.36.0`, tdesign-react no longer imports `reset.less`. The biggest impact is the removal of the global box model setting

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

If your project development depends on the `reset` style, you can import it from the `dist` directory.

```js
import 'tdesign-react/dist/reset.css';
```
