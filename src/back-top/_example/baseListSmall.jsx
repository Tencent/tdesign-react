// @ts-nocheck
import React, { useState } from 'react';
import { BackTop, List } from 'tdesign-react';

export default function BasicBackTop() {
  const [container, setContainer] = useState(null);

  const style = {
    position: 'absolute',
    insetInlineEnd: 24,
    insetBlockEnd: 80,
  };

  const listWrapStyle = {
    width: '100%',
    height: '280px',
    position: 'relative',
    overflowY: 'scroll',
    overflowX: 'hidden',
    border: '1px solid #dcdcdcff',
  };

  return (
    <div style={{ position: 'relative' }}>
      <div id='demo_1' style={listWrapStyle} ref={setContainer}>
        <List>
          {Array.from(Array(50), () => '列表内容').map((item, index) => <List.ListItem key={index}>{item}</List.ListItem>) }
        </List>
      </div>
      <BackTop container={() => container} visibleHeight={46} style={style} size="small" duration={500}></BackTop>
    </div>
  );
}
