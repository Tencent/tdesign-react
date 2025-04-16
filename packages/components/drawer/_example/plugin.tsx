import React from 'react';
import { DrawerPlugin, Button, Space, ConfigProvider } from 'tdesign-react';

const buttonStyle = { marginRight: 16 };

export default function PluginModalExample() {
  const showDrawer = () => {
    const myDrawer = DrawerPlugin({
      header: 'Drawer-Plugin',
      body: 'Hi, darling! Do you want to be my lover?',
      onConfirm: ({ e }) => {
        console.log('confirm clicked', e);
        myDrawer.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        myDrawer.hide();
      },
      onCloseBtnClick: ({ e }) => {
        console.log('close btn: ', e);
      },
    });
  };
  const onDrawerPlugin = () => {
    const Drawer = DrawerPlugin({
      header: 'Drawer-Confirm-Plugin',
      body: 'I am a drawer!',
      confirmBtn: 'hello',
      cancelBtn: 'bye',
      size: 'large',
      className: 't-class-drawer--first',
      onConfirm: ({ e }) => {
        console.log('confirm button has been clicked!');
        console.log('e: ', e);
        Drawer.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        Drawer.hide();
      },
    });
  };
  return (
    <Space direction="vertical">
      <p>函数调用方式一：DrawerPlugin(options)</p>
      <p>函数调用方式二：drawer(options)</p>
      <div>
        <Button theme="primary" onClick={showDrawer} style={buttonStyle}>
          DrawerPlugin
        </Button>
        <Button theme="primary" onClick={onDrawerPlugin} style={buttonStyle}>
          drawer
        </Button>
      </div>
    </Space>
  );
}
