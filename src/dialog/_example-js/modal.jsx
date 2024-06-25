import React, { useState } from 'react';
import { Dialog, DialogCard, Button, Select } from 'tdesign-react';

export default function NotModalExample() {
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [value, setValue] = useState('');

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const handleClose1 = () => {
    setVisible1(false);
  };
  const handleClose2 = () => {
    setVisible2(false);
  };
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <>
      <Button theme="primary" onClick={handleClick} style={{ marginRight: 16 }}>
        模态对话框
      </Button>
      <Button
        theme="primary"
        onClick={() => {
          setVisible1(true);
        }}
        style={{ marginRight: 16 }}
      >
        非模态对话框
      </Button>
      <Button
        theme="primary"
        onClick={() => {
          setVisible2(true);
        }}
        style={{ marginRight: 16 }}
      >
        非模态对话框2
      </Button>

      <Dialog
        width="800"
        header="模态对话框"
        visible={visible}
        onClose={handleClose}
        onCloseBtnClick={() => {
          console.log('on click close btn')
        }}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <p>This is a dialog</p>
      </Dialog>
      <Dialog
        mode="modeless"
        header="非模态对话框"
        draggable={true}
        visible={visible1}
        onClose={handleClose1}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <Select
          value={value}
          onChange={onChange}
          style={{ width: '40%' }}
          clearable
          options={[
            { label: '架构云', value: '1' },
            { label: '大数据', value: '2' },
            { label: '区块链', value: '3' },
            { label: '物联网', value: '4', disabled: true },
            { label: '人工智能', value: '5' },
          ]}
        ></Select>
      </Dialog>
      <Dialog
        mode="modeless"
        header="非模态对话框2"
        draggable={true}
        visible={visible2}
        onClose={handleClose2}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <p>This is a dialog</p>
      </Dialog>
      <DialogCard header="普通对话框">
        <p>This is a dialog</p>
      </DialogCard>
    </>
  );
}
