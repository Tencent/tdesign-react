import React from 'react';
import { Button, Message } from '@tdesign/react';
import { THEME_LIST } from '../const';
let message = null;
export default function () {
  return (
    <div className="message-element">
      {THEME_LIST.map((theme) => {
        return (
          <Button
            key={theme}
            onClick={() => {
              Message[theme]({
                content: `This is ${theme} Messsage`,
                close: true,
              });
            }}
          >
            Display a {theme} indicator
          </Button>
        );
      })}
      <Button
        key={'1'}
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
              top: '50px',
              left: '-300px',
            },
          });
        }}
      >
        带 offset 信息位置
      </Button>
    </div>
  );
}
