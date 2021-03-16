import React from 'react';
import { Anchor, AnchorItem } from '@tencent/tdesign-react';

export default function AnchorMutiple() {
  const handleChange = (currentItem, event) => {
    console.log('currentItem', currentItem);
    console.log('event', event);
  };

  return (
    <>
      <div id="/components/anchor/#multiple">
        <Anchor onChange={handleChange} bounds={100} targetOffset={100}>
          <AnchorItem href="/#/components/anchor/#default" title="定义" />
          <AnchorItem href="/#/components/anchor/#multiple" title="服务功能" />
        </Anchor>
      </div>
    </>
  );
}
