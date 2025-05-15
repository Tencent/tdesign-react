module.exports = [
  {
    type: 'agent',
    state: 'agent_init',
    id: '111111',
    content: {
      text: '家庭聚会规划任务已分解为3个执行阶段',
      steps: [
        { step: '① 餐饮方案', agent_id: 'a1', time: '2分钟' },
        { step: '② 设备调度', agent_id: 'a2', time: '3分钟' },
        { step: '③ 安全监测', agent_id: 'a3', time: '1分钟' },
      ],
    },
  },
  {
    type: 'agent',
    state: 'agent_update',
    id: '222',
    content: {
      agent_id: 'a1',
      text: '开始生成餐饮方案：正在分析用户饮食偏好...',
    },
  },
  {
    type: 'agent',
    state: 'agent_update',
    id: '333',
    content: {
      agent_id: 'a1',
      text: '已筛选出3种高性价比菜单方案，正在进行营养匹配...',
    },
  },
  {
    type: 'agent',
    state: 'agent_result',
    id: '444',
    content: {
      agent_id: 'a1',
      text: '🍴 推荐餐饮方案:主菜是香草烤鸡（无麸质），准备耗时45分钟；饮品是智能调酒机方案B，酒精浓度12%',
    },
  },
  {
    type: 'agent',
    state: 'agent_finish',
    id: '44455',
    content: {
      agent_id: 'a1',
    },
  },
  {
    type: 'agent',
    state: 'agent_update',
    id: '555',
    content: {
      agent_id: 'a2',
      text: '设备调度中：已激活厨房智能设备...',
    },
  },
  {
    type: 'agent',
    state: 'agent_result',
    id: '666',
    content: {
      agent_id: 'a2',
      text: '📱 设备调度方案:智能烤箱预热至180℃,倒计时09:15启动;环境调节至23℃，湿度55%',
    },
  },
  {
    type: 'agent',
    state: 'agent_finish',
    id: '4445566',
    content: {
      agent_id: 'a2',
    },
  },
  {
    type: 'agent',
    state: 'agent_update',
    id: '777',
    content: {
      agent_id: 'a3',
      text: '安全巡检完成：未发现燃气泄漏风险',
    },
  },
  {
    type: 'agent',
    state: 'agent_result',
    id: '888',
    content: {
      agent_id: 'a3',
      text: '所有智能体已完成协作',
    },
  },
  {
    type: 'agent',
    state: 'agent_finish',
    id: '444556677',
    content: {
      agent_id: 'a3',
    },
  },
];
