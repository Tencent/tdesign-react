import React, { useState } from 'react';
import { Dialog, Button, DialogProps } from 'tdesign-mobile-react';

const MultiStateUsage = React.memo(() => {
  const [alertProps, setAlertProps] = useState({ visible: false } as DialogProps);

  const cancelBtn: DialogProps['cancelBtn'] = {
    content: '取消',
    variant: 'text',
    size: 'large',
  };
  const confirmBtn: DialogProps['confirmBtn'] = {
    content: '确认',
    variant: 'text',
    size: 'large',
  };

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
            content: '告知当前状态、信息和解决方法',
            confirmBtn,
            cancelBtn,
          });
        }}
      >
        文字按钮
      </Button>
      <div className="btn-gap"></div>
      <div className="dialog-demo__summary">水平基础按钮</div>
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
            content: '告知当前状态、信息和解决方法，等内容。描述文案尽可能控制在三行内',
            confirmBtn: '确认',
            cancelBtn: '取消',
          });
        }}
      >
        水平基础按钮
      </Button>
      <div className="btn-gap"></div>
      <div className="dialog-demo__summary">垂直基础按钮</div>
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
            content: '告知当前状态、信息和解决方法',
            buttonLayout: 'vertical',
            confirmBtn: '确认',
            cancelBtn: '取消',
          });
        }}
      >
        垂直基础按钮
      </Button>
      <div className="btn-gap"></div>
      <div className="dialog-demo__summary">带关闭按钮的对话框</div>
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
            content: '告知当前状态、信息和解决方法',
            buttonLayout: 'vertical',
            confirmBtn: '确认',
            cancelBtn: '取消',
            closeBtn: true,
          });
        }}
      >
        带关闭按钮的对话框
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

export default MultiStateUsage;
