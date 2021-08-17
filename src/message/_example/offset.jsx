import React, { useState } from "react";
import { Button, Message, Input } from "@tencent/tdesign-react";

export default function () {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  return (
    <div className="message-element">
      <Input
        theme="column"
        style={{ width: 200 }}
        placeholder={"请输入横向偏移量"}
        value={offsetX}
        onChange={(value) => {
          setOffsetX(value);
        }}
      />
      <Input
        theme="column"
        style={{ width: 200, marginLeft: 16 }}
        placeholder={"请输入纵向偏移量"}
        value={offsetY}
        onChange={(value) => {
          setOffsetY(value);
        }}
      />
      <div style={{ marginTop: 16 }}>
        <Button
          onClick={() => {
            Message.info({
              content: "用户表示普通操作信息提示",
              placement: 'center',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          center
        </Button>
        <Button
          onClick={() => {
            Message.info({
              content: "用户表示普通操作信息提示",
              placement: "top",
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          top
        </Button>
        <Button
          onClick={() => {
            Message.info({
              content: "用户表示普通操作信息提示",
              placement: "left",
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          left
        </Button>
        <Button
          onClick={() => {
            Message.info({
              content: "用户表示普通操作信息提示",
              placement: "right",
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          right
        </Button>
        <Button
          onClick={() => {
            Message.info({
              content: "用户表示普通操作信息提示",
              placement: "bottom",
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          bottom
        </Button>
        <Button
          onClick={() => {
            Message.info({
              content: "用户表示普通操作信息提示",
              placement: "top-left",
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          top-left
        </Button>
        <Button
          onClick={() => {
            Message.info({
              content: "用户表示普通操作信息提示",
              placement: "top-right",
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          top-right
        </Button>
        <Button
          onClick={() => {
            Message.info({
              content: "用户表示普通操作信息提示",
              placement: "bottom-left",
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          bottom-left
        </Button>
        <Button
          onClick={() => {
            Message.info({
              content: "用户表示普通操作信息提示",
              placement: "bottom-right",
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          bottom-right
        </Button>
      </div>
    </div>
  );
}
