import React, { useState } from 'react';
import { Button, Result } from 'tdesign-mobile-react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import CustomResult from './custom';
import ThemeResult from './theme';
import './style/index.less';

export default function ResultDemo() {
  const [showResultPage, setShowResultPage] = useState(false);
  return (
    <>
      {!showResultPage ? (
        <div className="tdesign-mobile-demo">
          <TDemoHeader title="Result 结果" summary="用于反馈不同结果的展示。" />
          <TDemoBlock title="组件类型" summary="基础结果">
            <ThemeResult />
          </TDemoBlock>
          <TDemoBlock title="" summary="自定义结果">
            <CustomResult />
          </TDemoBlock>
          <TDemoBlock title="" summary="页面示例">
            <div className="padding">
              <Button block size="large" variant="outline" theme="primary" onClick={() => setShowResultPage(true)}>
                页面位置展示
              </Button>
            </div>
          </TDemoBlock>
        </div>
      ) : (
        <div className="result-page">
          <div className="demo-section__wrapper">
            <Result theme="success" title="成功状态" description="描述文字" />
          </div>
          <div className="demo-section__wrapper">
            <Button size="large" variant="outline" block theme="primary" onClick={() => setShowResultPage(false)}>
              返回
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
