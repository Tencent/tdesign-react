# ChatEngine 示例说明

本目录包含 ChatEngine 对话引擎的所有示例代码，按照从简单到复杂的顺序组织，方便用户循序渐进地学习。

## 📚 示例索引

### 快速开始（1个）

| 示例文件 | 示例名称 | 学习目标 | 代码量 |
|---------|---------|---------|--------|
| `basic.tsx` | 快速开始 | useChat Hook 基本用法 | ~78行 |

### 基础用法（3个）

| 示例文件 | 示例名称 | 学习目标 | 代码量 |
|---------|---------|---------|--------|
| `messages.tsx` | 消息管理 | 初始化、更新、历史回填 | ~141行 |
| `custom-ui.tsx` | 自定义 UI | 自定义样式、操作按钮 | ~156行 |
| `lifecycle.tsx` | 生命周期 | 状态监听、事件回调 | ~162行 |

### AG-UI 协议（3个）

| 示例文件 | 示例名称 | 学习目标 | 代码量 |
|---------|---------|---------|--------|
| `agui-basic.tsx` | AG-UI 基础 | 开启协议支持、文本消息 | ~92行 |
| `agui-toolcall.tsx` | 工具调用 | useAgentToolcall、状态管理 | ~645行 |
| `agui-comprehensive.tsx` | 综合示例 | 完整的多步骤任务规划 | ~400行+ |

### 其他示例

| 示例文件 | 示例名称 | 说明 |
|---------|---------|------|
| `hookComponent.tsx` | 旧版综合示例 | 已被拆分为多个示例 |
| `agui.tsx` | 旧版 AG-UI 示例 | 已重构为 agui-basic.tsx |

## 🎯 学习路径

### 第一步：快速开始
1. `basic.tsx` - 了解 useChat Hook 的基本用法

### 第二步：基础用法
2. `messages.tsx` - 学习消息管理
3. `custom-ui.tsx` - 掌握 UI 定制
4. `lifecycle.tsx` - 理解生命周期

### 第三步：AG-UI 协议
5. `agui-basic.tsx` - 了解 AG-UI 协议基础
6. `agui-toolcall.tsx` - 学习工具调用和状态管理
7. `agui-comprehensive.tsx` - 查看完整的实战案例

## 📖 示例特点

### ✅ 循序渐进
- 从最简单的 78 行代码开始
- 逐步增加复杂度
- 每个示例聚焦单一功能点

### ✅ 功能聚焦
- 每个示例只展示一个核心功能
- 避免功能混杂
- 易于理解和查找

### ✅ 代码简洁
- 基础示例控制在 78-162 行
- 添加详细注释
- 突出关键代码

### ✅ 实用性强
- 基于真实使用场景
- 提供完整可运行代码
- 包含调试技巧

## 🔍 快速查找

### 我想实现...

**基础功能**
- **最简单的对话界面** → `basic.tsx`
- **初始化消息** → `messages.tsx`
- **加载历史消息** → `messages.tsx`
- **自定义消息样式** → `custom-ui.tsx`
- **添加操作按钮** → `custom-ui.tsx`
- **监听状态变化** → `lifecycle.tsx`
- **处理生命周期事件** → `lifecycle.tsx`

**AG-UI 协议**
- **开启 AG-UI 协议** → `agui-basic.tsx`
- **工具调用** → `agui-toolcall.tsx`
- **状态管理** → `agui-toolcall.tsx`
- **多步骤任务规划** → `agui-comprehensive.tsx`
- **人机协作** → `agui-comprehensive.tsx`

## 💡 ChatEngine vs Chatbot

### ChatEngine 适用场景
- ✅ 需要完全自定义 UI 结构
- ✅ 需要精细控制消息处理流程
- ✅ 需要集成 AG-UI 协议的高级特性
- ✅ 需要构建复杂的智能体应用

### Chatbot 适用场景
- ✅ 快速搭建标准对话界面
- ✅ 使用内置的 UI 和交互逻辑
- ✅ 不需要深度定制

## 📝 旧示例说明

以下示例已被重新组织：

- `hookComponent.tsx` → 已拆分为 `basic.tsx`、`messages.tsx`、`custom-ui.tsx` 等
- `agui.tsx` → 已重构为 `agui-basic.tsx`
- `videoclipState.tsx` → 重命名为 `agui-toolcall.tsx`
- `travelToolcall.tsx` → 重命名为 `agui-comprehensive.tsx`

建议使用新的示例文件进行学习。
