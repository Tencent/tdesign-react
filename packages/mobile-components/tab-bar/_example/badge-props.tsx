import React, { useState, useEffect } from 'react';
import { TabBar, TabBarItem } from 'tdesign-mobile-react';
import { HomeIcon, AppIcon, ChatIcon, UserIcon } from 'tdesign-icons-react';

function TabBarBaseDemo() {
  const list = [
    { name: 'label_1', text: '首页', icon: <HomeIcon />, badgeProps: { count: 16 }, ariaLabel: '首页，有16条消息' },
    { name: 'label_2', text: '软件', icon: <AppIcon />, badgeProps: { dot: true }, ariaLabel: '软件，有新的消息' },
    { name: 'label_3', text: '聊天', icon: <ChatIcon />, badgeProps: { count: 'New' }, ariaLabel: '聊天，New' },
    { name: 'label_4', text: '我的', icon: <UserIcon />, badgeProps: { count: '···' }, ariaLabel: '我的，有很多消息' },
  ];
  const [value, setValue] = useState('label_1');

  const change = ({ value: changeValue }) => {
    setValue(changeValue);
    console.log('TabBar 值改变为：', changeValue);
  };

  useEffect(() => {
    console.log('当前值：', value);
  }, [value]);

  return (
    <div className="demo-tab-bar">
      <TabBar value={value} onChange={change} fixed={false} split={false}>
        {list.map((item, i) => (
          <TabBarItem key={item.name || i} icon={item.icon} value={item.name} badgeProps={item.badgeProps}>
            {item.text}
          </TabBarItem>
        ))}
      </TabBar>
    </div>
  );
}

export default TabBarBaseDemo;
