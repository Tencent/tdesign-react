import React, { useState } from 'react';
import { Skeleton, Switch } from 'tdesign-react';

const style = {
  'mb-20': {
    marginBottom: '20px',
  },
  't-skeleton-demo-paragraph': {
    lineHeight: '25px',
  },
};

export default function BasicSkeleton() {
  const [checked, setChecked] = useState(true);

  const onChange = (value) => {
    console.log('value', value);
    setChecked(value);
  };

  return (
    <div>
      <div>
        <Switch style={style['mb-20']} value={checked} onChange={onChange}></Switch>
      </div>
      <div>
        <Skeleton loading={checked} style={style['mb-20']}>
          <div style={style['t-skeleton-demo-paragraph']}>
            <p style={{ lineHeight: '20px' }}>
              明月几时有，把酒问青天。 不知天上宫阙，今夕是何年？ 我欲乘风归去，又恐琼楼玉宇， 高处不胜寒。
              起舞弄清影，何似在人间！
            </p>
            <p>
              转朱阁，低绮户，照无眠。 不应有恨，何事长向别时圆？ 人有悲欢离合，月有阴晴圆缺， 此事古难全。
              但愿人长久，千里共婵娟。
            </p>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}
