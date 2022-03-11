import React, { useState, useEffect } from 'react';
import { Button, Popup } from 'tdesign-react';

export default function Controlled() {
  const [visible] = useState(true);
  const [spanvisible, setvisible] = useState(false);
  const [content, setcontent] = useState('这是popup内容');
  useEffect(() => {
    setTimeout(() => {
      setvisible(true);
      setcontent('这是popup内容，又多出来好多好多好多好多....');
    }, 5000);
  }, []);

  return (
    <Popup content={content} trigger="manual" placement="top" visible={visible}>
      <Button>一直显示{spanvisible && <span>，动态扩展出了内容</span>}</Button>
    </Popup>
  );
}
