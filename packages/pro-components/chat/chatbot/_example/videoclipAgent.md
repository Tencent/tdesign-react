# 视频剪辑Agent组件

## 概述

`videoclipAgent.tsx` 是一个基于AG-UI协议的视频剪辑助手组件，展示了chatbot组件在自定义渲染方面的能力。该组件能够实时显示视频剪辑任务的进度，并提供交互式的步骤查看功能。

## 主要功能

### 1. 实时状态更新
- 支持AG-UI协议的SSE流式数据传输
- 处理`STATE_SNAPSHOT`和`STATE_DELTA`事件
- 使用JSON Patch技术进行增量状态更新

### 2. 交互式步骤显示
- 垂直步骤条展示剪辑流程
- 支持点击查看步骤详情
- 自动高亮当前活动步骤
- 显示步骤状态（pending、running、completed、failed）

### 3. 进度监控
- 实时显示剪辑进度
- 预估剩余时间显示
- 子任务进度展示

### 4. 工具调用支持
- 集成`show_steps`和`eda_transfer`工具调用
- 支持工具调用响应处理

## 技术特性

### 性能优化
- 使用`React.memo`、`useCallback`、`useMemo`优化渲染性能
- 避免不必要的组件重新渲染
- 优化大量状态更新时的性能表现

### 错误处理
- 完善的错误边界处理
- 详细的日志记录
- 空状态和异常情况的处理

### 类型安全
- 完整的TypeScript类型定义
- 扩展AG-UI协议的消息类型
- 严格的类型检查

## 组件结构

```
videoclipAgent.tsx
├── VideoClipSteps          # 步骤显示组件
├── MessageHeader           # 消息头部组件
├── useVideoclipToolcalls   # 工具调用Hook
└── VideoClipAgentChat      # 主组件
```

## 使用方法

### 基本使用

```tsx
import VideoClipAgentChat from './videoclipAgent';

function App() {
  return <VideoClipAgentChat />;
}
```

### 自定义配置

组件会自动连接到`http://localhost:3000/sse/videoclip`端点，支持以下配置：

- **协议**: AG-UI协议
- **传输方式**: SSE流式传输
- **数据格式**: JSON

## 状态数据结构

```typescript
interface VideoClipState {
  [runId: string]: {
    items: Array<{
      status: 'pending' | 'running' | 'completed' | 'failed';
      label: string;
      name: string;
      content: string;
      items?: Array<{
        label: string;
        name: string;
        status: string;
        content: string;
      }>;
    }>;
  };
}
```

## 支持的事件类型

### STATE_SNAPSHOT
完整状态快照，用于初始化或重置状态。

```json
{
  "type": "STATE_SNAPSHOT",
  "snapshot": {
    "runId": {
      "items": [...]
    }
  }
}
```

### STATE_DELTA
增量状态更新，使用JSON Patch格式。

```json
{
  "type": "STATE_DELTA",
  "delta": [
    {
      "op": "replace",
      "path": "/runId/items/0/status",
      "value": "completed"
    }
  ]
}
```

## 工具调用

### show_steps
显示视频剪辑步骤进度。

```typescript
{
  name: 'show_steps',
  parameters: [{ name: 'stepId', type: 'string', required: true }]
}
```

### eda_transfer
视频剪辑任务事件传输。

```typescript
{
  name: 'eda_transfer',
  parameters: [{ name: 'event_type', type: 'string', required: true }]
}
```

## 样式定制

组件使用`videoclipAgent.css`进行样式定制，支持以下CSS类：

- `.videoclip-agent-container`: 主容器
- `.videoclip-transfer-view`: 进度视图
- `.message-header`: 消息头部
- `.state-content`: 状态内容区域
- `.main-steps`: 主步骤区域
- `.step-detail`: 步骤详情区域

## 测试

组件包含完整的单元测试，位于`__tests__/videoclipAgent.test.tsx`：

```bash
# 运行测试
npm test videoclipAgent.test.tsx
```

## 故障排除

### 常见问题

1. **进展面板消失**
   - 确保正确处理`STATE_DELTA`事件
   - 检查JSON Patch应用是否正确

2. **步骤不自动轮转**
   - 检查useEffect依赖项
   - 确保步骤选择逻辑正确

3. **渲染错误**
   - 检查数组中是否存在null元素
   - 添加适当的null检查

### 调试技巧

1. 开启控制台日志查看详细信息
2. 检查网络请求和SSE连接状态
3. 验证数据格式是否符合预期

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本的视频剪辑进度显示

### v1.1.0
- 修复STATE_DELTA事件处理问题
- 优化步骤选择算法
- 添加null元素检查

### v1.2.0
- 添加性能优化
- 完善错误处理和日志记录
- 添加单元测试支持

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 许可证

MIT License