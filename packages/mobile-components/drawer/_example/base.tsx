import React, { useState } from 'react';
import { Drawer, Button } from 'tdesign-mobile-react';

export default function Base() {
  const [openBase, setOpenBase] = useState(false);

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
      <Button
        theme="primary"
        size="large"
        variant="outline"
        block
        onClick={() => {
          setOpenBase(!openBase);
        }}
      >
        基础抽屉
      </Button>
      <Drawer visible={openBase} items={baseSidebar} closeOnOverlayClick onClose={onClose} />
    </>
  );
}
