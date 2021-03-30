import React, { useState } from 'react';
import { Dialog, Button } from '@tencent/tdesign-react';

export default function CustomFooterExample() {
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [visibleBtn, setVisibleBtn] = useState(false);
  const [visibleFooter, setVisibleFooter] = useState(false);

  const handleConfirmClick = () => {
    setVisibleConfirm(true);
  };
  const handleConfirmClose = () => {
    setVisibleConfirm(false);
  };

  const handleBtnClick = () => {
    setVisibleBtn(true);
  };
  const handleBtnClose = () => {
    setVisibleBtn(false);
  };

  const handleFooterClick = () => {
    setVisibleFooter(true);
  };
  const handleFooterClose = () => {
    setVisibleFooter(false);
  };
  return (
    <div>
      <Button theme="primary" onClick={handleConfirmClick} style={{ marginRight: 16 }}>
        只显示确认按钮
      </Button>
      <Button theme="primary" onClick={handleBtnClick} style={{ marginRight: 16 }}>
        自定义按钮内容
      </Button>
      <Button theme="primary" onClick={handleFooterClick} style={{ marginRight: 16 }}>
        自定义内容
      </Button>
      <Dialog header="只显示确认按钮" visible={visibleConfirm} cancelContent={false} onClose={handleConfirmClose}>
        <p>This is a dialog</p>
      </Dialog>
      <Dialog
        header="自定义按钮内容"
        visible={visibleBtn}
        confirmContent="去意已决"
        cancelContent="我再想想"
        onClose={handleBtnClose}
      >
        <p>This is a dialog</p>
      </Dialog>
      <Dialog
        header="自定义footer"
        visible={visibleFooter}
        footer={
          <>
            <div style={{ display: 'inline-block', marginRight: 8 }}>自定义的footer </div>
            <Button theme="primary" onClick={handleFooterClose}>
              好吧
            </Button>
          </>
        }
        onClose={handleFooterClose}
      >
        <p>This is a dialog</p>
      </Dialog>
    </div>
  );
}
