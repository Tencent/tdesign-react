import React from 'react';
import merge from 'lodash/merge';
import { ConfigProvider, DialogCard, Space } from 'tdesign-react';
import enConfig from 'tdesign-react/es/locale/en_US';

export default function configDemo() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig = merge(enConfig, {
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
  });

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Space direction="vertical">
        <DialogCard header="Title" body="Would you like to be my friends？" theme="default" />

        <DialogCard header="confirm" body="Would you like to be my friends？" theme="info" />

        <DialogCard header="confirm" body="Would you like to be my friends？" theme="warning" />

        <DialogCard header="confirm" body="Would you like to be my friends？" theme="danger" />

        <DialogCard header="confirm" body="Would you like to be my friends？" theme="success" />
      </Space>
    </ConfigProvider>
  );
}
