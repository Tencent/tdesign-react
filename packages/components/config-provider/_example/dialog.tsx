import React from 'react';

import { Button, ConfigProvider, DialogCard, DialogPlugin, Space } from 'tdesign-react';
import enConfig from 'tdesign-react/es/locale/en_US';

import type { GlobalConfigProvider } from 'tdesign-react';

export default function configDemo() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig: GlobalConfigProvider = {
    ...enConfig,
    dialog: {
      confirm: 'confirm',
      cancel: 'cancel',
      confirmBtnTheme: {
        default: 'primary',
        info: 'primary',
        warning: 'warning',
        danger: 'danger',
        success: 'success',
      },
    },
    isContextEffectPlugin: true, // 全局配置是否影响函数式调用方法使用的组件
  };

  const showDialog = () => {
    const myDialog = DialogPlugin({
      header: 'Dialog-Plugin',
      body: 'Hi, darling! Do you want to be my lover?',
      onConfirm: () => {
        myDialog.hide();
      },
      onClose: () => {
        myDialog.hide();
      },
    });
  };

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Space direction="vertical">
        <Button theme="primary" onClick={showDialog}>
          Plugin 函数式调用
        </Button>

        <DialogCard header="Title" body="Would you like to be my friends？" theme="default" />

        <DialogCard header="confirm" body="Would you like to be my friends？" theme="info" />

        <DialogCard header="confirm" body="Would you like to be my friends？" theme="warning" />

        <DialogCard header="confirm" body="Would you like to be my friends？" theme="danger" />

        <DialogCard header="confirm" body="Would you like to be my friends？" theme="success" />
      </Space>
    </ConfigProvider>
  );
}
