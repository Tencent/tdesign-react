import React, { useState } from 'react';
import { Drawer, Button } from 'tdesign-mobile-react';

const titleList = [
  { key: 1, value: '标题', text: '小标题抽屉' },
  { key: 2, value: <div style={{ fontSize: '24px' }}>标题</div>, text: '大标题抽屉' },
] as const;

export default function Base() {
  const [openBase, setOpenBase] = useState(false);
  const [title, setTitle] = useState<string | React.ReactElement>('标题');

  const onClose = (e) => {
    console.log(e, 'e');
    setOpenBase(false);
  };

  const baseSidebar = [
    {
      title: '菜单一',
    },
    {
      title: '菜单二',
    },
    {
      title: '菜单三',
    },
    {
      title: '菜单四',
    },
    {
      title: '菜单五',
    },
    {
      title: '菜单六',
    },
  ];

  return (
    <>
      {titleList.map((item) => (
        <Button
          key={item.key}
          theme="primary"
          size="large"
          variant="outline"
          block
          onClick={() => {
            setOpenBase(!openBase);
            setTitle(item.value);
          }}
          style={{ margin: '16px 0' }}
        >
          {item.text}
        </Button>
      ))}
      <Drawer
        visible={openBase}
        items={baseSidebar}
        title={title}
        placement="left"
        closeOnOverlayClick
        onClose={onClose}
      />
    </>
  );
}
