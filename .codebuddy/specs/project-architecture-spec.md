# TDesign React 项目架构全景图 (Project Architecture Spec)

> 本规范描述 tdesign-react monorepo 的整体架构、子包关系、构建流程和关键配置。

## 1. Monorepo 子包一览

```
tdesign-react-mono (根)
├── packages/components          @tdesign/components          [私有] 72 个基础 UI 组件源码
├── packages/pro-components/chat @tdesign/pro-components-chat  [私有] AIGC Chat 组件源码
├── packages/common              @tdesign/common               [子仓库] 跨框架公共样式 + JS 工具
│   ├── packages/common/style    @tdesign/common-style         [私有] Less 样式层
│   ├── packages/common/js       @tdesign/common-js            [私有] 公共 JS 工具
│   └── packages/common/docs     @tdesign/common-docs          [私有] 公共文档
├── packages/tdesign-react       tdesign-react@1.16.6          [发布] 基础组件 npm 包
├── packages/tdesign-react-aigc  @tdesign-react/chat@1.0.2     [发布] AIGC 组件 npm 包
└── test                         —                              [私有] 测试工具与快照
```

### 子包依赖关系

```
                    ┌─────────────────────────────┐
                    │     packages/common          │  ← git submodule (tdesign-common)
                    │  (样式 + JS 公共工具)          │
                    └──────────┬──────────────────┘
                               │ 被引用
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                   ▼
┌───────────────────┐ ┌────────────────┐ ┌─────────────────────────┐
│ packages/components│ │ pro-components │ │ tdesign-web-components  │
│  (基础 UI 组件)     │ │  /chat         │ │ (外部 npm 依赖,          │
│                    │ │ (Chat 组件)     │ │  ChatEngine 核心引擎)    │
└────────┬───────────┘ └───────┬────────┘ └───────────┬─────────────┘
         │                     │                      │
         │                     │ 依赖 ──────────────→ │
         │                     │
         ▼                     ▼
┌───────────────────┐ ┌──────────────────────┐
│ tdesign-react      │ │ tdesign-react-aigc   │
│ (npm 发布包)        │ │ (npm 发布包)          │
└───────────────────┘ └──────────────────────┘
```

> **注意**：`packages/components` 和 `packages/pro-components` 之间是**单向依赖**——pro-components 可以依赖 components，反之不可。

## 2. 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **UI 框架** | React | ≥16.13.1（支持到 React 19） |
| **语言** | TypeScript | 5.6.2 |
| **样式** | Less + CSS Variables | Less 4.4.2 |
| **包管理** | pnpm workspace | pnpm 9.15.9 |
| **库构建** | Rollup | 2.74.1 |
| **站点构建** | Vite | 最新 |
| **测试** | Vitest + @testing-library/react | Vitest ^2.1.1, RTL ^16.2.0 |
| **代码检查** | ESLint + Prettier + TypeScript | — |
| **图标** | tdesign-icons-react | ^0.6.2 |
| **日期处理** | dayjs | 1.11.10 |
| **工具函数** | lodash-es | ^4.17.21 |
| **定位** | @popperjs/core | ~2.11.2 |

## 3. 构建产物

### 3.1 基础组件 (`tdesign-react`)

使用 `pnpm build` 构建，产出 5 种格式到 `packages/tdesign-react/` 下：

| 目录 | 格式 | 用途 |
|------|------|------|
| `es/` | ES Modules + CSS | 现代构建工具按需引入，支持 tree-shaking |
| `esm/` | ES Modules + Less | 需要自定义主题的场景 |
| `lib/` | ES Modules 无样式 | 搭配全量 CSS 使用 |
| `cjs/` | CommonJS | Node.js 环境或 SSR |
| `dist/` | UMD | CDN / `<script>` 直引 |

详见 `.codebuddy/specs/build-output-spec.md`

### 3.2 AIGC 组件 (`@tdesign-react/chat`)

使用 `pnpm build:aigc` 构建，产出到 `packages/tdesign-react-aigc/`：

| 目录 | 格式 |
|------|------|
| `es/` | ES Modules |

## 4. 站点开发

| 站点 | 命令 | 配置 | 端口 |
|------|------|------|------|
| 基础组件官网 | `pnpm dev` | `packages/tdesign-react/site/vite.config.js` | 默认端口 |
| AIGC 组件官网 | `pnpm dev:aigc` | `packages/tdesign-react-aigc/site/vite.config.js` | 默认端口 |

站点路由配置：`packages/tdesign-react/site/site.config.mjs`

## 5. 关键配置文件

| 文件 | 说明 |
|------|------|
| `pnpm-workspace.yaml` | Workspace 包声明 (`packages/**`, `internal/**`, `test`) |
| `tsconfig.json` | TypeScript 主配置 |
| `tsconfig.build.json` | 基础组件构建用 TS 配置 |
| `tsconfig.aigc.build.json` | AIGC 组件构建用 TS 配置 |
| `tsconfig.dev.json` | 开发/lint 用 TS 配置 |
| `vitest.config.mts` | 测试配置（含路径别名） |
| `script/rollup.config.js` | 基础组件 Rollup 构建 |
| `script/rollup.aigc.config.js` | AIGC 组件 Rollup 构建 |
| `.gitmodules` | Git 子模块配置（packages/common） |
| `commitlint.config.js` | Commit 规范配置 |

## 6. 组件文档与示例映射机制

每个组件都有配套的 **Markdown 文档** 和 **`_example/` 示例目录**，二者通过 `{{ xxx }}` 占位符建立一对一映射关系。

### 6.1 映射规则

```
组件 Markdown 中:   {{ basic }}
                        ↓ 站点构建时自动解析
对应文件:           _example/basic.tsx  （导出 React 组件，作为可交互 Demo 渲染到文档中）
```

**核心规律**：Markdown 中每个 `{{ xxx }}` 占位符对应同目录下 `_example/xxx.tsx` 文件中默认导出的 React 组件。

### 6.2 基础组件文档结构（双层拼接）

基础组件的文档由 **两层 Markdown 文件拼接** 而成：

| 层级 | 文件位置 | 内容 |
|------|----------|------|
| **文档主体（跨框架通用）** | `packages/common/docs/web/api/<component>.md` | 包含组件的**使用说明文本** + `{{ xxx }}` 示例占位符（这才是文档的核心内容） |
| **框架入口（React 特有）** | `packages/components/<component>/<component>.md` | 以 `:: BASE_DOC ::` 开头引入上层文档主体，后接框架特有的 API 表格 |

> ⚠️ **关键**：当基础组件的 `<component>.md` 以 `:: BASE_DOC ::` 开头时，说明文档主体（使用说明、示例占位符）**不在这个文件中**，而是在 `packages/common/docs/web/api/<component>.md` 里。AI 要了解组件用法，**应直接读取 `common/docs/web/api/` 下的对应文件**。

**拼接流程**：
```
packages/components/button/button.md        ← React 框架入口
  │
  ├─ :: BASE_DOC ::  ──→ 引入 packages/common/docs/web/api/button.md（文档主体）
  │     ├─ {{ base }}      ──→ _example/base.tsx
  │     ├─ {{ icon }}      ──→ _example/icon.tsx
  │     ├─ {{ ghost }}     ──→ _example/ghost.tsx
  │     └─ ...（使用说明和示例都在 common 中）
  │
  └─ ## API（React 特有的 API 表格，可能包含额外 {{ xxx }} 占位符）
       └─ {{ plugin }}    ──→ _example/plugin.tsx
```

**示例（Button 组件）**：
- `packages/common/docs/web/api/button.md` 包含 10 个占位符
- `packages/components/button/_example/` 包含 9 个 `.tsx` 文件
- 每个 `{{ xxx }}` 都有对应的 `_example/xxx.tsx`

### 6.3 Pro 组件文档结构（直接编写）

Pro 组件（Chat 系列）**不使用 `:: BASE_DOC ::` 机制**，文档内容直接写在组件自身的 Markdown 文件中：

```
packages/pro-components/chat/chat-engine/chat-engine.md
  ├─ {{ basic }}           ──→ _example/basic.tsx
  ├─ {{ initial-messages }}──→ _example/initial-messages.tsx
  ├─ {{ agui-basic }}      ──→ _example/agui-basic.tsx
  └─ ...
```

### 6.4 AI 如何快速索引组件

> 🤖 **AI 索引路径**：
>
> **基础组件**（`packages/components/` 下）：
> 1. **先读取** `packages/common/docs/web/api/<component>.md` —— 这里是文档主体，包含使用说明和 `{{ xxx }}` 示例占位符
> 2. 通过 `{{ xxx }}` 定位 `packages/components/<component>/_example/xxx.tsx` —— 获取可运行示例代码
> 3. 再读取 `packages/components/<component>/<component>.md` 的 `:: BASE_DOC ::` 之后的内容 —— 获取 React 特有 API 表格
>
> **Pro 组件**（`packages/pro-components/` 下）：
> 1. 直接读取 `<component>/<component>.md` —— 全部文档内容都在这里
> 2. 通过 `{{ xxx }}` 定位 `_example/xxx.tsx` —— 获取可运行示例代码

### 6.5 站点配置引用

站点通过动态 `import()` 引入 Markdown 文件，构建工具自动解析 `:: BASE_DOC ::` 和 `{{ xxx }}`：

```javascript
// packages/tdesign-react/site/site.config.mjs
{
  title: 'Button 按钮',
  name: 'button',
  component: () => import('@tdesign/components/button/button.md'),
}
```

## 7. React 19 兼容

项目通过 `_util/react-19-adapter.ts` 提供 React 19 兼容层：

- 该文件在 `sideEffects` 中声明，防止被 tree-shaking
- 路径：`packages/components/_util/react-19-adapter.ts`
- 作用：适配 React 19 中 `forwardRef`、`defaultProps` 等行为变更
