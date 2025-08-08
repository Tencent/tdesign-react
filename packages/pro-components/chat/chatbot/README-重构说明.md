# TDesign Chatbot Agent Action 重构说明

## 重构概述

基于前端智能体组件统一方案，我们成功重构了 TDesign Chatbot 的工具调用（ToolCall）处理机制，实现了统一的 Agent Action 配置和渲染系统。

## 核心改进

### 1. 统一的 Agent Action 配置系统

创建了完整的 Agent Action 配置体系：

- **ToolcallComponentProps**: 统一的组件 Props 接口
- **AgentToolcallConfig**: 支持交互式和非交互式两种模式的配置类型
- **AgentToolcallRegistry**: 全局注册表管理所有 Action 配置
- **useAgentToolcall**: 统一的注册 Hook

### 2. 智能的工具调用渲染器

实现了 `ToolCallRenderer` 组件，能够：

- 自动识别工具调用类型（交互式 vs 非交互式）
- 根据配置自动执行 handler 或等待用户交互
- 统一处理工具调用的状态管理
- 提供标准化的错误处理和加载状态

### 3. 旅游规划应用重构

将原有的手动工具调用处理逻辑重构为基于 Agent Action 的方式：

- 创建了 5 个标准化的 Action 配置
- 移除了分散的工具调用处理代码
- 实现了统一的响应处理机制

## 文件结构

```
packages/pro-components/chat/chatbot/
├── core/
│   └── agent-action/
│       ├── types.ts              # 核心类型定义
│       ├── registry.ts           # 全局注册表
│       ├── use-agent-action.ts   # 注册 Hook
│       ├── toolcall-renderer.tsx # 统一渲染器
│       └── index.ts              # 导出文件
├── _example/
│   ├── actions/
│   │   └── travel-actions.ts     # 旅游相关 Action 配置
│   ├── hooks/
│   │   └── use-travel-actions.ts # 旅游 Actions 注册 Hook
│   └── travel_v1.tsx             # 重构后的旅游规划组件
```

## 三种工具调用场景

### 1. 完全依赖后端数据（无 handler）

```typescript
export const weatherForecastAction: AgentToolcallConfig = {
  name: 'get_weather_forecast',
  description: '获取天气预报信息',
  // 没有 handler，完全依赖后端返回的 result
  component: WeatherCard,
};
```

### 2. 前端处理 + 后端数据（有 handler）

```typescript
export const dataProcessAction: AgentToolcallConfig = {
  name: 'process_data',
  description: '处理数据',
  handler: async (args, backendResult) => {
    // 前端处理逻辑
    const result = await processData(args);
    return result;
  },
  component: DataDisplayCard,
};
```

### 3. 交互式组件（无 handler + respond）

```typescript
export const userInputAction: AgentToolcallConfig = {
  name: 'get_user_input',
  description: '收集用户输入',
  // 没有 handler，使用交互式模式
  component: UserInputForm,
};
```

## 使用方式

### 1. 注册 Actions

```typescript
function MyComponent() {
  // 注册所有相关的 Actions
  useTravelActions();
  
  return <div>...</div>;
}
```

### 2. 渲染工具调用

```typescript
const renderMessageContent = ({ item }: MessageRendererProps) => {
  if (item.type === 'toolcall') {
    return (
      <ToolCallRenderer 
        toolCall={item.data} 
        onRespond={handleToolCallRespond}
      />
    );
  }
  return null;
};
```

## 优势

1. **高度内聚**: 工具的业务逻辑和 UI 逻辑封装在同一配置中
2. **统一接口**: 所有工具调用使用相同的 Props 接口
3. **自动化处理**: 适配器自动识别模式并处理状态管理
4. **类型安全**: 完整的 TypeScript 类型支持
5. **易于扩展**: 新增工具只需添加配置即可

## 兼容性

- 完全兼容现有的 AGUI 协议
- 保持与 TDesign Chatbot 核心引擎的兼容性
- 支持历史消息的正确渲染
- 向后兼容原有的工具调用处理方式

## 后续优化

1. 添加更多内置的通用组件
2. 支持工具调用的缓存和重试机制
3. 提供可视化的 Toolcall 配置工具
4. 扩展支持更多的交互模式