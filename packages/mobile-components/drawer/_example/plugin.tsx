import React from 'react';
import { Button, DrawerPlugin } from 'tdesign-mobile-react';

export default function Base() {
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

  const showDrawer = () => {
    const instance = DrawerPlugin({
      items: baseSidebar,
      onItemClick(index: number) {
        console.log(index);
        instance.destroy();
      },
    });
    instance.show();
  };

  return (
    <Button theme="primary" size="large" variant="outline" block onClick={showDrawer}>
      命令行调用
    </Button>
  );
}
