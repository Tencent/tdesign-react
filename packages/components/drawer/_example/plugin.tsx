import React from 'react';
import { DrawerPlugin, drawer, Button, Space } from 'tdesign-react';

const buttonStyle = { marginRight: 16 };

export default function PluginModalExample() {
  const showDrawerPlugin = () => {
    const drawerNode = DrawerPlugin({
      header: 'Drawer-Plugin',
      body: 'Hi, darling! Do you want to be my lover?',
      onConfirm: ({ e }) => {
        console.log('confirm clicked', e);
        drawerNode.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        drawerNode.hide();
      },
      onCloseBtnClick: ({ e }) => {
        console.log('close btn: ', e);
      },
    });
  };
  const showDrawer = () => {
    const drawerInstance = drawer({
      header: 'Drawer-Confirm-Plugin',
      body: 'I am a drawer!',
      confirmBtn: 'hello',
      cancelBtn: 'bye',
      size: 'large',
      className: 't-class-drawer--first',
      onConfirm: ({ e }) => {
        console.log('confirm button has been clicked!');
        console.log('e: ', e);
        drawerInstance.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        drawerInstance.hide();
      },
    });
  };
  return (
    <Space direction="vertical">
      <p>函数调用方式一：DrawerPlugin(options)</p>
      <p>函数调用方式二：drawer(options)</p>
      <div>
        <Button theme="primary" onClick={showDrawerPlugin} style={buttonStyle}>
          DrawerPlugin
        </Button>
        <Button theme="primary" onClick={showDrawer} style={buttonStyle}>
          drawer
        </Button>
      </div>
    </Space>
  );
}
