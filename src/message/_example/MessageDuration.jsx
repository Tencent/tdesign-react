import React from 'react';
import { Button, Message } from '@tencent/tdesign-react';

let message = null;

export default function () {
  return (
    <div className="message-element">
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
    </div>
  );
}
