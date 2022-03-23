import React, { useState, useRef } from 'react';
import { Button, Popup } from 'tdesign-react';

export default function Controlled() {
  const [visible] = useState(true);
  const [spanvisible, setvisible] = useState(false);
  const [content, setcontent] = useState('这是popup内容');
  const btnClicksRef = useRef(0);

  const toggleContent = () => {
    btnClicksRef.current += 1;
    const showMore = btnClicksRef.current % 2 !== 0;
    setvisible(showMore);
    setcontent(`这是popup内容${showMore ? '，又多出来好多好多好多好多....' : ''}`);
  };

  return (
    <Popup content={content} trigger="manual" placement="top" visible={visible}>
      <Button onClick={toggleContent}>点击改变内容{spanvisible && <span>，再点一下</span>}</Button>
    </Popup>
  );
}
