import React, { useState } from 'react';
import { Dialog, Button, DialogProps, Input } from 'tdesign-mobile-react';

const InputUsage = React.memo(() => {
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
            closeOnOverlayClick: true,
            content: (
              <>
                <Input placeholder="请输入文字" />
              </>
            ),
            confirmBtn: {
              content: '确认',
              variant: 'text',
              size: 'large',
            },
            cancelBtn: {
              content: '取消',
              variant: 'text',
              size: 'large',
            },
          });
        }}
      >
        输入类-无描述
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
            closeOnOverlayClick: true,
            content: (
              <>
                <p>告知当前状态、信息和解决方法等，描述文案尽可能控制在三行内</p>
                <Input placeholder="请输入文字" />
              </>
            ),
            confirmBtn: {
              content: '确认',
              variant: 'text',
              size: 'large',
            },
            cancelBtn: {
              content: '取消',
              variant: 'text',
              size: 'large',
            },
          });
        }}
      >
        输入类-带描述
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

export default InputUsage;
