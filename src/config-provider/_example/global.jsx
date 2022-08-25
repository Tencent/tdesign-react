/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import merge from 'lodash/merge';
import { ConfigProvider, Space } from 'tdesign-react';
import enConfig from 'tdesign-react/es/locale/en_US';

export default function GlobalDemo() {
  // 全局特性配置，引入英文语言配置包 enConfig
  const globalConfig = merge(enConfig, {
    // 可以在此处定义更多自定义配置，具体可配置内容参看 API 文档
    calendar: {},
    table: {},
    pagination: {},
    // 全局动画设置
    animation: { exclude: [] },
  });

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Space direction="vertical">
        <p>
          使用<code>ConfigProvider</code>包裹业务功能的最外层组件，点击下方图标查看示例代码
        </p>

        <p>
          英文语言包引入路径：<code>import enConfig from 'tdesign-react/es/locale/en_US';</code>
        </p>

        <p>
          中文语言包引入路径：<code>import zhConfig from 'tdesign-react/es/locale/zh_CN';</code>
        </p>

        <p>
          日文语言包引入路径：<code>import jpConfig from 'tdesign-react/es/locale/ja_JP';</code>
        </p>

        <p>
          韩文语言包引入路径：<code>import koConfig from 'tdesign-react/es/locale/ko_KR';</code>
        </p>
      </Space>
    </ConfigProvider>
  );
}
