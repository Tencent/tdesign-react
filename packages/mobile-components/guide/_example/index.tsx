import React from 'react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import BaseDemo from './base';
import NoMask from './no-mask';
import DialogDemo from './dialog';
import PopoverDialogDemo from './popover-dialog';
import CustomPopover from './custom-popover';
import './style/index.less';
import './style/dialog-body.less';
import './style/my-popover.less';

export default function GuideDemo() {
  return (
    <div className="picker-demo" style={{ paddingBottom: 12 }}>
      <TDemoHeader
        title="Guide 引导"
        summary="逐步骤进行指引或解释说明的组件，常用于用户不熟悉的或需进行特别强调的页面。"
      />
      <TDemoBlock title="01 组件类型" summary="基础引导">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="不带遮罩的引导">
        <NoMask />
      </TDemoBlock>
      <TDemoBlock summary="弹窗形式的引导">
        <DialogDemo />
      </TDemoBlock>
      <TDemoBlock summary="气泡与弹窗混合的引导">
        <PopoverDialogDemo />
      </TDemoBlock>
      <TDemoBlock summary="自定义气泡">
        <CustomPopover />
      </TDemoBlock>
    </div>
  );
}
