---
title: TD AIGC Components for React
description: TDesign 适配桌面端的 AIGC 系列高阶组件库，适合在 React 技术栈中的AI chat组件。
spline: ai
---

## 安装

### 使用 npm 安装

推荐使用 npm 方式进行开发

```shell
npm i @tdesign-react/aigc
```

## 使用

### 基础使用

推荐使用 Webpack 或 Rollup 等支持 tree-shaking 特性的构建工具，无需额外配置即可实现组件按需引入：

```javascript
import { ChatBot } from '@tdesign-react/aigc';
import '@tdesign-react/aigc/es/style/index.js'; // 少量公共样式
```

## 浏览器兼容性

| [<img src="https://tdesign.gtimg.com/docs/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://tdesign.gtimg.com/docs/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://tdesign.gtimg.com/docs/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://tdesign.gtimg.com/docs/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                 | Firefox >=83                                                                                                                                                            | Chrome >=84                                                                                                                                                          | Safari >=14.1                                                                                                                                                        |

详情参见[桌面端组件库浏览器兼容性说明](https://github.com/Tencent/tdesign/wiki/%E6%A1%8C%E9%9D%A2%E7%AB%AF%E7%BB%84%E4%BB%B6%E5%BA%93%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7%E8%AF%B4%E6%98%8E)
