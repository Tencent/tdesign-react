import React from 'react';
import { Anchor, AnchorItem } from '@tencent/tdesign-react';

export default function AnchorBase() {
  const handleClick = () => {
    console.log('handleClick');
  };
  const handleChange = (currentLink, prevLink) => {
    console.log('currentLink', currentLink, 'prevLink', prevLink);
  };
  return (
    <>
      <div id="/components/anchor/#default">
        <Anchor onClick={handleClick} onChange={handleChange} bounds={100}>
          <AnchorItem href="/#/components/anchor/#default" title="定义" />
          <AnchorItem href="/#/components/anchor/#multiple" title="服务功能" />
        </Anchor>
      </div>
    </>
  );
}
