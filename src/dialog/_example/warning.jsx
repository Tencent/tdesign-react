import React, { useState } from 'react';
import { ErrorCircleFilledIcon, CheckIcon, ClearCircleFilledIcon } from '@tencent/tdesign-react';
import { Dialog, Button } from '@tencent/tdesign-react';

export default function warningExample() {
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const [visibleWaring, setVisibleWaring] = useState(false);
  const [visibleError, setVisibleError] = useState(false);

  const onClickConfirm = () => {
    setVisibleConfirm(true);
  };
  const onSuccess = () => {
    setVisibleSuccess(true);
  };
  const onWaring = () => {
    setVisibleWaring(true);
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
    setVisibleWaring(false);
  };
  const onCloseError = () => {
    setVisibleError(false);
  };
  return (
    <div>
      <Button theme="primary" onClick={onClickConfirm} style={{ marginRight: 16 }}>
        提示反馈
      </Button>
      <Button theme="primary" onClick={onSuccess} style={{ marginRight: 16 }}>
        成功反馈
      </Button>
      <Button theme="primary" onClick={onWaring} style={{ marginRight: 16 }}>
        警示反馈
      </Button>
      <Button theme="primary" onClick={onError} style={{ marginRight: 16 }}>
        错误反馈
      </Button>

      <Dialog
        header={
          <>
            <ErrorCircleFilledIcon size="2em" />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visibleConfirm}
        onClose={onCloseConfirm}
      ></Dialog>

      <Dialog
        header={
          <>
            <CheckIcon size="2em" />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visibleSuccess}
        onClose={onCloseSuccess}
      ></Dialog>
      <Dialog
        header={
          <>
            <ErrorCircleFilledIcon size="2em" />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visibleWaring}
        onClose={onCloseWraing}
      ></Dialog>
      <Dialog
        header={
          <>
            <ClearCircleFilledIcon size="2em" />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visibleError}
        onClose={onCloseError}
      ></Dialog>
    </div>
  );
}
