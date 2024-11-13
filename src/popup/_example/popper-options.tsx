import React from 'react';
import { Button, Popup } from 'tdesign-react';

export default function PopperOptions() {
  return (
    <Popup
      trigger="hover"
      showArrow
      content="这是一个弹出框"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [200, 0],
            },
          },
        ],
      }}
    >
      <Button>Hover me</Button>
    </Popup>
  );
}
