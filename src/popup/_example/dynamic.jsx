import React, { useState, useRef } from 'react';
import { Button, Popup } from 'tdesign-react';

export default function Controlled() {
  const [visible] = useState(true);
  const [spanVisible, setVisible] = useState(false);
  const [content, setContent] = useState('这是popup内容');
  const btnClicksRef = useRef(0);

  const toggleContent = () => {
    btnClicksRef.current += 1;
    const showMore = btnClicksRef.current % 2 !== 0;
    setVisible(showMore);
    setContent(`这是popup内容${showMore ? '，又多出来好多好多好多好多....' : ''}`);
  };

  return (
    <Popup content={content} trigger="context-menu" placement="top" visible={visible}>
      <Button onClick={toggleContent}>点击改变内容{spanVisible && <span>，再点一下</span>}</Button>
    </Popup>
  );
}
