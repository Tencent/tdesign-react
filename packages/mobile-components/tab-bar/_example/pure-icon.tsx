import React, { useState, useEffect } from 'react';
import { TabBar, TabBarItem } from 'tdesign-mobile-react';
import { HomeIcon, AppIcon, ChatIcon, UserIcon } from 'tdesign-icons-react';

function TabBarBaseDemo() {
  const list = [
    { value: 'label_1', icon: <HomeIcon />, ariaLabel: '首页' },
    { value: 'label_2', icon: <AppIcon />, ariaLabel: '软件' },
    { value: 'label_3', icon: <ChatIcon />, ariaLabel: '聊天' },
    { value: 'label_4', icon: <UserIcon />, ariaLabel: '我的' },
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
      <TabBar value={value} theme="tag" fixed={false} split={false} onChange={change}>
        {list.map((item, i) => (
          <TabBarItem key={item.value || i} icon={item.icon} value={item.value} />
        ))}
      </TabBar>
    </div>
  );
}

export default TabBarBaseDemo;
