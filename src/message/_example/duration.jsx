import React, { useState } from "react";
import { Button, Message } from 'tdesign-react';

let message = null;

export default function () {
  const list = useState([]);

  return (
    <div className="tdesign-demo-block-row">
      <Button
        onClick={() => {
          message = Message.info('I am duration 20s Message', 20 * 1000);
          list.unshift(message);
        }}
      >
        I am duration 20s Message
      </Button>
      <Button
        onClick={() => {
          if (list.length !== 0) {
            Message.close(list.shift());
          }
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
