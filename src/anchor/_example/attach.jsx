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
        <Anchor onClick={handleClick} onChange={handleChange} attach="#attach">
          <AnchorItem href="/#/components/anchor/#content-1" title="content-1" />
          <AnchorItem href="/#/components/anchor/#content-2" title="content-2" />
          <AnchorItem href="/#/components/anchor/#content-3" title="content-3" />
          <AnchorItem href="/#/components/anchor/#content-4" title="content-4" />
        </Anchor>
        <div id="attach">
          <div id="/#/components/anchor/#content-1">content-1</div>
          <div id="/#/components/anchor/#content-2">content-2</div>
          <div id="/#/components/anchor/#content-3">content-3</div>
          <div id="/#/components/anchor/#content-4">content-4</div>
        </div>
      </div>
    </>
  );
}
