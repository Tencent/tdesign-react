import React from 'react';
import { Button, Message } from '@tencent/tdesign-react';

const ThemeList = ['info', 'success', 'warning', 'error', 'question', 'loading'];

export default function () {
  return (
    <div className="message-element">
      {ThemeList.map((theme, index) => (
        <div key={index}>
          <Button
            onClick={() => {
              Message[theme]({
                content: `This is ${theme} Message`,
                close: true,
              });
            }}
          >
            Display a {theme} indicator
          </Button>
        </div>
      ))}
    </div>
  );
}
