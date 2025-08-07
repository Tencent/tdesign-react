# ToolCall 智能体集成指南

## 概述

本指南介绍如何在 TDesign Chat 中集成基于 ToolCall 的智能体组件系统。该系统使用统一的配置接口，通过配置的存在性自动判断使用场景。

## 🎯 三种使用场景

### 场景 1：后端完全受控

- **配置**：只有 `component`
- **数据来源**：`ToolCallContent` 中的 `result`
- **适用于**：数据展示、状态显示、简单信息呈现

### 场景 2：数据后处理

- **配置**：`component + handler`
- **数据来源**：`ToolCallContent result + handler 后处理`
- **适用于**：数据格式化、本地计算、数据增强

### 场景 3：交互式

- **配置**：`component`（使用 `props.respond`）
- **数据来源**：用户交互
- **适用于**：表单输入、确认对话框、文件上传

## 📋 核心接口

### 1. AgentComponentProps

```typescript
interface AgentComponentProps<TArgs, TResult, TResponse> {
  status: 'idle' | 'inProgress' | 'executing' | 'complete' | 'error';
  args: TArgs; // 来自 tool_call_args
  result?: TResult; // 来自后端数据或 handler 处理结果
  error?: Error; // 错误信息
  respond?: (response: TResponse) => void; // 用户交互回调（交互式场景）
}
```

### 2. AgentActionConfig（统一配置）

```typescript
interface AgentActionConfig<TArgs, TResult, TResponse> {
  name: string;
  description: string;
  parameters: AgentParameter[];
  /** 渲染组件 */
  component: React.FC<AgentComponentProps<TArgs, TResult, TResponse>>;
  /** 可选的数据后处理器，接收 (args, backendResult) 参数 */
  handler?: (args: TArgs, backendResult?: any) => Promise<TResult>;
}
```

## 🔧 使用示例

### 场景 1：后端完全受控（无 handler）

```typescript
// 天气显示组件
const WeatherDisplay: React.FC<AgentComponentProps<WeatherArgs, WeatherResult>> = ({ status, args, result, error }) => {
  if (status === 'error') {
    return <div>获取天气信息失败: {error?.message}</div>;
  }

  if (status === 'complete' && result) {
    return (
      <div className="weather-card">
        <h4>🌤️ {result.location} 天气</h4>
        <div className="weather-details">
          <p>
            <strong>温度:</strong> {result.temperature}
          </p>
          <p>
            <strong>天气:</strong> {result.condition}
          </p>
          <p>
            <strong>湿度:</strong> {result.humidity}
          </p>
          <p>
            <strong>风速:</strong> {result.windSpeed}
          </p>
        </div>
      </div>
    );
  }

  return <div>正在获取 {args.location} 的天气信息...</div>;
};

// 配置（无 handler）
const weatherAction: AgentActionConfig = {
  name: 'get_weather_forecast',
  description: '显示天气预报',
  parameters: [{ name: 'location', type: 'string', required: true, description: '城市名称' }],
  component: WeatherDisplay,
  // 无 handler，数据完全来自后端
};
```

### 场景 2：数据后处理（有 handler）

```typescript
// 计算组件
const Calculator: React.FC<AgentComponentProps<CalculateArgs, CalculateResult>> = ({ status, args, result, error }) => {
  switch (status) {
    case 'inProgress':
      return <div>正在处理表达式 {args.expression}...</div>;
    case 'complete':
      return (
        <div className="calculation-result">
          <p>表达式: {args.expression}</p>
          <p>计算结果: {result?.value}</p>
          <p>处理时间: {result?.processTime}ms</p>
          {result?.optimized && <span>🚀 已优化</span>}
        </div>
      );
    case 'error':
      return <div>计算失败: {error?.message}</div>;
    default:
      return <div>准备计算...</div>;
  }
};

// 配置（有 handler 进行数据后处理）
const calculatorAction: AgentActionConfig = {
  name: 'calculate_expression',
  description: '计算数学表达式',
  parameters: [{ name: 'expression', type: 'string', required: true, description: '数学表达式' }],
  component: Calculator,
  // handler 作为数据后处理器，增强后端返回的数据
  handler: async (args: CalculateArgs, backendResult?: any): Promise<CalculateResult> => {
    const startTime = Date.now();

    // 如果后端已经提供了结果，直接使用并增强
    if (backendResult && backendResult.value !== undefined) {
      return {
        ...backendResult,
        processTime: Date.now() - startTime,
        optimized: true,
        expression: args.expression,
      };
    }

    // 如果后端没有提供结果，前端进行计算（降级处理）
    try {
      const value = eval(args.expression); // 注意：实际项目中不要使用 eval
      return {
        value,
        expression: args.expression,
        processTime: Date.now() - startTime,
        source: 'frontend',
      };
    } catch (error) {
      throw new Error('计算表达式无效');
    }
  },
};
```

### 场景 3：交互式（使用 props.respond）

```typescript
// 用户确认组件
const ConfirmDialog: React.FC<AgentComponentProps<ConfirmArgs, ConfirmResult, ConfirmResponse>> = ({
  status,
  args,
  result,
  error,
  respond,
}) => {
  if (status === 'executing') {
    return (
      <div className="confirm-dialog">
        <h3>⚠️ 确认操作</h3>
        <p>{args.message}</p>
        <div className="button-group">
          <button className="confirm-btn" onClick={() => respond?.({ confirmed: true, timestamp: Date.now() })}>
            确认
          </button>
          <button className="cancel-btn" onClick={() => respond?.({ confirmed: false, timestamp: Date.now() })}>
            取消
          </button>
        </div>
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="confirm-result">
        {result?.confirmed ? `✅ 您已确认: ${args.message}` : `❌ 您已取消操作`}
        <small>时间: {new Date(result?.timestamp || 0).toLocaleTimeString()}</small>
      </div>
    );
  }

  if (status === 'error') {
    return <div>操作失败: {error?.message}</div>;
  }

  return <div>正在准备确认对话框...</div>;
};

// 配置（无 handler，使用 props.respond）
const confirmAction: AgentActionConfig = {
  name: 'user_confirm',
  description: '请求用户确认操作',
  parameters: [{ name: 'message', type: 'string', required: true, description: '确认消息' }],
  component: ConfirmDialog,
  // 无 handler，数据来自用户交互（通过 props.respond）
};
```

## 🚀 集成步骤

### 步骤 1：定义类型接口

```typescript
// 后端完全受控
interface WeatherArgs {
  location: string;
  date?: string;
}

interface WeatherResult {
  location: string;
  temperature: string;
  condition: string;
  humidity: string;
}

// 数据后处理
interface CalculateArgs {
  expression: string;
}

interface CalculateResult {
  value: number;
  expression: string;
  processTime?: number;
  optimized?: boolean;
  source?: string;
}

// 交互式
interface ConfirmArgs {
  message: string;
}

interface ConfirmResult {
  confirmed: boolean;
  timestamp: number;
}

interface ConfirmResponse {
  confirmed: boolean;
  timestamp: number;
}
```

### 步骤 2：创建智能体组件

```typescript
const WeatherDisplay: React.FC<AgentComponentProps<WeatherArgs, WeatherResult>> = ({ status, args, result, error }) => {
  // 组件实现...
};

const Calculator: React.FC<AgentComponentProps<CalculateArgs, CalculateResult>> = ({ status, args, result, error }) => {
  // 组件实现...
};

const ConfirmDialog: React.FC<AgentComponentProps<ConfirmArgs, ConfirmResult, ConfirmResponse>> = ({
  status,
  args,
  result,
  error,
  respond,
}) => {
  // 组件实现...
};
```

### 步骤 3：配置智能体动作

```typescript
export const agentActions: AgentActionConfig[] = [
  // 场景1：后端完全受控（无 handler）
  {
    name: 'get_weather_forecast',
    description: '获取天气预报',
    parameters: [{ name: 'location', type: 'string', required: true, description: '城市名称' }],
    component: WeatherDisplay,
  },

  // 场景2：数据后处理（有 handler）
  {
    name: 'calculate_expression',
    description: '计算数学表达式',
    parameters: [{ name: 'expression', type: 'string', required: true, description: '数学表达式' }],
    component: Calculator,
    handler: async (args: CalculateArgs, backendResult?: any) => {
      // 数据后处理逻辑
      return enhancedResult;
    },
  },

  // 场景3：交互式（无 handler，使用 props.respond）
  {
    name: 'user_confirm',
    description: '请求用户确认操作',
    parameters: [{ name: 'message', type: 'string', required: true, description: '确认消息' }],
    component: ConfirmDialog,
  },
];
```

### 步骤 4：注册智能体动作

```typescript
import { useToolCallAgentAction } from '../components/toolcall/toolcall-agent-adapter';

export default function MyChat() {
  // 注册动作（简化版，无需 responseHandler 参数）
  agentActions.forEach((action) => {
    useToolCallAgentAction(action);
  });

  // 其他组件逻辑...
}
```

### 步骤 5：集成渲染逻辑

```typescript
import { renderToolCallAgent, renderToolCallAgentSync } from '../components/toolcall/toolcall-agent-adapter';

const renderMessageContent = async ({ item, index }: MessageRendererProps): Promise<React.ReactNode> => {
  if (item.type === 'toolcall') {
    // 对于无 handler 的场景，可以使用同步版本
    const syncComponent = renderToolCallAgentSync(item);
    if (syncComponent) {
      return (
        <div key={`agent-sync-${index}`} className="agent-container">
          {syncComponent}
        </div>
      );
    }

    // 对于有 handler 的场景，使用异步版本
    const agentComponent = await renderToolCallAgent(item);
    if (agentComponent) {
      return (
        <div key={`agent-async-${index}`} className="agent-container">
          {agentComponent}
        </div>
      );
    }
  }
  return null;
};
```

## 📊 场景选择指南

| 场景             | 何时使用                         | 配置要求                            | 数据流向              |
| ---------------- | -------------------------------- | ----------------------------------- | --------------------- |
| **后端完全受控** | 数据展示、状态显示、简单信息呈现 | 只需 `component`                    | 后端 → 组件           |
| **数据后处理**   | 数据格式化、本地计算、数据增强   | `component + handler`               | 后端 → handler → 组件 |
| **交互式**       | 表单输入、用户确认、文件上传     | `component`（使用 `props.respond`） | 组件 ↔ 用户 → respond |

## 🔍 核心设计理念

### 1. 统一配置接口

- 使用单一的 `AgentActionConfig` 接口
- 通过配置的存在性自动判断场景类型
- 简化开发者的使用复杂度

### 2. Handler 职责明确

- **无 handler**：数据完全来自后端或用户交互
- **有 handler**：作为数据后处理器，接收 `(args, backendResult)` 参数

### 3. Respond 机制

- `props.respond` 在组件内部使用，无需外部传递
- 适配器自动为交互式组件提供 `respond` 函数

## 🔍 调试和监控

系统提供了简化的日志输出：

```typescript
// 注册时的日志
console.log(`Registered action: get_weather_forecast`, {
  hasHandler: false,
});

// 渲染时的日志
console.log(`Rendered action without handler: get_weather_forecast`);
console.log(`Rendered action with handler: calculate_expression`);
```

## ⚠️ 注意事项

1. **配置简化**：通过 `handler` 的存在性自动判断场景类型
2. **Handler 职责**：仅作为数据后处理器，不是主要数据生产者
3. **异步处理**：有 `handler` 的场景需要异步处理，使用 `renderToolCallAgent`
4. **同步渲染**：无 `handler` 的场景可以使用 `renderToolCallAgentSync` 获得更好性能
5. **交互机制**：`respond` 通过 `props` 提供，无需外部管理
6. **缓存机制**：`handler` 结果会被缓存，避免重复计算

## 📋 最佳实践

### 1. 组件设计

- 根据 `status` 渲染不同状态的 UI
- 处理 `error` 状态，提供友好的错误提示
- 使用 `args` 显示加载状态的上下文信息

### 2. Handler 设计

- Handler 作为数据后处理器，接收后端数据并增强
- 优雅降级：如果后端数据不可用，可以进行前端计算
- 保持函数的纯净性，避免副作用

### 3. 交互设计

- 在 `executing` 状态下提供交互界面
- 通过 `props.respond` 及时反馈用户操作
- 在 `complete` 状态下显示最终结果

### 4. 性能优化

- 无 handler 场景使用同步渲染获得更好性能
- Handler 结果会被自动缓存
- 合理使用缓存清理机制

这个简化的系统为 TDesign Chat 提供了统一且易用的智能体组件集成能力，通过配置的存在性自动判断使用场景，大大降低了开发复杂度。
