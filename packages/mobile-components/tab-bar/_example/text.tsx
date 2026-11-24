import React, { useState, useEffect } from 'react';
import { TabBar, TabBarItem } from 'tdesign-mobile-react';

function TabBarBaseDemo() {
  const list = [
    { value: 'home', label: '首页' },
    { value: 'app', label: '应用' },
    { value: 'chat', label: '聊天' },
    { value: 'user', label: '我的' },
  ];
  const [value, setValue] = useState('home');

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
          <TabBarItem key={item.value || i} value={item.value}>
            {item.label}
          </TabBarItem>
        ))}
      </TabBar>
    </div>
  );
}

export default TabBarBaseDemo;
