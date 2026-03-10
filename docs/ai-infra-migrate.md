## 一、当前现状梳理

### 已有规范文档资产

| 文档 | 位置 | 内容概要 | 状态 |
|------|------|---------|------|
| **develop-install.md** | `packages/common/` | 6 种构建产物规范（dist/es/esm/lib/ejs）、package.json 入口配置标准 | ✅ 完整，可直接引用 |
| **api.md** | `packages/common/` | API 设计规范：TNode 类型、事件命名、v-model、size 默认值等 | ✅ 完整，可直接引用 |
| **css-naming.md** | `packages/common/` | BEM 命名规范、状态类名 `t-is-*`、尺寸类 `t-size-*` | ✅ 完整，可直接引用 |
| **naming.md** | `packages/common/` | 组件命名规范（被 css-naming.md 引用） | ✅ 存在 |
| **tdesign-react-spec-coding-guide.md** | `.codebuddy/` | React 编码指导概述（forwardRef、useDefaultProps 等） | ⚠️ 概述性，缺少可执行的 SOP |
| **CONTRIBUTING.md** | 根目录 | 贡献指南（分支策略、PR 流程） | ✅ 完整 |
| **PUBLISH.md** | 根目录 | 发布流程说明 | ✅ 完整 |

### 已有工程工具

| 工具 | 位置 | 状态 |
|------|------|------|
| 组件脚手架 | `script/init-component/` | ⚠️ 旧版，路径写死 `src/`，不支持 monorepo |
| CSS 变量生成 | `packages/common/scripts/generate-css-vars.mjs` | ✅ 可用 |
| Rollup 构建配置 | `script/rollup.config.js` | ✅ 支持 6 种产物 |
| 快照测试框架 | `test/snap/` | ✅ CSR + SSR |

### 缺失/待建设

| 项目 | 说明 |
|------|------|
| **Specs 体系** | 无结构化的 spec 定义目录 |
| **Skills 体系** | 无 AI 可执行的 SKILL.md SOP |
| **错误知识库** | 无 common-errors.md 类型的知识修正文档 |
| **模式库** | 组件开发模式散落在代码注释中，未系统化 |

---

## 二、重要 Specs 规划

Specs 定义"**是什么**"——标准、规范、架构约束。

| Spec 名称 | 内容来源 | 核心内容 |
|-----------|---------|---------|
| **build-output-spec** | develop-install.md | 6 种产物格式定义（dist/es/esm/lib/ejs/umd）、package.json 入口字段标准、sideEffects 配置 |
| **api-design-spec** | api.md | TNode 类型系统、事件命名规范（on 前缀）、size 三档默认值、v-model 双向绑定 |
| **css-naming-spec** | css-naming.md | BEM `t-[block]__[element]--[modifier]`、状态类 `t-is-*`、尺寸类 `t-size-*` |
| **component-architecture-spec** | 散落规范整合 | 组件目录结构标准、type.ts/defaultProps.ts 生成规则、forwardRef 模式、入口导出规范 |
| **testing-strategy-spec** | test/ 目录分析 | 单测覆盖率标准、CSR/SSR 快照策略、Vitest 配置规范 |
| **aigc-component-spec** | pro-components 分析 | Chat 组件体系架构、独立构建链、`@tdesign-react/chat` 发布规范 |

---

## 三、重要 Skills 规划

Skills 定义"**怎么做**"——可执行的 SOP 流程。

### A. 开发规范类（最高优先级）

| Skill 名称 | 用途 | SOP 要点 |
|------------|------|---------|
| **`tdesign-create-component`** | 新组件脚手架 | 1) 选择目标包(components/pro-components) 2) 生成完整目录结构 3) 自动注册到 index.ts 和 site.config.mjs 4) 遵循 forwardRef + useDefaultProps 模式 |
| **`tdesign-component-style`** | 组件样式开发 | 1) BEM 类名生成 2) Less 变量引用路径 3) `t-is-*` 状态类使用 4) CSS Variables 文档生成 |
| **`tdesign-api-type-sync`** | API 类型同步 | 1) type.ts 生成规范 2) TNode 类型定义标准 3) 事件 Props `onXxx` 命名 4) defaultProps.ts 对齐 |

### B. 测试辅助类

| Skill 名称 | 用途 | SOP 要点 |
|------------|------|---------|
| **`tdesign-test-component`** | 组件单元测试 | 1) Vitest + @testing-library/react 2) `__tests__/vitest-*.test.jsx` 命名 3) 渲染/事件/异步断言模式 |
| **`tdesign-snapshot-update`** | 快照维护 | 1) CSR/SSR 快照更新流程 2) 何时更新快照 vs 修复代码的决策 |

### C. 发布运维类

| Skill 名称 | 用途 | SOP 要点 |
|------------|------|---------|
| **`tdesign-release`** | 版本发布 | 1) release 分支创建 2) CHANGELOG 生成 3) 6 种产物校验 4) npm publish 流程 |
| **`tdesign-build-verify`** | 构建验证 | 1) 6 种产物格式检查清单 2) package.json 入口字段验证 3) sideEffects 配置验证 |

### D. 知识修正类

| Skill 名称 | 用途 | SOP 要点 |
|------------|------|---------|
| **`tdesign-common-errors`** | 常见错误参考 | lodash→lodash-es、type.ts 不可手动编辑、`useConfig()` vs 硬编码前缀、React 19 适配等 |
| **`tdesign-pattern-reference`** | 组件模式库 | forwardRef 标准模式、受控/非受控(useControlled)、TNode 渲染、虚拟滚动模式 |

---

## 四、优先级建议

| 优先级 | Specs | Skills |
|--------|-------|--------|
| **P0** | build-output-spec, api-design-spec, css-naming-spec | `tdesign-create-component`, `tdesign-common-errors`, `tdesign-test-component` |
| **P1** | component-architecture-spec, aigc-component-spec | `tdesign-component-style`, `tdesign-pattern-reference`, `tdesign-release` |
| **P2** | testing-strategy-spec | `tdesign-monorepo-migrate`, `tdesign-api-type-sync`, `tdesign-build-verify` |
