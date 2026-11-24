import React, { useState } from 'react';
import { Dialog, Button, DialogProps } from 'tdesign-mobile-react';

const Feedback = React.memo(() => {
  const [alertProps, setAlertProps] = useState({ visible: false } as DialogProps);

  return (
    <div className="t-dialog__demo-wrap">
      <Button
        variant="outline"
        size="large"
        theme="primary"
        block
        onClick={() => {
          setAlertProps({
            visible: true,
            title: '对话框标题',
            content: '告知当前状态、信息等内容。描述文案尽可能控制在三行内',
            confirmBtn: '知道了',
            closeOnOverlayClick: false,
          });
        }}
      >
        反馈类-带标题
      </Button>
      <div className="btn-gap"></div>
      <Button
        variant="outline"
        size="large"
        theme="primary"
        block
        onClick={() => {
          setAlertProps({
            visible: true,
            content: '告知当前状态、信息和解决方法，等内容。描述文案尽可能控制在三行内',
            confirmBtn: '知道了',
            closeOnOverlayClick: false,
          });
        }}
      >
        反馈类-无标题
      </Button>
      <div className="btn-gap"></div>
      <Button
        variant="outline"
        size="large"
        theme="primary"
        block
        onClick={() => {
          setAlertProps({
            visible: true,
            title: '对话框标题',
            confirmBtn: '知道了',
          });
        }}
      >
        反馈类-纯标题
      </Button>
      <div className="btn-gap"></div>
      <Button
        variant="outline"
        size="large"
        theme="primary"
        block
        onClick={() => {
          setAlertProps({
            visible: true,
            title: '对话框标题',
            content:
              '这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案.这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案.这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案.这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案.这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案，这里是辅助内容文案.',
            confirmBtn: '知道了',
          });
        }}
      >
        反馈类-内容超长
      </Button>
      <Dialog
        {...alertProps}
        closeOnOverlayClick={true}
        onClose={() => {
          setAlertProps({ ...alertProps, visible: false });
        }}
        onConfirm={() => {
          setAlertProps({ ...alertProps, visible: false });
        }}
      />
    </div>
  );
});

export default Feedback;
