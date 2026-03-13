# TDesign Monorepo 工作流规范 (Monorepo Workflow Spec)

> 本规范定义 tdesign-react pnpm workspace monorepo 的日常开发、构建、测试工作流。

## 1. Workspace 配置

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/**'
  - 'internal/**'
  - 'test'
```

所有 `packages/` 子目录自动作为 workspace 包。内部包之间使用 `workspace:^` 协议引用。

### 包管理器

```bash
# 项目锁定 pnpm 版本
packageManager: pnpm@9.15.9

# 安装依赖（首次 clone 或更新后）
pnpm install

# 初始化子仓库
pnpm run init    # = git submodule init && git submodule update
```

## 2. packages/common（Git Submodule）

### 特殊性

`packages/common` 是一个 **git submodule**，指向独立仓库 `Tencent/tdesign-common`。

```ini
# .gitmodules
[submodule "packages/common"]
    path = packages/common
    url = https://github.com/Tencent/tdesign-common.git
```

### ⚠️ 关键注意事项

1. **修改 common 中的文件**需要在子仓库内单独提交：
   ```bash
   cd packages/common
   git add .
   git commit -m "fix: 修改样式"
   git push origin develop
   cd ../..
   git add packages/common
   git commit -m "chore: update common submodule"
   ```

2. **更新 common 到最新**：
   ```bash
   git submodule update --init --remote
   # 或
   pnpm run init
   ```

3. **跨框架共享**：common 中的样式和 JS 工具被 React/Vue/小程序等多个框架实现共用，修改需谨慎评估影响。

### common 内部结构

```
packages/common/
├── style/web/
│   ├── components/              # 73 个组件的 Less 样式
│   │   ├── button/index.less
│   │   ├── input/index.less
│   │   └── ...
│   ├── _variables/              # Design Token 变量
│   │   ├── global.less          # 全局变量
│   │   └── component/           # 组件级变量
│   └── index.less               # 全量样式入口
├── js/                          # 跨框架公共 JS 工具
│   ├── tree/                    # Tree 数据结构
│   ├── upload/                  # Upload 工具
│   └── ...
└── docs/                        # 公共文档
    ├── api.md                   # API 设计规范源文档
    ├── css-naming.md            # CSS 命名规范源文档
    └── develop-install.md       # 构建安装规范源文档
```

## 3. 日常开发流程

### 3.1 基础组件开发

```bash
# 1. 启动站点开发服务
pnpm dev

# 2. 在 packages/components/<component>/ 下开发
#    修改会自动热更新到站点

# 3. 样式修改（如需）
#    编辑 packages/common/style/web/components/<component>/index.less

# 4. 运行测试
pnpm test
```

### 3.2 AIGC 组件开发

```bash
# 1. 启动 AIGC 站点开发服务
pnpm dev:aigc

# 2. 在 packages/pro-components/chat/ 下开发

# 3. 构建 AIGC 包
pnpm build:aigc
```

### 3.3 新建组件

```bash
# 使用脚本初始化组件结构
pnpm run init:component

# 或手动创建，参考 .codebuddy/skills/tdesign-create-component/
```

## 4. 构建流程

### 4.1 基础组件构建

```bash
# 完整构建（清理 → Rollup 打包 → TypeScript 声明）
pnpm build

# 等同于执行：
#   1. rimraf packages/tdesign-react/{es,lib,dist,esm,cjs}/*
#   2. rollup -c script/rollup.config.js
#   3. node script/utils/bundle-override.js
#   4. tsc --outDir packages/tdesign-react/{es,esm,cjs,lib}/  (4 个并行)
```

**产物目录**：`packages/tdesign-react/{es,esm,lib,cjs,dist}/`

### 4.2 AIGC 组件构建

```bash
pnpm build:aigc

# 等同于：
#   1. rollup -c script/rollup.aigc.config.js
#   2. tsc -p tsconfig.aigc.build.json --outDir packages/tdesign-react-aigc/es/
```

**产物目录**：`packages/tdesign-react-aigc/es/`

### 4.3 站点构建

```bash
# 基础组件官网
pnpm site

# AIGC 组件官网
pnpm site:aigc
```

## 5. 测试流程

### 5.1 命令

```bash
# 运行所有测试（单元测试 + 快照）
pnpm test

# 仅单元测试
vitest run

# 仅快照测试
pnpm test:snap    # = cross-env NODE_ENV=test-snap vitest run

# 更新快照
pnpm test:update

# 交互式 UI
pnpm test:ui

# 覆盖率
pnpm test:coverage
```

### 5.2 测试文件位置

| 类型 | 位置 | 命名 |
|------|------|------|
| 单元测试 | `packages/components/<component>/__tests__/` | `vitest-*.test.tsx` |
| CSR 快照 | `test/snap/csr.test.jsx` | — |
| SSR 快照 | `test/snap/ssr.test.jsx` | — |
| 测试工具 | `test/utils/` | — |

### 5.3 路径别名

Vitest 配置了以下别名：

| 别名 | 实际路径 |
|------|---------|
| `tdesign-react` | `./packages/components` |
| `tdesign-react/*` | `./packages/components/*` |
| `@test/utils` | `./test/utils` |
| `@common/js/*` | `./packages/common/js/*` |

## 6. 代码规范

### Commit 规范

使用 Conventional Commits：

```
<type>(<scope>): <subject>

# 示例
feat(button): 新增 loading 状态
fix(input): 修复输入框聚焦问题
chore: 更新依赖版本
docs(table): 补充 API 文档
style(dialog): 调整对话框圆角
```

### Lint

```bash
# 完整检查
pnpm lint      # TypeScript 类型检查 + ESLint

# 自动修复
pnpm lint:fix  # ESLint 自动修复
```

## 7. 发布流程

详见 `.codebuddy/skills/tdesign-release/SKILL.md`

- **基础组件**：`tdesign-react` → 从 `develop` 分支创建 release 分支 → CI 自动发布
- **AIGC 组件**：`@tdesign-react/chat` → 独立发布流程
