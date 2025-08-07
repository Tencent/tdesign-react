import React from 'react';
import {
  Button,
  Select,
  Input,
  Checkbox,
  Card,
  Tag,
  Space,
  Divider,
  Typography,
  Alert,
  Loading,
  Badge,
} from 'tdesign-react';
import { CloudIcon, MapIcon, UserIcon, DeleteIcon, CheckIcon, CloseIcon, InfoCircleIcon } from 'tdesign-icons-react';
import type { AgentComponentProps, AgentActionConfig } from '../components/toolcall/agent-spec';

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

// 删除确认对话框
interface ConfirmDeletionArgs {
  itemName: string;
  itemId: string;
}

interface ConfirmDeletionResult {
  confirmed: boolean;
  itemId: string;
  deletedAt?: string;
}

interface ConfirmDeletionResponse {
  confirmed: boolean;
}

// ==================== 组件实现 ====================

// 天气显示组件（后端完全受控，无 handler）
const WeatherDisplay: React.FC<AgentComponentProps<WeatherArgs, WeatherResult>> = ({ status, args, result, error }) => {
  if (status === 'error') {
    return (
      <Alert theme="error" icon={<CloseIcon />} title="获取天气信息失败">
        {error?.message}
      </Alert>
    );
  }

  if (status === 'complete' && result) {
    console.log('====WeatherDisplay result', args, result);
    return (
      <Card
        className="weather-card travel-card-animation"
        title={
          <Typography.Title level={'h4'} style={{ margin: 0 }}>
            {result.location} 天气
          </Typography.Title>
        }
        bordered
        hoverShadow
        style={{ maxWidth: 400 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>温度</label>
            <Tag theme="primary" variant="light">
              {result.temperature}
            </Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>天气状况</label>
            <Tag theme="success" variant="light">
              {result.condition}
            </Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>湿度</label>
            <label>{result.humidity}</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>风速</label>
            <label>{result.windSpeed}</label>
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
const PlanItinerary: React.FC<AgentComponentProps<PlanItineraryArgs, PlanItineraryResult>> = ({
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
      setResolvedResult(result as PlanItineraryResult);
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
    console.log('====PlanItinerary result', resolvedResult);
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
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {resolvedResult.optimized && resolvedResult.processTime && (
            <Alert theme="success" icon={<CheckIcon />}>
              行程已优化，处理时间: {resolvedResult.processTime}ms
            </Alert>
          )}

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
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
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

// 旅行偏好设置组件（交互式，使用 props.respond）
const TravelPreferences: React.FC<
  AgentComponentProps<TravelPreferencesArgs, TravelPreferencesResult, TravelPreferencesResponse>
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
  console.log('====TravelPreferences result', args, result);

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
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert theme="info" icon={<InfoCircleIcon />}>
            旅行目的: {args.purpose}
          </Alert>
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

// 删除确认对话框组件（交互式示例）
export const ConfirmDeletionDialog: React.FC<
  AgentComponentProps<ConfirmDeletionArgs, ConfirmDeletionResult, ConfirmDeletionResponse>
> = ({ status, args, result, error, respond }) => {
  if (status === 'error') {
    return (
      <Alert theme="error" icon={<CloseIcon />} title="操作失败">
        {error?.message}
      </Alert>
    );
  }

  if (status === 'complete' && result) {
    return (
      <Card
        className="confirm-card travel-card-animation"
        title={
          <Typography.Title level={'h4'} style={{ margin: 0 }}>
            {result.confirmed ? '删除成功' : '删除已取消'}
          </Typography.Title>
        }
        bordered
        hoverShadow
        style={{ maxWidth: 400 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {result.confirmed ? (
            <Alert theme="success" icon={<CheckIcon />}>
              项目 &quot;{args.itemName}&quot; (ID: {args.itemId}) 已被删除
              {result.deletedAt && (
                <div style={{ marginTop: 8 }}>
                  <label size="small">删除时间: {result.deletedAt}</label>
                </div>
              )}
            </Alert>
          ) : (
            <Alert theme="warning" icon={<CloseIcon />}>
              项目 &quot;{args.itemName}&quot; 保持不变
            </Alert>
          )}
        </Space>
      </Card>
    );
  }

  if (status === 'inProgress') {
    return (
      <Card bordered style={{ maxWidth: 400 }}>
        <Space align="center">
          <Loading size="small" />
          <label>正在处理删除操作...</label>
        </Space>
      </Card>
    );
  }

  // 交互阶段：等待用户输入
  if (status === 'executing') {
    return (
      <Card
        className="confirm-card travel-card-animation"
        title={
          <Typography.Title level={'h4'} style={{ margin: 0 }}>
            确认删除
          </Typography.Title>
        }
        bordered
        hoverShadow
        style={{ maxWidth: 400 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert theme="warning" icon={<InfoCircleIcon />}>
            <label>项目: {args.itemName}</label>
            <div style={{ marginTop: 4 }}>
              <label size="small">ID: {args.itemId}</label>
            </div>
            <div style={{ marginTop: 4 }}>
              <label size="small">此操作不可撤销。</label>
            </div>
          </Alert>

          <Space>
            <Button theme="danger" onClick={() => respond?.({ confirmed: true })}>
              确认删除
            </Button>
            <Button variant="outline" onClick={() => respond?.({ confirmed: false })}>
              取消
            </Button>
          </Space>
        </Space>
      </Card>
    );
  }

  return (
    <Card bordered style={{ maxWidth: 400 }}>
      <Space align="center">
        <InfoCircleIcon />
        <label>准备确认对话框...</label>
      </Space>
    </Card>
  );
};

// ==================== 智能体动作配置 ====================

export const travelAgentActions: AgentActionConfig[] = [
  // 场景1：后端完全受控 - 天气显示（无 handler）
  {
    name: 'get_weather_forecast',
    description: '获取指定地点的天气预报',
    parameters: [
      { name: 'location', type: 'string', required: true, description: '城市名称' },
      { name: 'date', type: 'string', required: false, description: '日期 (可选)' },
    ],
    component: WeatherDisplay,
    // 无 handler，数据完全来自后端
  },

  // 场景2：非交互式 - 行程规划（有 handler 进行数据后处理）
  {
    name: 'plan_itinerary',
    description: '制定详细的旅行行程计划',
    parameters: [
      { name: 'destination', type: 'string', required: true, description: '目的地' },
      { name: 'days', type: 'number', required: true, description: '旅行天数' },
      { name: 'budget', type: 'number', required: false, description: '预算' },
      { name: 'interests', type: 'array', required: false, description: '兴趣爱好列表' },
    ],
    component: PlanItinerary,
    // handler 作为数据后处理器，增强后端返回的数据
    handler: async (args: PlanItineraryArgs, backendResult?: any): Promise<PlanItineraryResult> => {
      const startTime = Date.now();
      console.log('开始处理行程规划数据:', {
        args,
        backendResult,
        backendResultType: typeof backendResult,
        backendResultKeys: backendResult ? Object.keys(backendResult) : 'undefined',
        hasDailyPlans: backendResult?.dailyPlans ? 'yes' : 'no',
      });

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

      // 如果后端数据不完整，生成基础行程（降级处理）
      console.log('使用降级处理，生成基础行程');

      const dailyPlans: DailyPlan[] = [];
      for (let day = 1; day <= args.days; day++) {
        dailyPlans.push({
          day,
          activities: [
            {
              time: '09:00',
              name: `${args.destination}景点游览`,
              description: '探索当地著名景点',
              cost: 100,
              location: args.destination,
            },
            {
              time: '12:00',
              name: '当地美食体验',
              description: '品尝特色菜肴',
              cost: 80,
              location: args.destination,
            },
          ],
          estimatedCost: 180,
        });
      }

      const fallbackResult = {
        destination: args.destination,
        totalDays: args.days,
        dailyPlans,
        totalBudget: args.budget || 180 * args.days,
        recommendations: ['提前预订', '关注天气', '准备现金'],
        localTips: [`这是为${args.destination}生成的基础行程`],
        optimized: false,
        processTime: Date.now() - startTime,
      };

      console.log('降级处理结果:', fallbackResult);
      return fallbackResult;
    },
  },

  // 场景3：交互式 - 旅行偏好设置（无 handler，使用 props.respond）
  {
    name: 'get_travel_preferences',
    description: '收集用户的旅行偏好设置',
    parameters: [
      { name: 'destination', type: 'string', required: true, description: '目的地' },
      { name: 'purpose', type: 'string', required: true, description: '旅行目的' },
    ],
    component: TravelPreferences,
    // 无 handler，数据来自用户交互（通过 props.respond）
  },

  // 场景3：交互式 - 删除确认对话框（示例）
  {
    name: 'confirm_deletion',
    description: '确认删除操作',
    parameters: [
      { name: 'itemName', type: 'string', required: true, description: '项目名称' },
      { name: 'itemId', type: 'string', required: true, description: '项目ID' },
    ],
    component: ConfirmDeletionDialog,
    // 无 handler，数据来自用户交互（通过 props.respond）
  },
];

// ==================== 响应处理器示例 ====================

/**
 * 旅行偏好响应处理器
 * 将用户的偏好设置发送给后端，并继续对话
 */
export const createTravelPreferencesResponseHandler =
  (chatEngine: any, inputValue: string) =>
  async (response: TravelPreferencesResponse): Promise<TravelPreferencesResult> => {
    console.log('收到用户偏好设置:', response);

    try {
      // 1. 构造新的请求参数
      const tools = chatEngine.getToolcallByName('get_travel_preferences') || {};
      const newRequestParams = {
        prompt: inputValue,
        toolCallMessage: {
          ...tools,
          result: JSON.stringify(response),
        },
      };

      // 2. 继续对话
      await chatEngine.continueChat(newRequestParams);

      // 3. 返回处理结果
      return {
        ...response,
        confirmed: true,
      };
    } catch (error) {
      console.error('提交用户偏好设置失败:', error);
      throw new Error('保存偏好设置失败');
    }
  };

/**
 * 删除确认响应处理器
 * 执行实际的删除操作
 */
export const handleConfirmDeletionResponse = async (
  response: ConfirmDeletionResponse,
): Promise<ConfirmDeletionResult> => {
  console.log('收到删除确认:', response);

  if (!response.confirmed) {
    return {
      confirmed: false,
      itemId: '', // 实际使用中从上下文获取
    };
  }

  try {
    // 模拟删除操作
    // const result = await api.deleteItem(itemId);

    // 模拟异步删除
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      confirmed: true,
      itemId: '', // 实际使用中从上下文获取
      deletedAt: new Date().toLocaleString(),
    };
  } catch (error) {
    throw new Error('删除操作失败');
  }
};
