# tdesign-react 开发指南

tdesign-react 包含 Web-React 代码库和一个子仓库，子仓库地址为 [tdesign-common](https://github.com/TDesignOteam/tdesign-common)

## 公共子仓库 TDesign-Common 说明

本项目以子仓库的形式引入 TDesign-Common 公共仓库，对应文件目录中的 common 文件夹。公共库中包含：

- 一些公共的工具函数
- 组件库 UI 开发的内容，即组件 HTML 结构和 CSS 样式（React / Vue / Angular 共用同一份结构和样式）

### 初始化子仓库

- 首次克隆项目代码后需要初始化子仓库，执行命令 `git submodule init && git submodule update` 即可
- `git submodule update` 之后子仓不会指向任何开发分支，只是指向某一个提交的游离状态，因此需要手动切换到开发分支，执行命令 `cd src/_common && git checkout develop` 即可

### 子仓库开发

子仓库的组件分支从 `develop` 分支 `checkout`。比如在 `feature/button` 分支进行开发，在子仓库中开发完成之后提交代码时需要先完成子仓库代码提交，然后再回到 `tdesign-react` 主仓库完成提交。步骤如下：

- 先进入项目的 `src/_common` 文件夹，按照正常操作将结构和样式的修改提交到子仓库（涉及组件调整的建议同步到其他框架/库版本的开发者）
- 然后回到主仓库目录（`tdesign-react`），此时会看到 `src/_common` 文件夹是修改状态的，在主仓库按照正常步骤添加变动进行提交即可

- 样式部分统一使用 `less` 开发。

### 组件 API

组件 API 相关文件包括 `props.ts` / `type.ts` / `api.md` 等 3 类文件，可展开 src/button 目录查看。

所有组件 API 相关文件，并非手动书写，而是通过工具 tdesign-cli 自动生成，一般情况下不允许变更。如需变更，请联系 PMC。

### 关于组件库 UI

目前 UI 开发（HTML & CSS）是多个框架/库公用的，比如 Web-React / Web-Vue / Web-Angular。各个框架组件实现应该要复用 UI 开发的 HTML 结构，引用组件的 CSS 样式和 Demo 文档的样式（本仓库已经在入口处统一引用了）。UI 开发一般可以由单独的 UI 开发同学认领完成或者某个框架/库的组件开发同学完成，只需注意：

- 如果组件开发前子仓库中已经有组件的 UI 开发内容了，直接在主仓库中使用即可
- 如果没有，且你也负责 UI 开发：参考 UI 开发规范先完成 UI 开发内容、然后再到主仓库开发组件
- 如果没有，且 UI 开发工作已有其他同学负责或认领：可以先在主仓库开发组件功能，待 UI 开发输出之后对齐即可

如果 UI 的结构和样式（其他同学负责开发的情况下）还未完成，但是开发组件功能需要编写一些样式代码，可以直接在组件文件夹编写一个临时的 `less` 文件，在 JavaScript 代码中引入即可，比如：

```shell
├── button.less
├── button.tsx
```

```jsx
// button.tsx

// 先引入临时的样式文件用于开发功能，待 UI 开发完成之后需要与 UI 样式对齐并删除 less 文件
import './button.less';

// ...
```

## 开发规范

UI 开发规范参考子仓库的 [README](https://github.com/TDesignOteam/tdesign-common/tree/main/style/web) 文档

### 前缀

组件和 CSS 选择器前缀以 `t-` 开头，无论是 JavaScript 还是 CSS 代码都要使用变量定义前缀，这样可以方便后续进行全局替换。

### TypeScript 代码规范

组件库统一使用 TypeScript 编写，并且遵循 Airbnb 的代码规范：

- JavaScript 编码规范：https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
- TypeScript 部分遵循工程的 Lint 配置

开发提交时可以使用 `tnpm run lint --fix` 执行自动修复 `eslint` 错误

### CSS 规范

组件样式在 common 子仓库开发，遵循子仓库中定义的 [UI 开发规范](https://github.com/TDesignOteam/tdesign-common/blob/main/style/web/README.md)即可

### Git 分支规范

#### 分支

主仓库遵循使用 `git flow` 规范，新组件分支从 `develop` 分支中 `checkout`（参考：https://nvie.com/posts/a-successful-git-branching-model/）

如果是贡献组件，从 `develop` 分支 `checkout` 分支即可，比如：`feature/button`。如果同时需要在子仓库进行 UI 开发/修改，这里建议在子仓库中也要 `checkout` 同名分支

#### 提交说明

项目使用基于 angluar 提交规范：https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional

每次提交会自动触发提交验证

- 使用工具 commitizen 协助规范 git commit 信息
- fix & feat 的提交会被用来生成 changelog
- 提交会触发 git pre-commit 检查，修复提示的 eslint 错误

## 开发

### 安装依赖

```shell
npm i
# 或者
npm install
```

### 本地开发

```shell
npm run start
```

浏览器访问：`http://127.0.0.1:15000`（构建任务配置了自动打开浏览器访问站点页面）

单独调试 Demo 页面

浏览器访问：`http://127.0.0.1:15000/react/demos/[componentName]/` 选择调试 Demo

### 目录结构

```shell
├── site # 站点代码
├── src # 组件代码
├── src/[组件]/__tests__ # 测试文件
├── src/[组件]/_example # 演示文件
├── test # 测试配置
```

### 新增开发组件

可以参考已有组件在 `src` 目录中新增组件文件夹。 或通过以下脚本创建

```shell
## 第一步 在react仓库内执行创建脚本
npm run init component-name
## 第二步 同步最新的组件API文档(联系 PMC)

## 第三步 在site/site.config.js中新增一个新组件的config
```

### 组件页面路由配置

每一个组件页，都是一个 md 文件，在 `site/site.config` 路由中配置即可。

### 组件 Demo 演示配置

为了保证与 vue 仓库演示文档内容统一，目前将公共基础演示 demo 与说明归档在 `src/_common/docs/web/api/[组件].md` 中，其中需要各个技术栈的组件提供文档里面所要求的基础 demo 文件否则会编译警告。

例如 `tooltip` 组件则需要 `_expample` 文件夹中包含有 `arrow.jsx`、 `noArrow.jsx` 文件

```md
# Tooltip 文字提示

用于文字提示的气泡框。

## 组件类型

### 带箭头的文字提示

{{ arrow }}

### 不带箭头的文字提示

{{ noArrow }}
```

如需额外添加演示 demo 的可以参考以下写法:

```md
{{ PrimaryButton }}

<!-- or  -->

::: demo _example/PrimaryButton.jsx button
:::
```

### 组件测试参考

- [Jest](https://jestjs.io/)
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro)
