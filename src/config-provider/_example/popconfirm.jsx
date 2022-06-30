import React from 'react';
import merge from 'lodash/merge';
import { ConfigProvider, Popconfirm, Button, Space } from 'tdesign-react';
import enConfig from 'tdesign-react/es/locale/en_US';

export default function configDemo() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig = merge(enConfig, {
    popconfirm: {
      confirmBtnTheme: {
        default: 'primary',
        warning: 'warning',
        danger: 'danger',
      },
      confirm: 'OK',
      cancel: {
        theme: 'default',
        variant: 'outline',
        content: 'Cancel',
      },
    },
  });

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Space>
        <Popconfirm theme="default" content="Do you want to delete">
          <Button>Default</Button>
        </Popconfirm>
        <Popconfirm theme="warning" content="Do you want to delete">
          <Button theme="warning">Warning</Button>
        </Popconfirm>
        <Popconfirm theme="danger" content="Do you want to delete">
          <Button theme="danger">Danger</Button>
        </Popconfirm>
      </Space>
    </ConfigProvider>
  );
}
