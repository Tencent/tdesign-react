---
title: React for Mobile
description: TDesign Mobile React is a UI component library for React and Mobile application.
spline: explain
---

### Installation

The component library is currently in the Beta stage and is undergoing rapid iteration. Please pay attention to version changes.

#### npm

```bash
npm i tdesign-mobile-react
```

#### unpkg

```html
<link rel="stylesheet" href="https://unpkg.com/tdesign-mobile-react/dist/tdesign.min.css" />
<script src="https://unpkg.com/tdesign-mobile-react/dist/tdesign.min.js"></script>
```

> Please note that unpkg usage is not recommended as it will download the entire component library. Production projects will be directly affected by version updates, and may also be affected by the stability of the CDN.

The package of tdesign-mobile-react provides kinds of bundles, read [the documentation](https://github.com/Tencent/tdesign/blob/main/docs/develop-install.md) for the detail of differences between bundles.

### Usage

With the help of building tools such as `Webpack` or `Rollup` that support tree-shaking features, you can achieve the effect of importing on demand.

```javascript
import { Button } from 'tdesign-mobile-react';
import 'tdesign-mobile-react/es/style/index.css'; // global design variables
```

### Customize theme

Since the original styles are written in Less, you need to handle the compilation of Less files yourself (for example, by installing Less and Less-loader).

read [this file](https://github.com/Tencent/tdesign-common/blob/main/style/mobile/_variables.less) fro the complete less variables definition of TDesign.

```javascript
import { Button } from 'tdesign-mobile-react/esm/';
import 'tdesign-mobile-react/esm/style/index.js'; // 少量公共样式
```

to customize theme with vite

```javascript
// vite.config.js
export default {
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '@btn-height-s': '40px',
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
+           '@btn-height-s': '40px',
+         },
+         javascriptEnabled: true,
+       },
+     },
    }],
  }],
}
```

### How to use React with Next.js

`Next.js` does not support importing `css` style files by default. But the `es` bundle of tdesign-mobile-react automatically includes the corresponding css style file, which causes errors in the project. To solve this, we have provided a set of style-free component library codes stored in the `lib` bundle.

When using Next.js, you need to adjust how you use these components.

```js
'use client'

import { Button } from 'tdesign-mobile-react/lib/';
import 'tdesign-mobile-react/dist/tdesign.css';
```

In addition, the code exported by the `lib` package is written in `es6` and is located in the `node_modules`. It will be skipped by Webpack during compilation, and you need to configure it in `next.config.js`

```js
const nextConfig = {
  experimental: {
    transpilePackages: ['tdesign-mobile-react'],
  },
};

module.exports = nextConfig;
```

### Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| -- | -- | -- | -- |
| >= 84 | >= 83 | >= 84 | >= 14.1 |
