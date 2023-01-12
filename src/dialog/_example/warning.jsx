import React, { useState } from 'react';
import { Dialog, Button } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

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
    <>
      <Button theme="primary" onClick={onClickConfirm} style={{ marginRight: 16 }}>
        提示反馈
      </Button>
      <Button theme="primary" onClick={onSuccess} style={{ marginRight: 16 }}>
        成功反馈
      </Button>
      <Button theme="primary" onClick={onWarning} style={{ marginRight: 16 }}>
        警示反馈
      </Button>
      <Button theme="primary" onClick={onError} style={{ marginRight: 16 }}>
        错误反馈
      </Button>

      <Dialog
        header={
          <>
            <ErrorCircleFilledIcon style={{ color: '#3881E8' }} />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visibleConfirm}
        onClose={onCloseConfirm}
      ></Dialog>

      <Dialog
        header={
          <>
            <CheckCircleFilledIcon style={{ color: '#00A870' }} />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visibleSuccess}
        onClose={onCloseSuccess}
      ></Dialog>
      <Dialog
        header={
          <>
            <ErrorCircleFilledIcon style={{ color: '#ED7B2F' }} />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visibleWarning}
        onClose={onCloseWraing}
      ></Dialog>
      <Dialog
        header={
          <>
            <CloseCircleFilledIcon style={{ color: 'rgb(227, 77, 89)' }} />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visibleError}
        onClose={onCloseError}
      ></Dialog>
    </>
  );
}
