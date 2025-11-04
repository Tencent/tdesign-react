# Chatbot 示例说明

本目录包含 Chatbot 组件的所有示例代码，按照从简单到复杂的顺序组织，方便用户循序渐进地学习。

## 📚 示例索引

### 快速开始（1个）

| 示例文件 | 示例名称 | 学习目标 | 代码量 |
|---------|---------|---------|--------|
| `quick-start.tsx` | 快速开始 | 最小配置，5分钟上手 | ~30行 |

### 基础用法（5个）

| 示例文件 | 示例名称 | 学习目标 | 代码量 |
|---------|---------|---------|--------|
| `initial-messages.tsx` | 初始化消息 | 设置欢迎语和历史消息回填 | ~120行 |
| `role-message-config.tsx` | 角色消息配置 | 消息样式、操作按钮、内容展示 | ~210行 |
| `sender-config.tsx` | 输入配置 | 输入框配置、附件上传 | ~160行 |
| `service-config.tsx` | 请求配置 | 请求配置、数据转换、生命周期 | ~141行 |
| `instance-methods.tsx` | 实例方法 | 通过 ref 控制组件 | ~152行 |
| `comprehensive.tsx` | 综合示例 | 多功能组合使用 | ~227行 |

### 高级定制（3个）

| 示例文件 | 示例名称 | 学习目标 | 代码量 |
|---------|---------|---------|--------|
| `custom-content.tsx` | 自定义内容渲染 | 扩展自定义类型 | ~141行 |
| `custom-actions.tsx` | 自定义操作栏 | 自定义操作按钮 | ~126行 |
| `custom-merge.tsx` | 自定义合并策略 | 注册合并策略 | ~115行 |

### 场景示例（4个）

| 示例文件 | 示例名称 | 学习目标 | 代码量 |
|---------|---------|---------|--------|
| `code.tsx` | 代码助手 | 代码高亮和预览 | ~120行 |
| `docs.tsx` | 文档助手 | 附件上传和渲染 | ~100行 |
| `image.tsx` | 图像生成 | 自定义输入框 | ~120行 |
| `agent.tsx` | 任务规划 | 复杂自定义渲染 | ~150行 |

## 🎯 学习路径

### 第一步：快速开始
1. `quick-start.tsx` - 了解最基本的配置，5分钟上手

### 第二步：基础用法
2. `initial-messages.tsx` - 学习如何设置初始消息和历史消息回填
3. `role-message-config.tsx` - 掌握角色消息配置（样式、操作、内容展示）
4. `sender-config.tsx` - 学习输入框配置（附件上传）
5. `service-config.tsx` - 掌握请求配置（请求配置、数据转换、生命周期）
6. `instance-methods.tsx` - 学习实例方法
7. `comprehensive.tsx` - 查看完整的综合示例

### 第三步：高级定制
8. `custom-content.tsx` - 实现自定义内容类型
9. `custom-actions.tsx` - 自定义操作栏
10. `custom-merge.tsx` - 自定义合并策略

### 第四步：实战场景
11. `code.tsx` - 代码助手场景
12. `docs.tsx` - 文档助手场景
13. `image.tsx` - 图像生成场景
14. `agent.tsx` - 任务规划场景

## 📖 示例特点

### ✅ 循序渐进
- 从最简单的 30 行代码开始
- 逐步增加复杂度
- 每个示例聚焦单一功能点
- 综合示例展示完整用法

### ✅ 功能聚焦
- 每个示例只展示一个核心功能
- 避免功能混杂
- 易于理解和查找

### ✅ 代码简洁
- 代码量控制在 30-227 行
- 添加详细注释
- 突出关键代码

### ✅ 实用性强
- 基于真实使用场景
- 提供完整可运行代码
- 包含调试技巧

## 🔍 快速查找

### 我想实现...

- **最简单的对话界面** → `quick-start.tsx`
- **设置欢迎语和历史消息** → `initial-messages.tsx`
- **配置消息样式和操作按钮** → `role-message-config.tsx`
- **配置输入框和附件上传** → `sender-config.tsx`
- **配置请求和数据转换** → `service-config.tsx`
- **外部控制组件** → `instance-methods.tsx`
- **完整功能组合** → `comprehensive.tsx`
- **自定义内容类型** → `custom-content.tsx`
- **自定义操作栏** → `custom-actions.tsx`
- **特殊合并逻辑** → `custom-merge.tsx`
- **代码助手** → `code.tsx`
- **文档助手** → `docs.tsx`
- **图像生成** → `image.tsx`
- **任务规划** → `agent.tsx`

## 📝 示例说明

### 综合示例 vs 单功能示例

- **单功能示例**：聚焦单一功能点，适合学习特定功能
- **综合示例** (`comprehensive.tsx`)：展示多个功能的组合使用，适合作为项目参考

### 旧示例说明

以下示例已被重新组织：

- `basic.tsx` → 重命名为 `comprehensive.tsx`（综合示例）
- `message-actions.tsx` + `message-config.tsx` + `content-types.tsx` → 整合为 `role-message-config.tsx`
- `data-transform.tsx` + `request-config.tsx` → 整合为 `service-config.tsx`
- `custom.tsx` → 已拆分为 `custom-content.tsx`、`custom-actions.tsx` 等
- `simple.tsx` → 已重命名为 `quick-start.tsx`

建议使用新的示例文件进行学习。
