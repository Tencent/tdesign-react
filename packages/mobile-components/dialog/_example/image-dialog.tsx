import React, { useState } from 'react';
import { Dialog, Button, DialogProps, Image } from 'tdesign-mobile-react';

const ImageUsage = React.memo(() => {
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
            content: '告知当前状态、信息和解决方法',
            confirmBtn: '确认',
            cancelBtn: '取消',
            top: <Image src="https://tdesign.gtimg.com/mobile/demos/dialog1.png" fit="contain" />,
          });
        }}
      >
        图片置顶-带标题描述
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
            closeOnOverlayClick: true,
            content: '告知当前状态、信息和解决方法',
            confirmBtn: '确认',
            cancelBtn: '取消',
            top: <Image src="https://tdesign.gtimg.com/mobile/demos/dialog1.png" fit="contain" />,
          });
        }}
      >
        图片置顶-无标题
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
            confirmBtn: '确认',
            cancelBtn: '取消',
            top: <Image src="https://tdesign.gtimg.com/mobile/demos/dialog1.png" fit="contain" />,
          });
        }}
      >
        图片置顶-纯标题
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
            closeOnOverlayClick: true,
            confirmBtn: '确认',
            cancelBtn: '取消',
            top: <Image src="https://tdesign.gtimg.com/mobile/demos/dialog1.png" fit="contain" />,
          });
        }}
      >
        图片置顶-纯图片
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
            content: '告知当前状态、信息和解决方法',
            confirmBtn: '确认',
            cancelBtn: '取消',
            middle: <Image src="https://tdesign.gtimg.com/mobile/demos/dialog1.png" fit="contain" />,
          });
        }}
      >
        图片居中-带标题描述
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
            closeOnOverlayClick: true,
            confirmBtn: '确认',
            cancelBtn: '取消',
            middle: <Image src="https://tdesign.gtimg.com/mobile/demos/dialog1.png" fit="contain" />,
          });
        }}
      >
        图片居中-纯标题
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

export default ImageUsage;
