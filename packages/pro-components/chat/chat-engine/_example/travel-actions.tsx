import React from 'react';

import { CloseIcon, InfoCircleIcon } from 'tdesign-icons-react';
import { Button, Select, Input, Checkbox, Card, Tag, Space, Divider, Typography, Alert, Loading } from 'tdesign-react';

import type { AgentToolcallConfig, ToolcallComponentProps } from '@tdesign-react/chat';

// ==================== 类型定义 ====================
// 天气显示
interface WeatherArgs {
  location: string;
  date?: string;
}

interface WeatherResult {
  location: string;
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
}

// 行程规划
interface PlanItineraryArgs {
  destination: string;
  days: number;
  budget?: number;
  interests?: string[];
}

interface PlanItineraryResult {
  destination: string;
  totalDays: number;
  dailyPlans: DailyPlan[];
  totalBudget: number;
  recommendations: string[];
  // handler 增强的字段
  optimized?: boolean;
  localTips?: string[];
  processTime?: number;
}

interface DailyPlan {
  day: number;
  activities: Activity[];
  estimatedCost: number;
}

interface Activity {
  time: string;
  name: string;
  description: string;
  cost: number;
  location: string;
}

// 用户偏好设置
interface TravelPreferencesArgs {
  destination: string;
  purpose: string;
}

interface TravelPreferencesResult {
  budget: number;
  interests: string[];
  accommodation: string;
  transportation: string;
  confirmed: boolean;
}

interface TravelPreferencesResponse {
  budget: number;
  interests: string[];
  accommodation: string;
  transportation: string;
}

// 酒店信息
interface HotelArgs {
  location: string;
  checkIn: string;
  checkOut: string;
}

interface HotelResult {
  hotels: Array<{
    name: string;
    rating: number;
    price: number;
    location: string;
    amenities: string[];
  }>;
}

// ==================== 组件实现 ====================

// 天气显示组件（后端完全受控，无 handler）
const WeatherDisplay: React.FC<ToolcallComponentProps<WeatherArgs, WeatherResult>> = ({
  status,
  args,
  result,
  error,
}) => {
  if (status === 'error') {
    return (
      <Alert theme="error" icon={<CloseIcon />} title="获取天气信息失败">
        {error?.message}
      </Alert>
    );
  }

  if (status === 'complete' && result) {
    const weather = typeof result === 'string' ? JSON.parse(result) : result;
    return (
      <Card
        className="weather-card travel-card-animation"
        title={
          <Typography.Title level={'h4'} style={{ margin: 0 }}>
            {weather.location} 天气
          </Typography.Title>
        }
        bordered
        hoverShadow
        style={{ maxWidth: 400 }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>温度</label>
            <Tag theme="primary" variant="light">
              {weather.temperature}
            </Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>天气状况</label>
            <Tag theme="success" variant="light">
              {weather.condition}
            </Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>湿度</label>
            <label>{weather.humidity}</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>风速</label>
            <label>{weather.windSpeed}</label>
          </div>
        </Space>
      </Card>
    );
  }

  if (status === 'inProgress') {
    return (
      <Card bordered style={{ maxWidth: 400 }}>
        <Space align="center">
          <Loading size="small" />
          <label>正在获取 {args.location} 的天气信息...</label>
        </Space>
      </Card>
    );
  }

  return (
    <Card bordered style={{ maxWidth: 400 }}>
      <Space align="center">
        <InfoCircleIcon />
        <label>准备查询天气信息...</label>
      </Space>
    </Card>
  );
};

// 行程规划组件（有 handler 进行数据后处理）
const PlanItinerary: React.FC<ToolcallComponentProps<PlanItineraryArgs, PlanItineraryResult>> = ({
  status,
  args,
  result,
  error,
}) => {
  // 处理 result 可能是 Promise 的情况
  const [resolvedResult, setResolvedResult] = React.useState<PlanItineraryResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (result && typeof result === 'object' && 'then' in result && typeof (result as any).then === 'function') {
      // result 是一个 Promise
      setIsLoading(true);
      (result as any)
        .then((resolved: PlanItineraryResult) => {
          setResolvedResult(resolved);
          setIsLoading(false);
        })
        .catch((err: any) => {
          console.error('Failed to resolve result:', err);
          setIsLoading(false);
        });
    } else {
      // result 是直接的对象
      const planResult = typeof result === 'string' ? JSON.parse(result) : result;
      setResolvedResult(planResult as PlanItineraryResult);
    }
  }, [result]);

  if (status === 'error') {
    return (
      <Alert theme="error" icon={<CloseIcon />} title="行程规划失败">
        {error?.message}
      </Alert>
    );
  }

  if (status === 'complete' && resolvedResult) {
    return (
      <Card
        className="itinerary-card travel-card-animation"
        title={
          <Typography.Title level={'h4'} style={{ margin: 0 }}>
            {resolvedResult.destination} {resolvedResult.totalDays}日游行程
          </Typography.Title>
        }
        bordered
        hoverShadow
        style={{ maxWidth: 600 }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>预算总计</label>
            <Tag theme="warning" variant="light">
              ¥{resolvedResult.totalBudget}
            </Tag>
          </div>

          <Divider />

          <Typography.Title level={'h5'}>每日行程</Typography.Title>
          {resolvedResult.dailyPlans.map((day, index) => (
            <Card key={index} bordered size="small" style={{ marginBottom: 12 }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography.Title level={'h5'} style={{ margin: 0 }}>
                    第 {day.day} 天
                  </Typography.Title>
                  <Tag theme="primary" variant="light">
                    预计花费: ¥{day.estimatedCost}
                  </Tag>
                </div>
                {day.activities.map((activity, actIndex) => (
                  <div
                    key={actIndex}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}
                  >
                    <Space>
                      <Tag theme="default" variant="light" size="small">
                        {activity.time}
                      </Tag>
                      <label>{activity.name}</label>
                    </Space>
                    <label>¥{activity.cost}</label>
                  </div>
                ))}
              </Space>
            </Card>
          ))}

          {resolvedResult.recommendations && resolvedResult.recommendations.length > 0 && (
            <>
              <Divider />
              <Typography.Title level={'h5'}>💡 推荐</Typography.Title>
              <Space direction="vertical" size="small">
                {resolvedResult.recommendations.map((rec, index) => (
                  <label key={index}>• {rec}</label>
                ))}
              </Space>
            </>
          )}

          {resolvedResult.localTips && resolvedResult.localTips.length > 0 && (
            <>
              <Divider />
              <Typography.Title level={'h5'}>🏠 本地贴士</Typography.Title>
              <Space direction="vertical" size="small">
                {resolvedResult.localTips.map((tip, index) => (
                  <label key={index}>• {tip}</label>
                ))}
              </Space>
            </>
          )}
        </Space>
      </Card>
    );
  }

  if (status === 'inProgress' || isLoading) {
    return (
      <Card bordered style={{ maxWidth: 600 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space align="center">
            <Loading size="small" />
            <label>
              正在为您规划 {args.destination} 的 {args.days} 日游行程...
            </label>
          </Space>
          {args.budget && <label>预算: ¥{args.budget}</label>}
          {args.interests && args.interests.length > 0 && <label>兴趣: {args.interests.join(', ')}</label>}
        </Space>
      </Card>
    );
  }

  return (
    <Card bordered style={{ maxWidth: 600 }}>
      <Space align="center">
        <InfoCircleIcon />
        <label>准备制定旅行计划...</label>
      </Space>
    </Card>
  );
};

// 酒店推荐组件
const HotelRecommend: React.FC<ToolcallComponentProps<HotelArgs, HotelResult>> = ({ status, args, result, error }) => {
  if (status === 'error') {
    return (
      <Alert theme="error" icon={<CloseIcon />} title="获取酒店信息失败">
        {error?.message}
      </Alert>
    );
  }
  if (status === 'complete' && result) {
    const hotels = typeof result === 'string' ? JSON.parse(result) : result;
    return (
      <Card
        className="hotel-card travel-card-animation"
        title={
          <Typography.Title level={'h4'} style={{ margin: 0 }}>
            {args.location} 酒店推荐
          </Typography.Title>
        }
        bordered
        hoverShadow
        style={{ maxWidth: 500 }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {hotels.map((hotel: any, index: number) => (
            <Card key={index} bordered size="small" style={{ marginBottom: 12 }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography.Title level={'h5'} style={{ margin: 0 }}>
                    {hotel.name}
                  </Typography.Title>
                  <Tag theme="warning" variant="light">
                    ¥{hotel.price}/晚
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>评分</label>
                  <Tag theme="success" variant="light">
                    {hotel.rating}分
                  </Tag>
                </div>
                <div>
                  <label>设施: {hotel.amenities?.join(', ')}</label>
                </div>
              </Space>
            </Card>
          ))}
        </Space>
      </Card>
    );
  }

  if (status === 'inProgress') {
    return (
      <Card bordered style={{ maxWidth: 500 }}>
        <Space align="center">
          <Loading size="small" />
          <label>正在查找 {args.location} 的酒店...</label>
        </Space>
      </Card>
    );
  }

  return (
    <Card bordered style={{ maxWidth: 500 }}>
      <Space align="center">
        <InfoCircleIcon />
        <label>准备查找酒店...</label>
      </Space>
    </Card>
  );
};

// 旅行偏好设置组件（交互式，使用 props.respond）
const TravelPreferences: React.FC<
  ToolcallComponentProps<TravelPreferencesArgs, TravelPreferencesResult, TravelPreferencesResponse>
> = ({ status, args, result, error, respond }) => {
  const [budget, setBudget] = React.useState(5000);
  const [interests, setInterests] = React.useState<string[]>(['美食', '景点']);
  const [accommodation, setAccommodation] = React.useState('酒店');
  const [transportation, setTransportation] = React.useState('高铁');

  const interestOptions = ['美食', '景点', '购物', '文化', '自然', '历史', '娱乐', '运动'];
  const accommodationOptions = ['酒店', '民宿', '青旅', '度假村'];
  const transportationOptions = ['飞机', '高铁', '汽车', '自驾'];

  if (status === 'error') {
    return (
      <Alert theme="error" icon={<CloseIcon />} title="设置偏好失败">
        {error?.message}
      </Alert>
    );
  }

  if (status === 'complete' && result) {
    return (
      <Card
        className="preferences-card travel-card-animation"
        title={
          <Typography.Title level={'h4'} style={{ margin: 0 }}>
            偏好设置完成
          </Typography.Title>
        }
        bordered
        hoverShadow
        style={{ maxWidth: 500 }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>目的地</label>
            <Tag theme="primary" variant="light">
              {args.destination}
            </Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>旅行目的</label>
            <label>{args.purpose}</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>预算</label>
            <Tag theme="warning" variant="light">
              ¥{result.budget}
            </Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>兴趣</label>
            <Space>
              {result.interests.map((interest, index) => (
                <Tag key={index} theme="success" variant="light" size="small">
                  {interest}
                </Tag>
              ))}
            </Space>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>住宿</label>
            <Tag theme="default" variant="light">
              {result.accommodation}
            </Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>交通</label>
            <Tag theme="default" variant="light">
              {result.transportation}
            </Tag>
          </div>
        </Space>
      </Card>
    );
  }

  if (status === 'inProgress') {
    return (
      <Card bordered style={{ maxWidth: 500 }}>
        <Space align="center">
          <Loading size="small" />
          <label>正在保存您的偏好设置...</label>
        </Space>
      </Card>
    );
  }

  if (status === 'executing') {
    return (
      <Card
        className="preferences-card travel-card-animation"
        title={
          <Typography.Title level={'h4'} style={{ margin: 0 }}>
            设置您的 {args.destination} 旅行偏好
          </Typography.Title>
        }
        bordered
        hoverShadow
        style={{ maxWidth: 500 }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div>
            <label>预算 (元): ¥{budget}</label>
            <Input
              type="range"
              min={1000}
              max={20000}
              step={500}
              value={budget}
              onChange={(value) => setBudget(Number(value))}
              style={{ width: '100%', marginTop: 8 }}
            />
          </div>

          <div>
            <label>兴趣偏好:</label>
            <div style={{ marginTop: 8 }}>
              <Checkbox.Group value={interests} onChange={setInterests}>
                <Space direction="vertical" size="small">
                  {interestOptions.map((option) => (
                    <Checkbox key={option} value={option} label={option} />
                  ))}
                </Space>
              </Checkbox.Group>
            </div>
          </div>

          <div>
            <label>住宿偏好:</label>
            <Select value={accommodation} onChange={setAccommodation} style={{ width: '100%', marginTop: 8 }}>
              {accommodationOptions.map((option) => (
                <Select.Option key={option} value={option} label={option} />
              ))}
            </Select>
          </div>

          <div>
            <label>交通偏好:</label>
            <Select value={transportation} onChange={setTransportation} style={{ width: '100%', marginTop: 8 }}>
              {transportationOptions.map((option) => (
                <Select.Option key={option} value={option} label={option} />
              ))}
            </Select>
          </div>

          <Divider />

          <Space>
            <Button
              theme="primary"
              onClick={() =>
                respond?.({
                  budget,
                  interests,
                  accommodation,
                  transportation,
                })
              }
            >
              确认设置
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setBudget(5000);
                setInterests(['美食', '景点']);
                setAccommodation('酒店');
                setTransportation('高铁');
              }}
            >
              重置
            </Button>
          </Space>
        </Space>
      </Card>
    );
  }

  return (
    <Card bordered style={{ maxWidth: 500 }}>
      <Space align="center">
        <InfoCircleIcon />
        <label>准备设置旅行偏好...</label>
      </Space>
    </Card>
  );
};

// ==================== 智能体动作配置 ====================

// 天气预报工具配置 - 非交互式（完全依赖后端数据）
export const weatherForecastAction: AgentToolcallConfig = {
  name: 'get_weather_forecast',
  description: '获取天气预报信息',
  parameters: [
    { name: 'location', type: 'string', required: true },
    { name: 'date', type: 'string', required: false },
  ],
  // 没有 handler，完全依赖后端返回的 result
  component: WeatherDisplay,
};

// 行程规划工具配置 - 有 handler 进行数据后处理
export const itineraryPlanAction: AgentToolcallConfig = {
  name: 'plan_itinerary',
  description: '规划旅游行程',
  parameters: [
    { name: 'destination', type: 'string', required: true },
    { name: 'days', type: 'number', required: true },
    { name: 'budget', type: 'number', required: false },
    { name: 'interests', type: 'array', required: false },
  ],
  component: PlanItinerary,
  // handler 作为数据后处理器，增强后端返回的数据
  handler: async (args: PlanItineraryArgs, backendResult?: any): Promise<PlanItineraryResult> => {
    const startTime = Date.now();

    // 如果后端提供了完整数据，进行增强处理
    if (backendResult && backendResult.dailyPlans) {
      // 添加本地化贴士
      const localTips = [
        `${args.destination}的最佳游览时间是上午9-11点和下午3-5点`,
        '建议提前预订热门景点门票',
        '随身携带充电宝和雨具',
      ];

      // 优化行程安排
      const optimizedPlans = backendResult.dailyPlans.map((day: DailyPlan) => ({
        ...day,
        activities: day.activities.sort((a, b) => a.time.localeCompare(b.time)),
      }));

      return {
        ...backendResult,
        dailyPlans: optimizedPlans,
        localTips,
        optimized: true,
        processTime: Date.now() - startTime,
      };
    }

    // 否则返回默认结果
    const fallbackResult: PlanItineraryResult = {
      dailyPlans: [],
      totalDays: args.days,
      totalBudget: args.budget || 180 * args.days,
      localTips: ['暂时无法提供旅行方案，请稍后再试'],
      optimized: false,
      destination: args.destination,
      recommendations: [],
      processTime: Date.now() - startTime,
    };
    return fallbackResult;
  },
};

// 酒店推荐工具配置 - 非交互式（完全依赖后端数据）
export const hotelRecommendAction: AgentToolcallConfig = {
  name: 'get_hotel_details',
  description: '获取酒店推荐信息',
  parameters: [
    { name: 'location', type: 'string', required: true },
    { name: 'checkIn', type: 'string', required: true },
    { name: 'checkOut', type: 'string', required: true },
  ],
  // 没有 handler，完全依赖后端返回的 result
  component: HotelRecommend,
};

// 用户偏好收集工具配置 - 交互式（需要用户输入）
export const travelPreferencesAction: AgentToolcallConfig = {
  name: 'get_travel_preferences',
  description: '收集用户旅游偏好信息',
  parameters: [
    { name: 'destination', type: 'string', required: true },
    { name: 'purpose', type: 'string', required: true },
  ],
  // 没有 handler，使用交互式模式
  component: TravelPreferences,
};

// 用户偏好结果展示工具配置 - 用于历史消息展示
// export const travelPreferencesResultAction: AgentToolcallConfig = {
//   name: 'get_travel_preferences_result',
//   description: '展示用户已输入的旅游偏好',
//   parameters: [{ name: 'userInput', type: 'object', required: true }],
//   // 没有 handler，纯展示组件
//   component: TravelPreferencesResult,
// };

// 导出所有 action 配置
export const travelActions = [
  weatherForecastAction,
  itineraryPlanAction,
  hotelRecommendAction,
  travelPreferencesAction,
];
