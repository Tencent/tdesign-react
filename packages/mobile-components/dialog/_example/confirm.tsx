import React, { useState } from 'react';
import { Dialog, Button, DialogProps } from 'tdesign-mobile-react';

const ConfirmUsage = React.memo(() => {
  const [alertProps, setAlertProps] = useState({ visible: false } as DialogProps);

  return (
    <div className="t-dialog__demo-wrap">
      {/* 普通调用 */}
      <Button
        variant="outline"
        size="large"
        theme="primary"
        block
        onClick={() => {
          setAlertProps({
            visible: true,
            title: '对话框标题',
            content: '告知当前状态、信息和解决方法，等内容。描述文案尽可能控制在三行内',
            confirmBtn: '确认',
            cancelBtn: '取消',
          });
        }}
      >
        确认类-带标题
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
            confirmBtn: { content: '警示操作', theme: 'danger' },
            cancelBtn: '取消',
            closeOnOverlayClick: true,
          });
        }}
      >
        确认类-无标题
      </Button>
      <Dialog
        {...alertProps}
        onClose={() => {
          setAlertProps({ ...alertProps, visible: false });
        }}
        onConfirm={() => {
          setAlertProps({ ...alertProps, visible: false });
        }}
      />
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
            confirmBtn: '确认',
            cancelBtn: '取消',
          });
        }}
      >
        确认类-纯标题
      </Button>
      <Dialog
        {...alertProps}
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

export default ConfirmUsage;
