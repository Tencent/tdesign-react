import React, { useState } from 'react';
import { Drawer, Button } from 'tdesign-mobile-react';
import { AppIcon } from 'tdesign-icons-react';

export default function IconPage() {
  const [openBase, setOpenBase] = useState(false);

  const onClose = (e) => {
    console.log(e, 'e');
    setOpenBase(false);
  };

  const baseSidebar = [
    {
      title: '菜单一',
      icon: <AppIcon />,
    },
    {
      title: '菜单二',
      icon: <AppIcon />,
    },
    {
      title: '菜单三',
      icon: <AppIcon />,
    },
    {
      title: '菜单四',
      icon: <AppIcon />,
    },
    {
      title: '菜单五',
      icon: <AppIcon />,
    },
    {
      title: '菜单六',
      icon: <AppIcon />,
    },
  ];

  return (
    <>
      <Button
        theme="primary"
        size="large"
        variant="outline"
        block
        onClick={() => {
          setOpenBase(!openBase);
        }}
      >
        带图标抽屉
      </Button>
      <Drawer visible={openBase} items={baseSidebar} closeOnOverlayClick onClose={onClose} />
    </>
  );
}
