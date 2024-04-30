import React, { useEffect, useState, useRef } from 'react';
import { Button, Tooltip } from 'tdesign-react';

export default function Placements() {
  const ref = useRef();
  const timerRef = useRef();
  const [reset, setReset] = useState(true);
  const [count, setCount] = useState(5);
  const countRef = useRef(5);

  const setTimer = () => {
    timerRef.current = setInterval(() => {
      countRef.current -= 1;
      setCount(countRef.current);
      if (countRef.current <= 0) {
        clearInterval(timerRef.current);
        setReset(true);
      }
    }, 1000);
  };

  const onResetClick = () => {
    setReset(false);
    countRef.current = 5;
    setCount(5);
    clearInterval(timerRef.current);
    setTimer();
    ref.current.setVisible(true);
  };

  useEffect(() => {
    setTimer();
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <Tooltip content={`提示在${count}秒后消失`} duration={5000} ref={ref}>
        <Button variant="text">定时消失</Button>
      </Tooltip>
      {reset && (
        <Button variant="outline" onClick={onResetClick}>
          点击再次查看
        </Button>
      )}
    </>
  );
}
