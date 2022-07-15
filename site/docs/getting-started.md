---
title: React for Web
description: TDesign 适配桌面端的组件库，适合在 React 技术栈项目中使用。
spline: explain
---

<div style={{
  'background': 'rgba(0, 168, 112, .1)',
  'display': 'flex',
  'alignItems': 'center',
  'lineHeight': '20px',
  'padding': '14px 24px',
  'borderRadius': '3px',
  'color': '#555a65'
}}>
  <svg fill="none" viewBox="0 0 16 16" width="16px" height="16px" style={{'marginRight': '5px'}}>
    <path fill="#00a870" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fillOpacity="0.9"></path>
  </svg>
  <p>目前组件库处于 Beta 阶段，快速迭代中，请留意版本变化。</p>
</div>

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

### reset 样式

`0.36.0` 版本开始我们不再引入 `reset.less`，影响最大的是移除了原先全局盒子模型的设定：

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

### 浏览器兼容性

| [<img src="https://tdesign.gtimg.com/docs/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://tdesign.gtimg.com/docs/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://tdesign.gtimg.com/docs/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://tdesign.gtimg.com/docs/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                                                        | Firefox >=83                                                                                                                                                                                                      | Chrome >=84                                                                                                                                                                                                   | Safari >=14.1                                                                                                                                                                                                   |
