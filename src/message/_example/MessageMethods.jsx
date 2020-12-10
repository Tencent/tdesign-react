import React from 'react';
import { Button, Message } from '@tencent/tdesign-react';

const ThemeList = ['info', 'success', 'warning', 'error', 'question', 'loading'];

export default function () {
  return (
    <div className="message-element">
      {ThemeList.map((theme) => (
        <>
          <Button
            key={theme}
            onClick={() => {
              Message[theme]({
                content: `This is ${theme} Message`,
                close: true,
              });
            }}
          >
            Display a {theme} indicator
          </Button>
          <br />
        </>
      ))}
    </div>
  );
}
