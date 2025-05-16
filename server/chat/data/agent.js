module.exports = [
  { type: 'text', msg: '为5岁' },
  { type: 'text', msg: '小朋友' },
  { type: 'text', msg: '准备' },
  { type: 'text', msg: '一场生日' },
  { type: 'text', msg: '派对，' },
  { type: 'text', msg: '我会' },
  { type: 'text', msg: '根据要求' },
  { type: 'text', msg: '准备' },
  { type: 'text', msg: '合适方案，' },
  { type: 'text', msg: '计划从' },
  { type: 'text', msg: '以下几个' },
  { type: 'text', msg: '步骤' },
  { type: 'text', msg: '进行准备：' },
  {
    type: 'agent',
    state: 'init',
    id: 'task1',
    content: {
      text: '生日聚会规划任务已分解为3个执行阶段',
      steps: [
        { step: '确定派对餐饮方案', agent_id: 'a1' },
        { step: '准备派对现场布置', agent_id: 'a2' },
        { step: '策划派对活动', agent_id: 'a3' },
      ],
    },
  },
  {
    type: 'agent',
    state: 'command',
    id: 'task1-a1-c1',
    content: {
      agent_id: 'a1',
      text: '调用智能搜索工具，搜索儿童健康点心，儿童健康食谱',
    },
  },
  {
    type: 'agent',
    state: 'command',
    id: 'task1-a1-c2',
    content: {
      agent_id: 'a1',
      text: '已筛选出3种高性价比菜单方案，开始进行营养匹配',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a1-result',
    content: {
      agent_id: 'a1',
      text: '推荐餐饮方案: ',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a1-result',
    content: {
      agent_id: 'a1',
      text: '主菜是香草烤鸡（无麸质），',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a1-result',
    content: {
      agent_id: 'a1',
      text: '准备耗时45分钟；',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a1-result',
    content: {
      agent_id: 'a1',
      text: '恐龙造型生日蛋糕，',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a1-result',
    content: {
      agent_id: 'a1',
      text: '可食用果蔬汁调色的面团；',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a1-result',
    content: {
      agent_id: 'a1',
      text: '水果蔬菜拼盘；',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a1-result',
    content: {
      agent_id: 'a1',
      text: '饮品是鲜榨苹果汁，橙汁',
    },
  },
  {
    type: 'agent',
    state: 'finish',
    id: 'task1-a1-finish',
    content: {
      agent_id: 'a1',
    },
  },
  {
    type: 'agent',
    state: 'command',
    id: 'task1-a2-c1',
    content: {
      agent_id: 'a2',
      text: '调用智能搜索工具，搜索儿童派对用品清单',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a2-result',
    content: {
      agent_id: 'a2',
      text: '推荐现场布置方案：',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a2-result',
    content: {
      agent_id: 'a2',
      text: '餐具（一次性纸盘、刀叉套装）',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a2-result',
    content: {
      agent_id: 'a2',
      text: '、杯子、纸巾、一次性桌布，',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a2-result',
    content: {
      agent_id: 'a2',
      text: '装饰气球、横幅、礼帽等，',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a2-result',
    content: {
      agent_id: 'a2',
      text: '根据来访人数，可以选择零售渠道，价格从1-15元不等',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: 'task1-a2-result',
    content: {
      agent_id: 'a2',
      text: '，让孩子参与布置过程，增加互动性',
    },
  },
  {
    type: 'agent',
    state: 'finish',
    id: 'task1-a2-finish',
    content: {
      agent_id: 'a2',
    },
  },
  {
    type: 'agent',
    state: 'command',
    id: 'task1-a3-c1',
    content: {
      agent_id: 'a3',
      text: '搜索儿童派对游戏，安全、有趣、简单',
    },
  },
  {
    type: 'agent',
    state: 'command',
    id: 'task1-a3-c2',
    content: {
      agent_id: 'a3',
      text: '整理信息并进行合理性分析，安全性评估',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: '888',
    content: {
      agent_id: 'a3',
      text: '派对总时长建议控制在1.5小时，',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: '888',
    content: {
      agent_id: 'a3',
      text: '符合5岁儿童注意力持续时间，',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: '888',
    content: {
      agent_id: 'a3',
      text: '每位小朋友到达时可以在拍照区留影，',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: '888',
    content: {
      agent_id: 'a3',
      text: '可设置一个签到板，',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: '888',
    content: {
      agent_id: 'a3',
      text: '推荐活动：',
    },
  },
  {
    type: 'agent',
    state: 'result',
    id: '888',
    content: {
      agent_id: 'a3',
      text: '尾巴追逐赛，彩泥制作，套圈，抽盲盒',
    },
  },
  {
    type: 'agent',
    state: 'finish',
    id: 'task1-a3-finish',
    content: {
      agent_id: 'a3',
    },
  },
];
