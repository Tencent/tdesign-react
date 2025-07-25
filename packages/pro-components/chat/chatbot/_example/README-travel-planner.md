# 旅游规划聊天应用

基于AG-UI协议的智能旅游规划聊天应用，展示了如何使用TDesign React聊天组件实现复杂的Agent对话场景。

## 功能特性

- 🌤️ **天气查询**: 自动获取目的地天气信息
- 📅 **行程规划**: 智能规划每日旅游路线
- 🏨 **酒店推荐**: 推荐合适的住宿选择
- 📊 **进度跟踪**: 实时显示规划进度
- 💬 **流式对话**: 支持AG-UI协议的流式响应
- 🎨 **丰富展示**: 卡片式展示天气、行程、酒店信息

## 文件结构

```
travel-planner/
├── travel-planner.tsx      # 主要组件文件
├── travel-planner.css      # 样式文件
├── mock/
│   └── agui-server.js      # 模拟AG-UI协议服务器
└── README-travel-planner.md # 说明文档
```

## 快速开始

### 1. 启动模拟服务器

```bash
cd packages/pro-components/chat/chatbot/_example/mock
node agui-server.js
```

服务器将在 `http://localhost:3000` 启动。

### 2. 运行示例

在TDesign React项目中运行旅游规划示例：

```bash
npm run dev
```

访问示例页面，选择 "Travel Planner" 示例。

## AG-UI协议适配

### 支持的事件类型

- `RUN_STARTED` - 运行开始
- `STEP_STARTED` - 步骤开始
- `STEP_FINISHED` - 步骤完成
- `THINKING_TEXT_MESSAGE_CONTENT` - 思考过程
- `TOOL_CALL_RESULT` - 工具调用结果
- `TEXT_MESSAGE_CHUNK` - 文本消息块
- `RUN_FINISHED` - 运行完成

### 自定义消息类型

```typescript
declare module '@tdesign-react/aigc' {
  interface AIContentTypeOverrides {
    weather: ChatBaseContent<'weather', { weather: any[] }>;
    itinerary: ChatBaseContent<'itinerary', { plan: any[] }>;
    hotel: ChatBaseContent<'hotel', { hotels: any[] }>;
    step_progress: ChatBaseContent<'step_progress', { steps: any[] }>;
    thinking: ChatBaseContent<'thinking', { title: string; content: string }>;
  }
}
```

## 组件说明

### WeatherCard
显示天气预报信息的卡片组件。

### ItineraryCard
展示行程规划的时间线组件。

### HotelCard
显示酒店推荐信息的列表组件。

### StepProgress
显示规划进度的侧边栏组件。

## 配置说明

### 聊天服务配置

```typescript
chatServiceConfig: {
  endpoint: 'http://127.0.0.1:3000/sse/agui',
  protocol: 'agui',
  stream: true,
  onMessage: (chunk): AIMessageContent => {
    // AG-UI协议消息处理逻辑
  },
  onRequest: (innerParams: ChatRequestParams) => {
    // 自定义请求参数
  },
}
```

### 消息处理流程

1. **接收AG-UI事件**: 通过SSE接收AG-UI协议事件
2. **事件解析**: 根据事件类型进行相应处理
3. **状态更新**: 更新步骤进度和UI状态
4. **内容渲染**: 将数据转换为可视化组件
5. **用户交互**: 处理用户操作和反馈

## 使用示例

### 基本用法

```typescript
import TravelPlannerChat from './travel-planner';

function App() {
  return (
    <div>
      <TravelPlannerChat />
    </div>
  );
}
```

### 自定义配置

```typescript
const customConfig = {
  endpoint: 'https://your-agui-server.com/sse/agui',
  agentType: 'custom-travel-planner',
  defaultPrompt: '请为我规划一个上海3日游行程',
};
```

## 开发说明

### 扩展新的消息类型

1. 在类型声明中添加新类型：

```typescript
declare module '@tdesign-react/aigc' {
  interface AIContentTypeOverrides {
    restaurant: ChatBaseContent<'restaurant', { restaurants: any[] }>;
  }
}
```

2. 创建对应的渲染组件：

```typescript
const RestaurantCard = ({ restaurants }) => (
  <Card className="restaurant-card">
    {/* 餐厅信息展示 */}
  </Card>
);
```

3. 在消息处理中添加处理逻辑：

```typescript
case 'TOOL_CALL_RESULT':
  if (rest.toolCallName === 'get_restaurants') {
    return {
      type: 'restaurant',
      data: { restaurants: JSON.parse(rest.content) },
    };
  }
```

### 自定义样式

修改 `travel-planner.css` 文件来自定义组件样式：

```css
.travel-planner-container {
  /* 自定义容器样式 */
}

.weather-card {
  /* 自定义天气卡片样式 */
}
```

## 技术架构

### 核心技术栈

- **React**: 前端框架
- **TDesign React**: UI组件库
- **AG-UI协议**: 智能Agent通信协议
- **SSE**: 服务器推送事件
- **TypeScript**: 类型安全

### 数据流

```
用户输入 → 发送请求 → AG-UI服务器 → SSE事件流 → 事件解析 → 状态更新 → UI渲染
```

## 常见问题

### Q: 如何修改默认的服务器地址？

A: 在组件的 `chatServiceConfig.endpoint` 中修改服务器地址。

### Q: 如何添加新的步骤？

A: 在 `stepProgress` 状态中添加新的步骤，并在事件处理中添加对应的 `STEP_STARTED` 和 `STEP_FINISHED` 处理。

### Q: 如何自定义卡片样式？

A: 修改对应的CSS类，或者创建新的卡片组件。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目基于 MIT 许可证开源。
