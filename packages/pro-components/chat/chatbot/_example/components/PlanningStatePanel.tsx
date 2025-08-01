import React from 'react';
import { Card, Timeline, Tag, Divider } from 'tdesign-react';
import { CheckCircleFilledIcon, LocationIcon, LoadingIcon, TimeIcon, InfoCircleIcon } from 'tdesign-icons-react';

interface PlanningStatePanelProps {
  state: any;
  currentStep?: string;
}

export const PlanningStatePanel: React.FC<PlanningStatePanelProps> = ({ state, currentStep }) => {
  if (!state) return null;

  const { itinerary, status } = state;

  // 定义步骤顺序和状态
  const allSteps = [
    { name: '天气查询', key: 'weather', completed: !!itinerary?.weather },
    { name: '行程规划', key: 'plan', completed: !!itinerary?.plan },
    { name: '酒店推荐', key: 'hotels', completed: !!itinerary?.hotels },
  ];

  // 获取步骤状态
  const getStepStatus = (step: any) => {
    if (step.completed) return 'completed';
    if (
      currentStep === step.name ||
      (status === 'weather_querying' && step.key === 'weather') ||
      (status === 'planning' && step.key === 'plan') ||
      (status === 'hotel_recommending' && step.key === 'hotels')
    ) {
      return 'running';
    }
    return 'pending';
  };

  // 获取步骤图标
  const getStepIcon = (step: any) => {
    const stepStatus = getStepStatus(step);

    switch (stepStatus) {
      case 'completed':
        return <CheckCircleFilledIcon size="medium" color="#00a870" />;
      case 'running':
        return <LoadingIcon size="medium" color="#0052d9" className="loading-spin" />;
      default:
        return <TimeIcon size="medium" color="#dcdcdc" />;
    }
  };

  // 获取步骤标签
  const getStepTag = (step: any) => {
    const stepStatus = getStepStatus(step);

    switch (stepStatus) {
      case 'completed':
        return (
          <Tag theme="success" size="small">
            已完成
          </Tag>
        );
      case 'running':
        return (
          <Tag theme="primary" size="small">
            进行中
          </Tag>
        );
      default:
        return (
          <Tag theme="default" size="small">
            等待中
          </Tag>
        );
    }
  };

  const getStatusText = () => {
    if (status === 'finished') return '已完成';
    if (status === 'planning') return '规划中';
    return '准备中';
  };

  const getStatusTheme = () => {
    if (status === 'finished') return 'success';
    if (status === 'planning') return 'primary';
    return 'default';
  };

  return (
    <Card className="planning-state-panel" size="small">
      <div className="panel-header">
        <LocationIcon size="medium" />
        <span className="panel-title">规划进度</span>
        <Tag theme={getStatusTheme()} size="small">
          {getStatusText()}
        </Tag>
      </div>
      <Divider />
      <div className="progress-steps">
        <Timeline mode="same" theme="dot">
          {allSteps.map((step) => (
            <Timeline.Item key={step.name} label="" dot={getStepIcon(step)}>
              <div className="step-item">
                <div className="step-title">{step.name}</div>
                {getStepTag(step)}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      {/* 显示最终结果摘要 */}
      {status === 'finished' && itinerary && (
        <div className="final-summary">
          <Divider />
          <div className="summary-header">
            <InfoCircleIcon size="small" />
            <span>规划摘要</span>
          </div>
          <div className="summary-content">
            {itinerary.weather && <div>• 天气信息: {itinerary.weather.length}天预报</div>}
            {itinerary.plan && <div>• 行程安排: {itinerary.plan.length}天计划</div>}
            {itinerary.hotels && <div>• 酒店推荐: {itinerary.hotels.length}个选择</div>}
          </div>
        </div>
      )}
    </Card>
  );
};
