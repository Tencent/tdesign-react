import React, { useState } from 'react';
import { Button, ActionSheet } from 'tdesign-mobile-react';
import { EnterIcon, BookmarkIcon, PinIcon, CloudUploadIcon } from 'tdesign-icons-react';

export default function ListExample() {
  const [alignCenterVisible, setAlignCenterVisible] = useState(false);
  const [alignLeftVisible, setAlignLeftVisible] = useState(false);
  const items = [
    {
      label: 'Move',
      icon: () => <EnterIcon />,
    },
    {
      label: 'Mark as important',
      icon: <BookmarkIcon />,
    },
    {
      label: 'Unsubscribe',
      icon: <PinIcon />,
    },
    {
      label: 'Add to Tasks',
      icon: <CloudUploadIcon />,
    },
  ];
  return (
    <div className="action-sheet-demo">
      <div className="action-sheet-demo-btns">
        <Button block size="large" variant="outline" theme="primary" onClick={() => setAlignCenterVisible(true)}>
          居中列表型
        </Button>
        <Button block size="large" variant="outline" theme="primary" onClick={() => setAlignLeftVisible(true)}>
          左对齐列表型
        </Button>
      </div>
      <ActionSheet
        align="center"
        visible={alignCenterVisible}
        description="Email Settings"
        cancelText="cancel"
        items={items}
        onClose={() => {
          setAlignCenterVisible(false);
        }}
        onCancel={() => {
          setAlignCenterVisible(false);
        }}
      />
      <ActionSheet
        align="left"
        visible={alignLeftVisible}
        description="Email Settings"
        cancelText="cancel"
        items={items}
        onClose={() => {
          setAlignLeftVisible(false);
        }}
        onCancel={() => {
          setAlignLeftVisible(false);
        }}
      />
    </div>
  );
}
