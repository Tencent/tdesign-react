# 智能体动作系统 (Agent Action System)

## 核心理念

基于现有的 `ToolCallContent` 系统扩展的智能体动作架构。通过分析发现，现有的 `ToolCallContent` 已经具备了智能体动作的核心特征，我们无需创建全新的类型，而是直接扩展现有的 ToolCall 系统。

## 架构优势

1. **零破坏性变更**: 完全兼容现有的 ToolCall 系统
2. **渐进式迁移**: 可以逐步将现有组件迁移到新架构
3. **类型安全**: 完整的 TypeScript 支持
4. **统一接口**: 所有组件都遵循 `AgentComponentProps` 标准
5. **智能适配**: 通过 `handler` 的存在自动识别交互式和非交互式动作

## 核心文件结构

```
agent/
├── agent-spec.ts                    # 核心接口定义
├── toolcall-agent-adapter.ts        # ToolCall 智能体适配器
├── TOOLCALL_AGENT_GUIDE.md         # 使用指南（本文件）
└── examples/
    ├── toolcall-agent-examples.tsx  # 基础使用示例
    └── travel-agent-migration.tsx   # 旅游规划完整示例
```

## 快速开始

### 1. 定义智能体组件

所有智能体组件必须遵循 `AgentComponentProps` 接口：

```typescript
import type { AgentComponentProps } from './agent-spec';

// 天气卡片组件
const WeatherCard: React.FC<AgentComponentProps<WeatherArgs, WeatherResult>> = ({
  status, args, result, error
}) => {
  switch (status) {
    case 'inProgress':
      return <div>🌤️ 正在获取 {args.location} 的天气...</div>;
    case 'complete':
      return <div>✅ {result?.location} 天气: {result?.condition}</div>;
    case 'error':
      return <div>❌ 获取天气失败: {error?.message}</div>;
    default:
      return <div>🌤️ 准备获取天气...</div>;
  }
};
```

### 2. 配置智能体动作

```typescript
import { useToolCallAgentAction } from "./toolcall-agent-adapter";

// 非交互式动作配置（有 handler）
const weatherAction: AgentActionConfig<WeatherArgs, WeatherResult> = {
  name: "get_weather_forecast", // 对应 ToolCall 的 toolCallName
  description: "获取天气预报",
  parameters: [{ name: "location", type: "string", required: true }],
  handler: async (args) => {
    // 业务逻辑
    const response = await fetch(`/api/weather?location=${args.location}`);
    return await response.json();
  },
  component: WeatherCard,
};

// 交互式动作配置（无 handler）
const confirmAction: AgentActionConfig<
  ConfirmArgs,
  ConfirmResult,
  ConfirmResponse
> = {
  name: "confirm_action",
  description: "确认操作",
  parameters: [{ name: "message", type: "string", required: true }],
  component: ConfirmDialog, // 包含用户交互逻辑
};
```

### 3. 注册和使用

```typescript
function MyTravelApp() {
  // 处理交互式动作的响应
  const handleConfirmResponse = useCallback((response: ConfirmResponse) => {
    console.log('用户确认结果:', response);
    // 可以调用 ChatEngine 继续对话
    // chatEngine.continueChat({
    //   toolCallMessage: { result: JSON.stringify(response) }
    // });
  }, []);

  // 注册动作
  useToolCallAgentAction(weatherAction);
  useToolCallAgentAction(confirmAction, handleConfirmResponse);

  return <div>智能体动作已注册</div>;
}
```

### 4. 渲染集成

```typescript
import { AgentToolCallRenderer } from '../../browser/parts/toolcall/agent-toolcall-renderer';

// 在消息渲染中使用
function renderMsgContents(contents: AIMessageContent[]) {
  return contents.map((content, index) => {
    if (content.type === 'toolcall') {
      return <AgentToolCallRenderer key={index} content={content} />;
    }
    // 其他类型...
  });
}
```

## 状态映射机制

系统会自动将 ToolCall 的字段映射到 Agent 状态：

| ToolCall 状态            | Agent 状态   | 说明                   |
| ------------------------ | ------------ | ---------------------- |
| `result` 存在            | `complete`   | 工具调用已完成         |
| `args` 存在但无 `result` | `executing`  | 正在执行或等待用户交互 |
| `chunk` 存在             | `inProgress` | 正在处理中             |
| 其他情况                 | `idle`       | 初始状态               |

## 动作类型

### 非交互式动作

- 包含 `handler` 函数
- 用于执行后台任务并显示状态
- 例如：天气查询、数据分析、报告生成

### 交互式动作

- 不包含 `handler` 函数
- 用于需要用户输入或确认的场景
- 例如：表单填写、操作确认、文件上传

## 迁移现有代码

### 旧的渲染方式：

```typescript
if (item.type === 'toolcall') {
  const { data } = item;
  if (data.toolCallName === 'get_weather_forecast') {
    return <WeatherCard weather={JSON.parse(data.result)} />;
  }
}
```

### 新的智能体方式：

```typescript
// 1. 定义符合 AgentComponentProps 的组件
const WeatherCard: React.FC<AgentComponentProps<WeatherArgs, WeatherResult>> = ({
  status, args, result
}) => {
  // 统一的状态处理逻辑
};

// 2. 注册动作
useToolCallAgentAction(weatherAction);

// 3. 使用统一渲染器
<AgentToolCallRenderer content={toolCallContent} />
```

## 实际案例

### 基础示例

参考 `examples/toolcall-agent-examples.tsx` 查看：

- 天气预报（非交互式）
- 用户偏好收集（交互式）
- 文件上传（复杂交互式）

### 完整应用示例

参考 `examples/travel-agent-migration.tsx` 查看完整的旅游规划智能体，包括：

- 天气查询
- 用户偏好收集
- 行程规划
- 酒店推荐

## 最佳实践

1. **状态处理**: 在组件中始终处理所有可能的状态（idle, inProgress, executing, complete, error）
2. **错误处理**: 为每个动作提供友好的错误提示
3. **用户体验**: 交互式组件应提供清晰的操作指引
4. **类型安全**: 充分利用 TypeScript 的类型检查
5. **响应处理**: 交互式动作的响应处理器应该调用 ChatEngine 继续对话流程

## 总结

这种基于 ToolCall 的智能体动作系统：

1. **保持兼容性**: 现有代码无需修改即可继续工作
2. **提供升级路径**: 可以逐步迁移到新的组件架构
3. **统一体验**: 所有智能体组件都有一致的接口和行为
4. **类型安全**: 完整的 TypeScript 类型检查
5. **易于扩展**: 可以轻松添加新的动作类型和组件

通过这种方式，我们既保留了现有系统的稳定性，又为未来的智能体功能扩展奠定了坚实基础。
