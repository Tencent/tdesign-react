# AGENTS.md — TDesign React Monorepo

> **AI Agent 入口指南**
> 本文件是 tdesign-react monorepo 的顶层 AI Agent 指引。在生成、修改或审查本仓库代码前，请先阅读本文件了解全局上下文。

## 1. 项目概览

| 项目 | 说明 |
|------|------|
| **名称** | TDesign React |
| **定位** | 腾讯 TDesign 设计体系的 React 实现，包含基础组件库 + AI/AIGC Pro 组件 |
| **仓库结构** | pnpm workspace monorepo |
| **包管理器** | pnpm@9.15.9 |
| **主要语言** | TypeScript + React (支持 React 16.13.1 ~ 19) |
| **样式方案** | Less + CSS Variables + BEM 命名 |
| **构建工具** | Rollup（库构建）+ Vite（站点开发）|
| **测试框架** | Vitest + @testing-library/react |

## 2. 双产品线

本仓库同时维护两个独立产品：

### 2.1 TDesign React（基础组件库）

- **npm 包名**: `tdesign-react`
- **官网**: tdesign.tencent.com/react
- **源码**: `packages/components/`（72 个基础 UI 组件）
- **发布包**: `packages/tdesign-react/`
- **站点**: `packages/tdesign-react/site/`
- **开发命令**: `pnpm dev`

### 2.2 TDesign React AIGC（AI 组件库）

- **npm 包名**: `@tdesign-react/chat`
- **官网**: tdesign.tencent.com/react-chat
- **源码**: `packages/pro-components/chat/`（10 个 Chat 组件 + ChatEngine 引擎）
- **发布包**: `packages/tdesign-react-aigc/`
- **站点**: `packages/tdesign-react-aigc/site/`
- **开发命令**: `pnpm dev:aigc`
- **详细指南**: `packages/pro-components/chat/chat-engine/AGENTS.md`

## 3. 仓库目录结构

```
tdesign-react/
├── packages/
│   ├── components/              # 🔵 基础组件源码（72 个组件）
│   │   ├── button/              #    每个组件独立目录
│   │   ├── hooks/               #    35 个公共 hooks
│   │   ├── _util/               #    16 个工具函数
│   │   ├── common.ts            #    公共类型（TNode, StyledProps 等）
│   │   └── index.ts             #    统一导出
│   ├── pro-components/          # 🟠 Pro 组件源码
│   │   └── chat/                #    AIGC Chat 组件套件
│   │       ├── chatbot/         #    ChatBot 高阶组件
│   │       ├── chat-engine/     #    ChatEngine 对话引擎核心
│   │       ├── chat-message/    #    消息组件
│   │       ├── chat-sender/     #    发送组件
│   │       └── ...              #    更多子组件
│   ├── common/                  # 🟢 公共子仓库（git submodule）
│   │   ├── style/web/           #    跨框架共享的 Less 样式
│   │   │   ├── components/      #    73 个组件样式
│   │   │   └── _variables/      #    Design Token
│   │   └── js/                  #    跨框架共享的 JS 工具
│   ├── tdesign-react/           # 📦 基础组件发布包
│   │   ├── site/                #    官网站点
│   │   └── package.json         #    npm 发布配置
│   └── tdesign-react-aigc/      # 📦 AIGC 组件发布包
│       ├── site/                #    AIGC 官网站点
│       └── package.json         #    npm 发布配置
├── script/                      # 构建脚本
│   ├── rollup.config.js         #    基础组件构建
│   └── rollup.aigc.config.js    #    AIGC 组件构建
├── test/                        # 测试配置和快照
├── vitest.config.mts            # Vitest 配置
├── tsconfig.json                # TypeScript 主配置
├── .codebuddy/                  # AI Coding 规范和技能
│   ├── specs/                   #    开发规范文档
│   └── skills/                  #    AI 开发技能
└── pnpm-workspace.yaml          # Workspace 配置
```

## 4. 核心开发约定

### 4.1 组件开发模式（基础组件）

```typescript
// 标准组件结构
import { forwardRef } from 'react';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { componentDefaultProps } from './defaultProps';
import type { ComponentProps } from './type';

const Component = forwardRef<HTMLDivElement, ComponentProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, componentDefaultProps);
  const { classPrefix } = useConfig();
  // ...
});

Component.displayName = 'Component';
export default Component;
```

### 4.2 关键约定

- **禁止手动修改** `type.ts` 和 `defaultProps.ts`（自动生成文件）
- **禁止硬编码** CSS 前缀 `t-`，必须使用 `useConfig().classPrefix`
- **lodash 导入** 使用 `lodash-es` 或 `lodash/xxx` 按需导入
- **受控模式** 使用 `useControlled` hook
- **TNode 渲染** 使用 `parseTNode` 工具函数
- **样式** 在 `packages/common/style/web/components/` 中维护（git submodule）

### 4.3 组件文档与示例映射

每个组件的 API 文档和用法示例通过 `{{ xxx }}` 占位符与 `_example/xxx.tsx` 一一映射：

```
组件 Markdown 中:   {{ basic }}
                        ↓ 站点构建时自动解析
对应文件:           _example/basic.tsx  → 默认导出的 React 组件渲染为可交互 Demo
```

**两种文档模式**：
- **基础组件**：组件的 `<component>.md` 以 `:: BASE_DOC ::` 开头，文档主体（使用说明 + `{{ xxx }}` 示例占位符）实际存放在 **`packages/common/docs/web/api/<component>.md`**，构建时自动拼接。组件自身的 `.md` 只追加 React 框架特有的 API 文档
- **Pro 组件**：直接在自身 `<component>.md` 中编写全部内容（不使用 `:: BASE_DOC ::`）

**AI 快速索引组件用法**：
1. **基础组件**：读取 `packages/common/docs/web/api/<component>.md` → 获取使用说明和 `{{ xxx }}` 示例索引；再读取 `packages/components/<component>/<component>.md` → 获取 React 特有 API
2. **Pro 组件**：直接读取 `packages/pro-components/chat/<component>/<component>.md` → 获取全部文档
3. 根据 `{{ xxx }}` 占位符找到 `_example/xxx.tsx` → 获取可运行的示例代码

详见 `.codebuddy/specs/project-architecture-spec.md` 第 6 节。

### 4.4 AIGC 组件开发

AIGC/Chat 组件有独立的开发规范，详见：
- **Agent 指南**: `packages/pro-components/chat/chat-engine/AGENTS.md`
- **架构文档**: `packages/pro-components/chat/chat-engine/docs/ARCHITECTURE.md`
- **组件文档**: `packages/pro-components/chat/chat-engine/chat-engine.md`

## 5. 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装依赖 |
| `pnpm run init` | 初始化 git submodule |
| `pnpm dev` | 启动基础组件站点开发 |
| `pnpm dev:aigc` | 启动 AIGC 组件站点开发 |
| `pnpm build` | 构建基础组件（输出 es/esm/lib/cjs/dist） |
| `pnpm build:aigc` | 构建 AIGC 组件 |
| `pnpm test` | 运行所有测试 |
| `pnpm lint` | 代码检查 |

## 6. AI Coding 资源索引

### Specs（开发规范）

| 文件 | 说明 |
|------|------|
| `.codebuddy/specs/api-design-spec.md` | API 设计规范（TNode、事件、受控模式） |
| `.codebuddy/specs/css-naming-spec.md` | CSS 命名规范（BEM、状态类、Design Token） |
| `.codebuddy/specs/build-output-spec.md` | 构建产物规范（6 种产物格式） |
| `.codebuddy/specs/common-errors.md` | 常见错误与反模式参考 |
| `.codebuddy/specs/project-architecture-spec.md` | 项目架构全景图 |
| `.codebuddy/specs/monorepo-workflow-spec.md` | Monorepo 工作流规范 |
| `.codebuddy/specs/hooks-catalog-spec.md` | 公共 Hooks 目录与用法 |

### Skills（AI 技能）

| 技能 | 说明 |
|------|------|
| `tdesign-create-component` | 创建新组件的完整 SOP |
| `tdesign-component-style` | 组件样式开发指南 |
| `tdesign-test-component` | 组件测试编写指南 |
| `tdesign-release` | 版本发布流程 SOP |
| `tdesign-pro-component` | AIGC/Chat 组件开发指南 |

### ChatEngine 专属文档

| 文件 | 说明 |
|------|------|
| `packages/pro-components/chat/chat-engine/AGENTS.md` | ChatEngine Agent 指南 |
| `packages/pro-components/chat/chat-engine/docs/ARCHITECTURE.md` | 架构设计文档 |
| `packages/pro-components/chat/chat-engine/chat-engine.md` | 组件使用文档 |

## 7. Anti-Patterns（全局禁忌）

- ❌ 不要直接修改 `packages/common/` 中的文件后忘记在子仓库内提交
- ❌ 不要在组件中使用 `import { xxx } from 'lodash'`（应按需导入）
- ❌ 不要跳过 `useDefaultProps`，直接在参数解构中写默认值
- ❌ 不要在基础组件中引入 pro-components 的依赖（单向依赖）
- ❌ 不要在 React 组件中硬编码 CSS 类名前缀 `t-`
