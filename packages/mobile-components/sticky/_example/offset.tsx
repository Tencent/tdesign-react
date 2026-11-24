import React from 'react';
import { Sticky, Button } from 'tdesign-mobile-react';

export default function Base() {
  return (
    <div className="tdesign-demo-block-2">
      <Sticky offsetTop={50}>
        <Button className="custom-common-button" theme="danger">
          吸顶距离
        </Button>
      </Sticky>
    </div>
  );
}
