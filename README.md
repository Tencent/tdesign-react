# TDesign Web (React)

TDesign 是由前端通用 UI 组件库 Oteam 发起，协同公司内有组件库开发经验的同学一起建设的组件库

## 特性

- 前端通用 UI 组件库 Oteam Web React 版实现
- 基于 React 16.x（全部基于 React Hooks 的 Functional Component）
- 对接前端组件语言规范
- 与其他框架/库（Vue / Angular）版本 UI 保持一致
- 支持国际化（完善中）
- 支持按需加载

## 参与贡献

### 组件开发

```shell
git clone https://github.com/TDesignOteam/tdesign-react.git
cd tdesign-react
# 初始化子仓库
git submodule init
git submodule update
# 子仓库切换到 develop 分支
cd src/_common && git checkout develop
# 开发预览
cd ../..
npm install
npm run start

# install 如果遇到失败时，可运行以下命令，再进行 npm install
export http_proxy=http://127.0.0.1:12639
export https_proxy=http://127.0.0.1:12639
export all_proxy=http://127.0.0.1:12639
```

更多开发指引请参考[开发规范与说明](./CONTRIBUTING.md)
