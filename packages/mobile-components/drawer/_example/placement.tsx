import React, { useState } from 'react';
import { Drawer, Button } from 'tdesign-mobile-react';

const placementList = [
  { key: 1, value: 'left', text: '左侧抽屉' },
  { key: 2, value: 'right', text: '右侧抽屉' },
] as const;

type PlacementValue = (typeof placementList)[number]['value'];

export default function Base() {
  const [openBase, setOpenBase] = useState(false);
  const [placement, setPlacement] = useState<PlacementValue>('left');

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
      <div>
        {placementList.map((item) => (
          <Button
            key={item.key}
            theme="primary"
            size="large"
            variant="outline"
            block
            onClick={() => {
              setOpenBase(!openBase);
              setPlacement(item.value);
            }}
            style={{ margin: '16px 0' }}
          >
            {item.text}
          </Button>
        ))}

        <Drawer
          visible={openBase}
          items={baseSidebar}
          title="标题"
          placement={placement}
          closeOnOverlayClick
          onClose={onClose}
        />
      </div>
    </>
  );
}
