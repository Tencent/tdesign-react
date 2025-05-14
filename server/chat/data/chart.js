const chunks = [
  { type: 'text', msg: '昨日' },
  { type: 'text', msg: '上午' },
  { type: 'text', msg: '北京道路' },
  { type: 'text', msg: '车辆' },
  { type: 'text', msg: '通行状况' },
  { type: 'text', msg: '9:00的峰值（1330),' },
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
            data: [820, 932, 901, 934, 600, 500, 700, 900, 1330, 1320, 1200, 1300, 1100],
            type: 'line',
          },
        ],
      },
    },
  },
];

module.exports = chunks;
