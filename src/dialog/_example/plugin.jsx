import React from 'react';
import { DialogPlugin, Button, Space } from 'tdesign-react';

const buttonStyle = { marginRight: 16 };

export default function PluginModalExample() {
  const showDialog = () => {
    const myDialog = DialogPlugin({
      header: 'Dialog-Plugin',
      body: 'Hi, darling! Do you want to be my lover?',
      onConfirm: ({ e }) => {
        console.log('confirm clicked', e);
        myDialog.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        myDialog.hide();
      },
    });
  };
  const handleDN = () => {
    const dialogNode = DialogPlugin({
      header: 'Dialog-Plugin',
      body: 'Hi, darling! Do you want to be my lover?',
    });
    dialogNode.update({
      header: 'Updated-Dialog-Plugin',
      cancelBtn: null,
      onConfirm: ({ e }) => {
        console.log('confirm button has been clicked!');
        console.log('e: ', e);
        dialogNode.hide();
        dialogNode.destroy();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        dialogNode.hide();
      },
    });
  };
  const onConfirm = () => {
    const confirmDia = DialogPlugin.confirm({
      header: 'Dialog-Confirm-Plugin',
      body: 'Are you sure to delete it?',
      confirmBtn: 'ok',
      cancelBtn: 'cancel',
      onConfirm: ({ e }) => {
        console.log('confirm button has been clicked!');
        console.log('e: ', e);
        confirmDia.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        confirmDia.hide();
      },
    });
  };
  const onAlert = () => {
    const alertDia = DialogPlugin.alert({
      header: 'Dialog-Alert-Plugin',
      body: 'Notice: Your balance is going to be empty.',
      confirmBtn: {
        content: 'Got it!',
        variant: 'base',
        theme: 'danger',
      },
      onConfirm: ({ e }) => {
        console.log('confirm e: ', e);
        alertDia.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('close e: ', e);
        console.log('trigger: ', trigger);
        alertDia.hide();
      },
    });
  };
  const onDialogPluginConfirm = () => {
    const confirmDia = DialogPlugin.confirm({
      header: 'Dialog-Confirm-Plugin',
      body: 'Are you sure to delete it?',
      confirmBtn: 'ok',
      cancelBtn: 'cancel',
      onConfirm: ({ e }) => {
        console.log('confirm button has been clicked!');
        console.log('e: ', e);
        confirmDia.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        confirmDia.hide();
      },
    });
  };
  return (
    <Space direction="vertical">
      <p>函数调用方式一：DialogPlugin(options)</p>
      <p>函数调用方式二：DialogPlugin.confirm(options)</p>
      <p>函数调用方式三：DialogPlugin.alert(options)</p>
      <div>
        <Button theme="primary" onClick={showDialog} style={buttonStyle}>
          dialog
        </Button>
        <Button theme="primary" onClick={handleDN} style={buttonStyle}>
          handleDialogNode
        </Button>
        <Button theme="primary" onClick={onConfirm} style={buttonStyle}>
          confirm
        </Button>
        <Button theme="primary" onClick={onAlert} style={buttonStyle}>
          alert
        </Button>
        <Button theme="primary" onClick={onDialogPluginConfirm} style={buttonStyle}>
          DialogPlugin.confirm
        </Button>
      </div>
    </Space>
  );
}
