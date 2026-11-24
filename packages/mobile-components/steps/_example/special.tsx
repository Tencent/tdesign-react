import React, { useState } from 'react';
import { Steps, StepItem, Button } from 'tdesign-mobile-react';
import { ChevronRightIcon, CartIcon } from 'tdesign-icons-react';

export default function StepsDemo() {
  const [first, setFirst] = useState(3);
  const [second, setSecond] = useState(4);
  const options = {
    first,
    second,
  };

  const [count1, setCount1] = useState(4);
  const count = 4;
  const onFirstChange = (current: number) => {
    setCount1(current + 1);
    setFirst(current);
  };
  const onSecondChange = (current: number) => {
    setSecond(current);
  };

  const toNext = () => {
    setCount1((prev) => prev + 1);
    setFirst(count1);
  };

  const getTitle = (type: 'first' | 'second', index: number) => {
    if (index === options[type]) {
      return '当前步骤';
    }
    if (index < options[type]) {
      return '已完成';
    }
    if (index > options[type]) {
      return '未完成';
    }
  };

  return (
    <div>
      <div className="summary">垂直自定义步骤条</div>
      <div className="steps-vertical-demo-block">
        <Steps current={options.first} layout="vertical" theme="dot" onChange={onFirstChange}>
          {Array.from({ length: count1 }).map((_, index) => (
            <StepItem
              key={index}
              title={getTitle('first', index)}
              titleRight={<ChevronRightIcon size="22px" color="rgba(0, 0, 0, .4)" />}
            />
          ))}
        </Steps>
        <Button style={{ marginTop: '32px', width: '100%' }} size="large" theme="light" onClick={toNext}>
          下一步
        </Button>
      </div>
      <div className="summary">纯展示步骤条</div>
      <div className="steps-vertical-demo-block">
        <Steps current={options.second} layout="vertical" theme="dot" readonly onChange={onSecondChange}>
          {Array.from({ length: count }).map((_, index) => (
            <StepItem
              key={index}
              title="步骤展示"
              content="可自定义此处内容"
              icon={<CartIcon size="20px" />}
            ></StepItem>
          ))}
        </Steps>
      </div>
    </div>
  );
}
