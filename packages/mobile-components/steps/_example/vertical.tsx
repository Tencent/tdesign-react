import React, { useState } from 'react';
import { Steps, StepItem, Image } from 'tdesign-mobile-react';
import { CartIcon } from 'tdesign-icons-react';

export default function StepsDemo() {
  const [first, setFirst] = useState(1);
  const [second, setSecond] = useState(1);
  const [third, setThird] = useState(1);
  const [four, setFour] = useState(1);
  const options = {
    first,
    second,
    third,
    four,
  };

  const count = 4;
  const onFirstChange = (current: number) => {
    setFirst(current);
  };
  const onSecondChange = (current: number) => {
    setSecond(current);
  };
  const onThirdChange = (current: number) => {
    setThird(current);
  };
  const onFourChange = (current: number) => {
    setFour(current);
  };

  const getTitle = (type: 'first' | 'second' | 'third' | 'four', index: number) => {
    if (index === options[type]) {
      return '当前步骤';
    }
    if (index < options[type]) {
      return '已完成';
    }
    if (index > options[type]) {
      return '未完成步骤';
    }
  };

  return (
    <div>
      <div className="summary">垂直带序号步骤条</div>
      <div className="steps-vertical-demo-block">
        <Steps layout="vertical" current={options.first} onChange={onFirstChange}>
          {Array.from({ length: count }).map((_, index) => (
            <StepItem key={index} title={getTitle('first', index)} content="可自定义此处内容" />
          ))}
        </Steps>
      </div>
      <div className="summary">垂直带图标步骤条</div>
      <div className="steps-vertical-demo-block">
        <Steps layout="vertical" current={options.second} onChange={onSecondChange}>
          {Array.from({ length: count }).map((_, index) => (
            <StepItem
              key={index}
              title={getTitle('second', index)}
              content="可自定义此处内容"
              icon={<CartIcon size="20px" />}
            ></StepItem>
          ))}
        </Steps>
      </div>
      <div className="summary">垂直简略步骤条</div>
      <div className="steps-vertical-demo-block">
        <Steps layout="vertical" current={options.third} theme="dot" onChange={onThirdChange}>
          {Array.from({ length: count }).map((_, index) => (
            <StepItem key={index} title={getTitle('third', index)} content="可自定义此处内容" />
          ))}
        </Steps>
      </div>
      <div className="summary">垂直带可自定义此处内容步骤条</div>
      <div className="steps-vertical-demo-block">
        <Steps layout="vertical" current={options.four} theme="dot" onChange={onFourChange}>
          {Array.from({ length: count }).map((_, index) => (
            <StepItem
              key={index}
              title={getTitle('four', index)}
              content="可自定义此处内容"
              extra={
                index === 1 && (
                  <Image src="https://tdesign.gtimg.com/mobile/demos/steps1.png" alt="图标" style={{ width: '100%' }} />
                )
              }
            />
          ))}
        </Steps>
      </div>
    </div>
  );
}
