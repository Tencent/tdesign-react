import React from 'react';
import { Sticky, Button } from 'tdesign-mobile-react';

export default function Base() {
  return (
    <div className="tdesign-demo-block-3" id="container">
      <Sticky container="#container">
        <Button className="custom-button custom-common-button">指定容器</Button>
      </Sticky>
    </div>
  );
}
