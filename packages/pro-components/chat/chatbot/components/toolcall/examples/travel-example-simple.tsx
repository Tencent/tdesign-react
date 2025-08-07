import React from 'react';
import { useToolCallAgentAction, renderToolCallAgent } from '../toolcall-agent-adapter';
import type { AgentComponentProps, AgentActionConfig } from '../agent-spec';
import type { ToolCallContent } from '../../../core/type';

/**
 * 简化的旅游规划智能体示例
 *
 * 这个示例展示如何定义和使用基于 ToolCall 的智能体动作
 * 可以直接集成到现有的聊天应用中
 */

// ========== 类型定义 ==========
type WeatherArgs = {
  location: string;
  date: string;
};

type WeatherResult = {
  location: string;
  weather: Array<{
    date: string;
    temperature: string;
    condition: string;
    humidity: string;
    wind: string;
  }>;
};

type PreferenceArgs = {
  title: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
  }>;
};

type PreferenceResponse = Record<string, any>;

// ========== 天气预报组件 ==========
const WeatherCard: React.FC<AgentComponentProps<WeatherArgs, WeatherResult>> = ({ status, args, result, error }) => {
  if (status === 'inProgress') {
    return (
      <div className="weather-card loading">
        <div className="loading-header">🌤️ 正在获取天气信息...</div>
        <div className="loading-details">查询地点: {args.location}</div>
      </div>
    );
  }

  if (status === 'complete' && result) {
    return (
      <div className="weather-card">
        <div className="weather-header">
          <h3>📍 {result.location} 天气预报</h3>
        </div>
        <div className="weather-list">
          {result.weather.map((day, index) => (
            <div key={index} className="weather-item">
              <div className="weather-date">{day.date}</div>
              <div className="weather-temp">{day.temperature}</div>
              <div className="weather-condition">{day.condition}</div>
              <div className="weather-details">
                <span>湿度: {day.humidity}</span>
                <span>风速: {day.wind}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="weather-card error">
        <div className="error-icon">❌</div>
        <div className="error-message">获取天气信息失败: {error?.message}</div>
      </div>
    );
  }

  return <div className="weather-card idle">🌤️ 准备获取天气信息...</div>;
};

// ========== 用户偏好收集组件 ==========
const HumanInputForm: React.FC<AgentComponentProps<PreferenceArgs, PreferenceResponse, PreferenceResponse>> = ({
  status,
  args,
  result,
  respond,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 验证必填字段
    const missingFields = args.fields
      .filter((field) => field.required && !formData[field.name])
      .map((field) => field.label);

    if (missingFields.length > 0) {
      alert(`请填写必填字段: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    respond?.(formData);
  };

  const handleCancel = () => {
    respond?.({ cancelled: true });
  };

  const updateField = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  if (status === 'executing') {
    return (
      <div className="human-input-form">
        <div className="form-header">
          <h3>{args.title}</h3>
          {args.description && <p>{args.description}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          {args.fields.map((field, index) => (
            <div key={index} className="form-field">
              <label className={field.required ? 'required' : ''}>
                {field.label}
                {field.required && <span className="required-mark">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  required={field.required}
                >
                  <option value="">请选择</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  required={field.required}
                  rows={3}
                />
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  value={formData[field.name] || ''}
                  onChange={(e) => updateField(field.name, Number(e.target.value))}
                  required={field.required}
                />
              ) : (
                <input
                  type="text"
                  value={formData[field.name] || ''}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : '提交'}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel} disabled={isSubmitting}>
              取消
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (status === 'complete' && result) {
    return (
      <div className="human-input-result">
        <div className="result-header">
          <h3>✅ 用户偏好已收集</h3>
        </div>
        <div className="result-content">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="result-item">
              <span className="result-key">{key}:</span>
              <span className="result-value">{JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div className="human-input-form idle">⏳ 准备收集用户偏好...</div>;
};

// ========== 智能体动作配置 ==========
export const travelAgentActions: AgentActionConfig[] = [
  // 天气预报 (非交互式)
  {
    name: 'get_weather_forecast',
    description: '获取目的地天气预报',
    parameters: [
      { name: 'location', type: 'string', required: true, description: '城市名称' },
      { name: 'date', type: 'string', required: true, description: '查询日期' },
    ],
    handler: async (args: WeatherArgs) => {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        location: args.location,
        weather: [
          {
            date: args.date,
            temperature: '22°C',
            condition: '晴转多云',
            humidity: '65%',
            wind: '东南风 2级',
          },
        ],
      };
    },
    component: WeatherCard,
  },

  // 用户偏好收集 (交互式)
  {
    name: 'get_travel_preferences',
    description: '收集用户旅游偏好',
    parameters: [
      { name: 'title', type: 'string', required: true, description: '表单标题' },
      { name: 'description', type: 'string', required: false, description: '表单描述' },
      { name: 'fields', type: 'array', required: true, description: '表单字段配置' },
    ],
    component: HumanInputForm,
  },
];

// ========== 智能体动作注册组件 ==========
export function TravelAgentProvider() {
  // 处理用户偏好响应
  const handlePreferenceResponse = React.useCallback((response: PreferenceResponse) => {
    console.log('用户偏好收集完成:', response);
    // 这里可以调用 ChatEngine 继续对话
    // chatEngine.continueChat({
    //   toolCallMessage: {
    //     result: JSON.stringify(response)
    //   }
    // });
  }, []);

  // 注册所有旅游相关的智能体动作
  travelAgentActions.forEach((action) => {
    const responseHandler = action.name === 'get_travel_preferences' ? handlePreferenceResponse : undefined;

    useToolCallAgentAction(action, responseHandler);
  });

  return (
    <div className="travel-agent-provider">
      <h2>🧳 旅游规划智能体</h2>
      <p>已注册 {travelAgentActions.length} 个智能体动作:</p>
      <ul>
        {travelAgentActions.map((action) => (
          <li key={action.name}>
            ✅ {action.description} ({action.name})
          </li>
        ))}
      </ul>
    </div>
  );
}

// ========== 渲染函数 - 用于集成到现有聊天应用中 ==========
export const renderTravelToolCall = (toolCallContent: ToolCallContent): React.ReactElement | null => {
  // 首先尝试使用智能体渲染器
  const agentComponent = renderToolCallAgent(toolCallContent);
  if (agentComponent) {
    return agentComponent;
  }

  // 回退到手动渲染
  const { data } = toolCallContent;

  switch (data.toolCallName) {
    case 'get_weather_forecast':
      if (data.result) {
        try {
          const weatherData = JSON.parse(data.result);
          return <WeatherCard status="complete" args={{ location: '', date: '' }} result={weatherData} />;
        } catch (e) {
          console.error('解析天气数据失败:', e);
        }
      }
      break;

    case 'get_travel_preferences':
      if (data.result) {
        try {
          const userInput = JSON.parse(data.result);
          return (
            <HumanInputForm status="complete" args={{ title: '', description: '', fields: [] }} result={userInput} />
          );
        } catch (e) {
          console.error('解析用户输入数据失败:', e);
        }
      }
      break;
  }

  return null;
};

// ========== 使用指南 ==========
/**
 * 如何在现有聊天应用中使用：
 *
 * 1. 在聊天组件中注册智能体动作：
 *    ```tsx
 *    function ChatApp() {
 *      return (
 *        <div>
 *          <TravelAgentProvider />
 *          <ChatInterface />
 *        </div>
 *      );
 *    }
 *    ```
 *
 * 2. 在消息渲染逻辑中使用渲染函数：
 *    ```tsx
 *    const renderMessageContent = (item: AIMessageContent) => {
 *      if (item.type === 'toolcall') {
 *        const travelComponent = renderTravelToolCall(item);
 *        if (travelComponent) {
 *          return travelComponent;
 *        }
 *      }
 *      // 其他消息类型的渲染逻辑...
 *    };
 *    ```
 *
 * 3. 或者直接使用通用的智能体渲染器：
 *    ```tsx
 *    const renderMessageContent = (item: AIMessageContent) => {
 *      if (item.type === 'toolcall') {
 *        const agentComponent = renderToolCallAgent(item);
 *        if (agentComponent) {
 *          return agentComponent;
 *        }
 *      }
 *      // 回退到默认渲染...
 *    };
 *    ```
 */
