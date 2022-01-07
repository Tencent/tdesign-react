<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />
  </a>
</p>

<p align="center">
   <a href="https://www.npmjs.com/package/tdesign-react">
    <img src="https://img.shields.io/npm/l/tdesign-react.svg?sanitize=true" alt="License" />
  </a>
  <a href="https://www.npmjs.com/package/tdesign-react">
    <img src="https://img.shields.io/npm/v/tdesign-react.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-react">
    <img src="https://img.shields.io/npm/dt/tdesign-react.svg?sanitize=true" alt="Downloads" />
  </a>
</p>

TDesign 适配桌面端的组件库，适合在 React 16.x 技术栈项目中使用。

# 🎉 特性

- 适配桌面端交互
- 基于 React 16.x（全部基于 React Hooks 的 Functional Component）
- 与其他框架/库（Vue / Angular）版本 UI 保持一致
- 支持暗黑模式及其他主题定制
- 支持按需加载

# 安装

```shell
npm i tdesign-react
```

# 基础使用

推荐使用 Webpack 或 Rollup 等支持 tree-shaking 特性的构建工具，无需额外配置即可实现组件按需引入：

```js
import { Button } from 'tdesign-react';
import 'tdesign-react/es/style/index.css'; // 少量公共样式
```

npm package 中提供了多种构建产物，可以阅读 [这里](https://github.com/Tencent/tdesign/blob/main/docs/develop-install.md) 了解不同目录下产物的差别。

# 浏览器兼容性

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=79                                                                                                                                                                                                        | Firefox >=83                                                                                                                                                                                                      | Chrome >=69                                                                                                                                                                                                   | Safari >=12                                                                                                                                                                                                   |

详情参见[桌面端组件库浏览器兼容性说明](https://github.com/Tencent/tdesign/wiki/%E6%A1%8C%E9%9D%A2%E7%AB%AF%E7%BB%84%E4%BB%B6%E5%BA%93%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7%E8%AF%B4%E6%98%8E)

# 其他技术栈实现

- 桌面端 Vue 3 实现：[web-vue-next](https://github.com/Tencent/tdesign-vue-next)
- 桌面端 Vue 实现： [web-vue](https://github.com/Tencent/tdesign-vue)
- 移动端小程序实现： [小程序](https://github.com/Tencent/tdesign-miniprogram)

# 开源协议

TDesign 遵循 [MIT 协议](https://github.com/Tencent/tdesign-react/LICENSE)。
