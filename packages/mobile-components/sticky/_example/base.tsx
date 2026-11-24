import React from 'react';
import { Sticky, Button } from 'tdesign-mobile-react';

export default function Base() {
  return (
    <div className="tdesign-demo-block-1">
      <Sticky>
        <Button className="custom-common-button" theme="primary">
          基础吸顶
        </Button>
      </Sticky>
    </div>
  );
}
