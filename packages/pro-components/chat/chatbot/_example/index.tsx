import React from 'react';
import { Space, Card } from 'tdesign-react';
import BasicExample from './basic';
import AgentExample from './agent';
import AguiExample from './agui';
import TravelPlannerExample from './travel-planner';
import AguiStepExample from './agui-step';

const examples = [
  {
    title: '基础聊天',
    description: '基本的聊天功能演示',
    component: BasicExample,
  },
  {
    title: 'Agent聊天',
    description: '智能Agent对话演示',
    component: AgentExample,
  },
  {
    title: 'AG-UI协议',
    description: 'AG-UI协议基础演示',
    component: AguiExample,
  },
  {
    title: 'AG-UI步骤演示',
    description: 'AG-UI协议步骤化演示',
    component: AguiStepExample,
  },
  {
    title: '🏖️ 旅游规划助手',
    description: '基于AG-UI协议的智能旅游规划聊天应用',
    component: TravelPlannerExample,
    featured: true,
  },
];

export default function ChatbotExamples() {
  const [activeExample, setActiveExample] = React.useState(4); // 默认显示旅游规划助手

  const ActiveComponent = examples[activeExample].component;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>TDesign React Chatbot 示例</h2>
        <p>展示基于AG-UI协议的智能聊天组件功能</p>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* 侧边栏 */}
        <div style={{ width: '300px', flexShrink: 0 }}>
          <Card title="示例列表">
            <Space direction="vertical" style={{ width: '100%' }}>
              {examples.map((example, index) => (
                <div
                  key={index}
                  onClick={() => setActiveExample(index)}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: `1px solid ${activeExample === index ? '#0052d9' : '#e7e7e7'}`,
                    backgroundColor: activeExample === index ? '#f2f6ff' : 'white',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      fontWeight: example.featured ? 'bold' : 'normal',
                      color: activeExample === index ? '#0052d9' : '#333',
                      marginBottom: '4px',
                    }}
                  >
                    {example.title}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      lineHeight: '1.4',
                    }}
                  >
                    {example.description}
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </div>

        {/* 主内容区 */}
        <div style={{ flex: 1 }}>
          <Card title={examples[activeExample].title} style={{ height: '700px' }}>
            <ActiveComponent />
          </Card>
        </div>
      </div>
    </div>
  );
}
