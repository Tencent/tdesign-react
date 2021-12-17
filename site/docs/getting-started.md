---
title: React for Web
description: TDesign 适配桌面端的组件库，适合在 React 技术栈项目中使用。
spline: explain
---

<div style={{
  'background': '#d4e3fc',
  'display': 'flex',
  'alignItems': 'center',
  'lineHeight': '20px',
  'padding': '14px 24px',
  'borderRadius': '3px',
  'color': '#555a65'
}}>
  <svg fill="none" viewBox="0 0 16 16" width="16px" height="16px" style={{'marginRight': '5px'}}>
    <path fill="rgb(0, 82, 217)" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fillOpacity="0.9"></path>
  </svg>
  <p>目前组件库处于 Alpha 阶段，快速迭代中，请留意版本变化。</p>
</div>

### 安装

```bash
npm i tdesign-react
```

### 基础使用

推荐使用 Webpack 或 Rollup 等支持 tree-shaking 特性的构建工具，无需额外配置即可实现组件按需引入：

```javascript
import { Button } from 'tdesign-react';
import 'tdesign-react/es/style/index.css'; // 少量公共样式
```

npm package 中提供了多种构建产物，可以阅读 [这里](https://github.com/Tencent/tdesign-common/blob/develop/develop-install.md) 了解不同目录下产物的差别。

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

npm package 中提供了多种构建产物，可以阅读 [这里](https://github.com/Tencent/tdesign-common/blob/develop/develop-install.md) 了解不同目录下产物的差别。

### 浏览器兼容性

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 3 versions                                                                                                                                                                                                   | last 3 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               |
