import React from 'react';
import { Button, Message } from '@tencent/tdesign-react';

const ThemeList = ['info', 'success', 'warning', 'error', 'question', 'loading'];

let message = null;

export default function () {
  return (
    <div className="message-element">
      {ThemeList.map((theme) => (
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
      ))}
      <Button
        onClick={() => {
          message = Message.info('I am duration 20s Message', 20 * 1000);
        }}
      >
        I am duration 20s Message
      </Button>
      <Button
        onClick={() => {
          Message.close(message);
        }}
      >
        close latest duration 20s Message
      </Button>
      <Button
        onClick={() => {
          Message.closeAll();
        }}
      >
        close all Message
      </Button>
      <Button
        onClick={() => {
          Message.info({
            content: '用户表示普通操作信息提示',
            placement: 'top',
            offset: {
              top: 50,
              left: -300,
            },
          });
        }}
      >
        带 offset 信息位置
      </Button>
    </div>
  );
}
