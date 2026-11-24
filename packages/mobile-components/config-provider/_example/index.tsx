import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import OtherEn from './other-en';
import TableEn from './table-en';
import UploadEn from './upload-en';

import './style/index.less';

export default function EmptyDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="ConfigProvider 全局特性配置"
        summary="全局特性配置包含各个组件的文本语言配置及其他通用配置，可以减少重复的通用配置。"
      />
      <TDemoBlock title="01 配置示例" summary="Upload">
        <UploadEn />
      </TDemoBlock>
      <TDemoBlock summary="Table">
        <TableEn />
      </TDemoBlock>
      <TDemoBlock summary="其他组件">
        <OtherEn />
      </TDemoBlock>
    </div>
  );
}
