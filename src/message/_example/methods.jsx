import React from 'react';
import { Button, Message } from 'tdesign-react';

export default function () {
  return (
    <div className="tdesign-demo-block-row">
      <Button
        onClick={() => {
          Message.info({
            content: 'This is info Message',
            close: true,
          });
        }}
      >
        info
      </Button>

      <Button
        onClick={() => {
          Message.success({
            content: 'This is success Message',
            close: true,
          });
        }}
      >
        success
      </Button>

      <Button
        onClick={() => {
          Message.warning({
            content: 'This is warning Message',
            close: true,
          });
        }}
      >
        warning
      </Button>

      <Button
        onClick={() => {
          Message.error({
            content: 'This is error Message',
            close: true,
          });
        }}
      >
        error
      </Button>

      <Button
        onClick={() => {
          Message.question({
            content: 'This is question Message',
            close: true,
          });
        }}
      >
        question
      </Button>

      <Button
        onClick={() => {
          Message.loading({
            content: 'This is loading Message',
            close: true,
          });
        }}
      >
        loading
      </Button>
    </div>
  );
}
