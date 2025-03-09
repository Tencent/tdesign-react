import React from 'react';
import { Button, MessagePlugin, Space } from 'tdesign-react';

export default function () {
  return (
    <Space>
      <Button
        onClick={() => {
          MessagePlugin.info({
            content: 'This is info Message',
            closeBtn: true,
          });
        }}
      >
        info
      </Button>

      <Button
        onClick={() => {
          MessagePlugin.success({
            content: 'This is success Message',
            closeBtn: true,
          });
        }}
      >
        success
      </Button>

      <Button
        onClick={() => {
          MessagePlugin.warning({
            content: 'This is warning Message',
            closeBtn: true,
          });
        }}
      >
        warning
      </Button>

      <Button
        onClick={() => {
          MessagePlugin.error({
            content: 'This is error Message',
            closeBtn: true,
          });
        }}
      >
        error
      </Button>

      <Button
        onClick={() => {
          MessagePlugin.question({
            content: 'This is question Message',
            closeBtn: true,
          });
        }}
      >
        question
      </Button>

      <Button
        onClick={() => {
          MessagePlugin.loading({
            content: 'This is loading Message',
            closeBtn: true,
          });
        }}
      >
        loading
      </Button>
    </Space>
  );
}
