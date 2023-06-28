---
title: React for Web
description: TDesign 适配桌面端的组件库，适合在 React 技术栈项目中使用。
spline: explain
---

### 安装

#### 使用 npm 安装

推荐使用 npm 方式进行开发

```bash
npm i tdesign-react
```

#### 浏览器引入

目前可以通过 [unpkg.com/tdesign-react](https://unpkg.com/tdesign-react) 获取到最新版本的资源，在页面上引入 js 和 css 文件即可开始使用。

```html
<link rel="stylesheet" href="https://unpkg.com/tdesign-react/dist/tdesign.min.css" />
<script src="https://unpkg.com/tdesign-react/dist/tdesign.min.js"></script>
```

npm package 中提供了多种构建产物，可以阅读 [这里](https://github.com/Tencent/tdesign/blob/main/docs/develop-install.md) 了解不同目录下产物的差别。

### 基础使用

推荐使用 Webpack 或 Rollup 等支持 tree-shaking 特性的构建工具，无需额外配置即可实现组件按需引入：

```javascript
import { Button } from 'tdesign-react';
import 'tdesign-react/es/style/index.css'; // 少量公共样式
```

### 更改主题

由于原始样式基于 less 编写，需要自行处理 less 文件的编译（例如安装 less、less-loader）

更多 less 变量定义 [查看这里](https://github.com/Tencent/tdesign-common/blob/main/style/web/_variables.less)

```javascript
import { Button } from 'tdesign-react/esm/';
import 'tdesign-react/esm/style/index.js'; // 少量公共样式
```

在 vite 中定制主题

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

在 webpack 中定制主题

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

### 如何在 Next.js 中使用

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

### 浏览器兼容性

| [<img src="https://tdesign.gtimg.com/docs/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://tdesign.gtimg.com/docs/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://tdesign.gtimg.com/docs/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://tdesign.gtimg.com/docs/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                 | Firefox >=83                                                                                                                                                            | Chrome >=84                                                                                                                                                          | Safari >=14.1                                                                                                                                                        |

## FAQ

Q: 是否内置 reset 样式统一页面元素的默认样式 ？

A: `0.36.0` 版本开始我们不再引入 `reset.less`，影响最大的是移除了原先全局盒子模型的设定：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

如果你的项目开发依赖于原先的 `reset` 样式，可以从 `dist` 目录中单独引入它：

```js
import 'tdesign-react/dist/reset.css';
```
