import React from 'react';
import { Timeline } from 'tdesign-react';

const CommonStyle = {
  fontSize: 12,
  color: 'rgba(0,0,0,.6)',
};

export default function CustomContentTimeLine() {
  return (
    <Timeline mode="same">
      <Timeline.Item label="2022-01-01">
        <div>事件一</div>
        <div style={CommonStyle}>事件一自定义内容</div>
      </Timeline.Item>
      <Timeline.Item label="2022-02-01">
        <div>事件二</div>
        <div style={CommonStyle}>事件二自定义内容</div>
      </Timeline.Item>
      <Timeline.Item label="2022-03-01">
        <div>事件三</div>
        <div style={CommonStyle}>事件三自定义内容</div>
      </Timeline.Item>
      <Timeline.Item label="2022-04-01">
        <div>事件四</div>
        <div style={CommonStyle}>事件四自定义内容</div>
      </Timeline.Item>
    </Timeline>
  );
}
