import React, { useState } from 'react';
import { Button } from 'tdesign-mobile-react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import BaseList from './base';
import ErrTipDemo from './err-tip';
import PullRefreshDemo from './pull-refresh';

import './style/index.less';

export default function ListDemo() {
  const [currentTab, setCurrentTab] = useState('info');

  const onChangeTab = (val) => {
    setCurrentTab(val);
    history.pushState({}, '', '?tab=demo');
  };

  return (
    <div className="tdesign-mobile-demo">
      <div className="list-demo">
        {currentTab === 'info' && (
          <div>
            <TDemoHeader
              title="List 列表"
              summary="瀑布流滚动加载，用于展示同一类型信息的长列表。当列表即将滚动到底部时，会触发事件并加载更多列表项。"
            />
            <TDemoBlock title="01 组件类型" summary="基础列表">
              <Button size="large" variant="outline" theme="primary" onClick={() => onChangeTab('base')}>
                {' '}
                基础列表{' '}
              </Button>
              <Button size="large" variant="outline" theme="primary" onClick={() => onChangeTab('pull-refresh')}>
                下拉刷新
              </Button>
              <Button size="large" variant="outline" theme="primary" onClick={() => onChangeTab('error-tip')}>
                错误提示
              </Button>
            </TDemoBlock>
          </div>
        )}
        {currentTab === 'base' && <BaseList></BaseList>}
        {currentTab === 'error-tip' && <ErrTipDemo></ErrTipDemo>}
        {currentTab === 'pull-refresh' && (
          <div className="pull-refresh-wrap">
            <PullRefreshDemo />
          </div>
        )}
      </div>
    </div>
  );
}
