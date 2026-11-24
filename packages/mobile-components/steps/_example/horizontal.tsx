import React, { useState } from 'react';
import { Steps, StepItem } from 'tdesign-mobile-react';
import { CartIcon } from 'tdesign-icons-react';

export default function StepsDemo() {
  const [first, setFirst] = useState<number | string>('1');
  const [second, setSecond] = useState(1);
  const [third, setThird] = useState(1);
  const options = {
    first,
    second,
    third,
  };

  const count = 4;
  const onFirstChange = (current: number | string) => {
    setFirst(current);
  };
  const onSecondChange = (current: number) => {
    setSecond(current);
  };
  const onThirdChange = (current: number) => {
    setThird(current);
  };

  const getTitle = (type: 'first' | 'second' | 'third', index: number | string) => {
    const numIndex = Number(index);
    const currentValue = Number(options[type]);

    if (numIndex === currentValue) {
      return '当前步骤';
    }
    if (numIndex < currentValue) {
      return '已完成';
    }
    if (numIndex > currentValue) {
      return '未完成';
    }
  };

  return (
    <div>
      <div className="summary">水平带序号步骤条</div>
      <div className="steps-horizontal-demo-block">
        <Steps current={options.first} onChange={onFirstChange}>
          {Array.from({ length: count }).map((_, index) => (
            <StepItem key={index} title={getTitle('first', index)} content="辅助信息" />
          ))}
        </Steps>
      </div>
      <div className="summary">水平带图标步骤条</div>
      <div className="steps-horizontal-demo-block">
        <Steps current={options.second} onChange={onSecondChange}>
          {Array.from({ length: count }).map((_, index) => (
            <StepItem
              key={index}
              title={getTitle('second', index)}
              content="辅助信息"
              icon={<CartIcon size="20px" />}
            ></StepItem>
          ))}
        </Steps>
      </div>
      <div className="summary">水平简略步骤条</div>
      <div className="steps-horizontal-demo-block">
        <Steps current={options.third} theme="dot" onChange={onThirdChange}>
          {Array.from({ length: count }).map((_, index) => (
            <StepItem key={index} title={getTitle('third', index)} content="辅助信息" />
          ))}
        </Steps>
      </div>
    </div>
  );
}
