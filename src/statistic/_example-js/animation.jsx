import React from 'react';
import { Space, Button, Statistic } from 'tdesign-react';

const AnimationStatistic = () => {
  const [start, setStart] = React.useState(false);
  const [value, setValue] = React.useState(56.32);
  const statisticRef = React.useRef();

  return (
    <Space direction="vertical">
      <Space>
        <Button onClick={() => setStart(true)}>Start</Button>
        <Button onClick={() => setValue(98.12)}>Update value</Button>
        <Button onClick={() => statisticRef.current?.start()}>refs</Button>
      </Space>
      <Statistic
        ref={statisticRef}
        title="Total Assets"
        suffix="%"
        value={value}
        animation={{
          valueFrom: 0,
          duration: 2000,
        }}
        decimalPlaces={2}
        animationStart={start}
      />
    </Space>
  );
};

export default AnimationStatistic;
