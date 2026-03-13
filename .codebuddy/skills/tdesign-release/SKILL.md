---
name: tdesign-release
description: This skill should be used when preparing or executing a version release for TDesign React. It provides the complete release workflow SOP including branch management, CHANGELOG generation, build verification, and npm publishing.
---

# TDesign 版本发布指南

本技能提供 TDesign React 版本发布的完整 SOP 流程。

## 触发条件

当用户需要执行以下任务时使用此技能：
- 发布新版本
- 准备版本发布
- 验证构建产物
- 紧急修复发布

## 发布频率

- **正常发布**：每两周滚动发布，一般在周三/周四
- **避免时间**：周五或晚上（防止周末响应不及时）
- **紧急发布**：根据影响范围决定发布方式

## 发布类型决策

| 情况 | 发布类型 | 说明 |
|------|---------|------|
| 影响范围大的 bug | PATCH 版本 | 严格测试后发布，用户可自动更新 |
| 新功能少量用户使用 | 先行版本 | 如 `x.y.z-alpha`，快速发布 |
| 正常迭代 | MINOR 版本 | 完整流程发布 |
| 重大变更 | MAJOR 版本 | 需要详细的迁移文档 |

## SOP 流程

### Step 1: 创建 Release 分支

从 `develop` 分支创建 release 分支：

```bash
git checkout develop
git pull origin develop
git checkout -b release/x.y.z
```

### Step 2: 更新版本号

修改 `package.json` 中的版本号：

```json
{
  "version": "x.y.z"
}
```

对于 monorepo 中的子包，也需要同步更新：
- `packages/tdesign-react/package.json`
- `packages/components/package.json`（如有）
- `packages/pro-components/package.json`（如有）

### Step 3: 推送分支并创建 PR

```bash
git add .
git commit -m "chore: release x.y.z"
git push origin release/x.y.z
```

创建 Pull Request 到 `develop` 分支。

### Step 4: 处理 CHANGELOG

1. GitHub Action 会自动整理 commit 生成 CHANGELOG draft
2. CHANGELOG 作为评论推送到 PR
3. 检查并优化 CHANGELOG 内容：
   - 确保功能描述准确
   - 分类正确（feat/fix/style/refactor）
   - 删除无关的内部改动
4. 删除评论首行提示（`删除此行代表确认该日志`）
5. 等待 GitHub Action 将内容写入 `CHANGELOG.md`

### Step 5: 构建产物验证

在合并前验证构建产物：

```bash
# 安装依赖
pnpm install

# 构建所有产物（在 packages/tdesign-react 子包中执行）
pnpm -C packages/tdesign-react build

# 检查产物目录
ls -la packages/tdesign-react/dist/ packages/tdesign-react/es/ packages/tdesign-react/esm/ packages/tdesign-react/lib/ packages/tdesign-react/cjs/
```

#### 产物验证清单

参考 `.codebuddy/specs/build-output-spec.md`：

- [ ] **dist/** 包含 7 个文件：
  - `tdesign.js`
  - `tdesign.js.map`
  - `tdesign.min.js`
  - `tdesign.min.js.map`
  - `tdesign.css`
  - `tdesign.css.map`
  - `tdesign.min.css`

- [ ] **es/** 目录：
  - 每个组件有独立目录
  - 包含 `style/` 子目录
  - 包含 `.d.ts` 类型声明

- [ ] **esm/** 目录：
  - 结构同 `es/`
  - `style/index.js` 引用 Less 源文件

- [ ] **lib/** 目录：
  - 不包含样式文件
  - 包含 `.d.ts` 类型声明

- [ ] **cjs/** 目录：
  - CommonJS 格式
  - 包含 `.d.ts` 类型声明

- [ ] **package.json** 入口字段：
  ```json
  {
    "main": "lib/index.js",
    "module": "es/index.js",
    "typings": "es/index.d.ts"
  }
  ```

### Step 6: 合并 Release 分支

确认以下检查通过后合并 PR：

- [ ] CHANGELOG 内容已确认
- [ ] 构建产物验证通过
- [ ] CI 检查全部通过
- [ ] 代码审查通过

合并到 `develop` 分支。

### Step 7: 自动发布流程

合并后，GitHub Action 自动执行：

1. 合并 `develop` 到 `main` 分支
2. 创建版本 tag（`vx.y.z`）
3. 触发 npm publish 流程
4. 触发官网部署流水线

### Step 8: 验证发布结果

```bash
# 检查 npm 发布状态
npm view tdesign-react version

# 检查 CDN 可用性
curl https://unpkg.com/tdesign-react@x.y.z/dist/tdesign.min.js -I
```

## 先行版本发布

对于 alpha/beta 版本：

```bash
# 创建先行版本分支
git checkout -b release/x.y.z-alpha.1

# 修改版本号
# package.json: "version": "x.y.z-alpha.1"

# 发布先行版本（可跳过完整 CHANGELOG）
npm publish --tag alpha
```

## 紧急修复流程

### Hotfix 流程

```bash
# 从 main 创建 hotfix 分支
git checkout main
git checkout -b hotfix/x.y.z

# 修复问题
# ...

# 合并到 main 和 develop
git checkout main
git merge hotfix/x.y.z

git checkout develop
git merge hotfix/x.y.z

# 创建 tag 并发布
git tag vx.y.z
git push origin vx.y.z
```

## AIGC 包发布

`@tdesign-react/chat` 等 AIGC 包有独立发布流程：

```bash
cd packages/pro-components

# 更新版本号
# package.json: "version": "x.y.z"

# 构建
pnpm build

# 发布
npm publish
```

## 常见问题

### Q: CHANGELOG 未自动生成？

A: 检查 GitHub Action 是否正常运行。可以手动整理 CHANGELOG。

### Q: npm publish 失败？

A: 检查：
- npm 登录状态
- 版本号是否已存在
- package.json 配置是否正确

### Q: 构建产物缺失？

A: 运行完整构建命令，检查 rollup 配置和 tsconfig。

## 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR** (x.0.0)：不兼容的 API 变更
- **MINOR** (0.x.0)：向后兼容的功能新增
- **PATCH** (0.0.x)：向后兼容的问题修复

## 参考资源

- 发布流程文档: `PUBLISH.md`
- 构建产物规范: `.codebuddy/specs/build-output-spec.md`
- Git 工作流: `CONTRIBUTING.md`
