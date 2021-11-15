import React from "react";
import { Message, Button } from "tdesign-react";

export default function () {
  return (
    <div className="tdesign-demo-block-row">
      <Button
        onClick={() => {
          Message.info("这是第一条消息");
          Message.warning("这是第二条消息");
          Message.error("这是第三条消息");
        }}
      >
        点击打开多个消息
      </Button>

      <Button
        onClick={() => {
          Message.closeAll();
        }}
      >
        点击关闭所有消息
      </Button>
    </div>
  );
}
