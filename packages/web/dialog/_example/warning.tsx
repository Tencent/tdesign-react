import React, { useState } from 'react';
import { Dialog, Button, Space } from 'tdesign-react';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';

export default function WarningExample() {
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [visibleError, setVisibleError] = useState(false);

  const onClickConfirm = () => {
    setVisibleConfirm(true);
  };
  const onSuccess = () => {
    setVisibleSuccess(true);
  };
  const onWarning = () => {
    setVisibleWarning(true);
  };
  const onError = () => {
    setVisibleError(true);
  };
  const onCloseConfirm = () => {
    setVisibleConfirm(false);
  };
  const onCloseSuccess = () => {
    setVisibleSuccess(false);
  };
  const onCloseWraing = () => {
    setVisibleWarning(false);
  };
  const onCloseError = () => {
    setVisibleError(false);
  };
  return (
    <Space breakLine>
      <Button theme="primary" onClick={onClickConfirm}>
        提示反馈
      </Button>
      <Button theme="primary" onClick={onSuccess}>
        成功反馈
      </Button>
      <Button theme="primary" onClick={onWarning}>
        警示反馈
      </Button>
      <Button theme="primary" onClick={onError}>
        错误反馈
      </Button>

      <Dialog header="提示" theme="info" cancelBtn={false} visible={visibleConfirm} onClose={onCloseConfirm}></Dialog>

      <Dialog
        theme="success"
        header="成功"
        cancelBtn={false}
        visible={visibleSuccess}
        onClose={onCloseSuccess}
      ></Dialog>
      <Dialog theme="warning" header="警示" cancelBtn={false} visible={visibleWarning} onClose={onCloseWraing}></Dialog>
      <Dialog
        header={
          <>
            <CloseCircleFilledIcon style={{ color: 'rgb(227, 77, 89)' }} />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        cancelBtn={false}
        visible={visibleError}
        onClose={onCloseError}
      ></Dialog>
    </Space>
  );
}
