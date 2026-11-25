import React from 'react';
import { TabBar, TabBarItem } from 'tdesign-mobile-react';

function TabBarBaseDemo() {
  const list = [
    {
      value: 'home',
      label: '首页',
      icon: 'home',
    },
    {
      value: 'app',
      label: '应用',
      icon: 'app',
    },
    {
      value: 'user',
      label: '我的',
      children: [
        {
          value: 'info',
          label: '基本信息',
        },
        {
          value: 'home-page',
          label: '个人主页',
        },
        {
          value: 'setting',
          label: '设置',
        },
      ],
    },
  ];

  return (
    <div className="demo-tab-bar">
      <TabBar defaultValue="home" theme="tag" fixed={false} split={false}>
        {list.map((item, i) => (
          <TabBarItem key={item.value || i} value={item.value} subTabBar={item.children}>
            {item.label}
          </TabBarItem>
        ))}
      </TabBar>
    </div>
  );
}

export default TabBarBaseDemo;
