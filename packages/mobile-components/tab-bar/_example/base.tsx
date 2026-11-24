import React, { useState, useEffect } from 'react';
import { TabBar, TabBarItem } from 'tdesign-mobile-react';
import { HomeIcon, AppIcon, ChatIcon, UserIcon } from 'tdesign-icons-react';

function TabBarBaseDemo() {
  const list = [
    { value: 'label_1', label: '首页', icon: <HomeIcon /> },
    { value: 'label_2', label: '应用', icon: <AppIcon /> },
    { value: 'label_3', label: '聊天', icon: <ChatIcon /> },
    { value: 'label_4', label: '我的', icon: <UserIcon /> },
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
      <TabBar value={value} onChange={change} theme="tag" fixed={false} split={false}>
        {list.map((item, i) => (
          <TabBarItem key={item.value || i} icon={item.icon} value={item.value}>
            {item.label}
          </TabBarItem>
        ))}
      </TabBar>
    </div>
  );
}

export default TabBarBaseDemo;
