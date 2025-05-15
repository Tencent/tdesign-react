const chunks = [
  { type: 'text', msg: '今日' },
  { type: 'text', msg: '上午' },
  { type: 'text', msg: '北京道路' },
  { type: 'text', msg: '车辆' },
  { type: 'text', msg: '通行状况' },
  { type: 'text', msg: '9:00的峰值（1320),' },
  { type: 'text', msg: '可能显示早高峰拥堵最严重时段' },
  { type: 'text', msg: '10:00后缓慢回落，' },
  { type: 'text', msg: '可以得出如下折线图：' },
  {
    type: 'chart',
    data: {
      id: 'c1',
      chartType: 'line',
      options: {
        xAxis: {
          type: 'category',
          data: [
            '0:00',
            '1:00',
            '2:00',
            '3:00',
            '4:00',
            '5:00',
            '6:00',
            '7:00',
            '8:00',
            '9:00',
            '10:00',
            '11:00',
            '12:00',
          ],
        },
        yAxis: {
          axisLabel: { inside: false },
        },
        series: [
          {
            data: [500, 402, 382, 434, 560, 630, 720, 980, 1230, 1320, 1200, 1300, 1100],
            type: 'line',
          },
        ],
      },
    },
  },
  { type: 'text', msg: '今日', paragraph: 'next' },
  { type: 'text', msg: '晚上' },
  { type: 'text', msg: '北京道路' },
  { type: 'text', msg: '车辆' },
  { type: 'text', msg: '通行状况' },
  { type: 'text', msg: '18:00的峰值（1322),' },
  { type: 'text', msg: '可能显示早高峰拥堵最严重时段' },
  { type: 'text', msg: '21:00后缓慢回落，' },
  { type: 'text', msg: '可以得出如下折线图：' },
  {
    type: 'chart',
    data: {
      id: 'c2',
      chartType: 'line',
      options: {
        xAxis: {
          type: 'category',
          data: ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        },
        yAxis: {
          axisLabel: { inside: false },
        },
        series: [
          {
            data: [701, 921, 1322, 1091, 990, 810, 700, 500],
            type: 'line',
          },
        ],
      },
    },
  },
];

module.exports = chunks;
