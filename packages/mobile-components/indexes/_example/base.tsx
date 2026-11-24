import React, { Fragment } from 'react';
import { ArrowLeftIcon } from 'tdesign-icons-react';
import { Indexes, IndexesAnchor, CellGroup, Cell } from 'tdesign-mobile-react';

export default function IndexesDemo({ goHome }) {
  let height = 0;
  try {
    height = window.innerHeight - document.querySelector('.tdesign-demo-topnav').clientHeight;
  } catch {
    //
  }

  const list = [
    {
      index: 'A',
      children: ['阿坝', '阿拉善', '阿里', '安康', '安庆', '鞍山', '安顺', '安阳', '澳门'],
    },
    {
      index: 'B',
      children: [
        '北京',
        '白银',
        '保定',
        '宝鸡',
        '保山',
        '包头',
        '巴中',
        '北海',
        '蚌埠',
        '本溪',
        '毕节',
        '滨州',
        '百色',
        '亳州',
      ],
    },
    {
      index: 'C',
      children: [
        '重庆',
        '成都',
        '长沙',
        '长春',
        '沧州',
        '常德',
        '昌都',
        '长治',
        '常州',
        '巢湖',
        '潮州',
        '承德',
        '郴州',
        '赤峰',
        '池州',
        '崇左',
        '楚雄',
        '滁州',
        '朝阳',
      ],
    },
    {
      index: 'D',
      children: [
        '大连',
        '东莞',
        '大理',
        '丹东',
        '大庆',
        '大同',
        '大兴安岭',
        '德宏',
        '德阳',
        '德州',
        '定西',
        '迪庆',
        '东营',
      ],
    },
    {
      index: 'E',
      children: ['鄂尔多斯', '恩施', '鄂州'],
    },
    {
      index: 'F',
      children: ['福州', '防城港', '佛山', '抚顺', '抚州', '阜新', '阜阳'],
    },
    {
      index: 'G',
      children: ['广州', '桂林', '贵阳', '甘南', '赣州', '甘孜', '广安', '广元', '贵港', '果洛'],
    },
    {
      index: 'J',
      children: ['揭阳', '吉林', '晋江', '吉安', '胶州', '嘉兴', '济南', '鸡西', '荆州', '江门', '基隆'],
    },
    {
      index: 'K',
      children: ['昆明', '开封', '康定', '喀什'],
    },
  ];
  const indexList = list.map((item) => item.index);

  return (
    <div style={{ position: 'relative', height }}>
      <ArrowLeftIcon
        className="return-indexes"
        onClick={() => {
          goHome();
        }}
      />
      <Indexes indexList={indexList}>
        {list.map((item) => (
          <Fragment key={item.index}>
            <IndexesAnchor index={item.index} />
            <CellGroup>
              {item.children.map((val, index) => (
                <Cell key={index} title={val} />
              ))}
            </CellGroup>
          </Fragment>
        ))}
      </Indexes>
    </div>
  );
}
