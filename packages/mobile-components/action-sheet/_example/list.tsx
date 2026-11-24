import React, { useState } from 'react';
import { Button, ActionSheet } from 'tdesign-mobile-react';
import { EnterIcon, PinIcon, BookmarkIcon, CloudUploadIcon } from 'tdesign-icons-react';

export default function ListExample() {
  const [normalVisible, setNormalVisible] = useState(false);
  const [descVisible, setDescVisible] = useState(false);
  const [iconVisible, setIconVisible] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);

  const openByMethod = () => {
    ActionSheet.show({
      items: ['Move', 'Mark as important', 'Unsubscribe', 'Add to Tasks'],
      onClose() {
        ActionSheet.close();
      },
      onCancel() {
        ActionSheet.close();
      },
      onSelected() {
        ActionSheet.close();
      },
    });
  };

  return (
    <div className="action-sheet-demo">
      <div className="action-sheet-demo-btns">
        <Button block size="large" variant="outline" theme="primary" onClick={() => setNormalVisible(true)}>
          常规列表型
        </Button>
        <Button block size="large" variant="outline" theme="primary" onClick={() => openByMethod()}>
          函数调用
        </Button>
        <Button block size="large" variant="outline" theme="primary" onClick={() => setDescVisible(true)}>
          带描述列表型
        </Button>
        <Button block size="large" variant="outline" theme="primary" onClick={() => setIconVisible(true)}>
          带图标列表型
        </Button>
        <Button block size="large" variant="outline" theme="primary" onClick={() => setBadgeVisible(true)}>
          带徽标列表型
        </Button>
      </div>

      <ActionSheet
        visible={normalVisible}
        cancelText="cancel"
        items={['Move', 'Mark as important', 'Unsubscribe', 'Add to Tasks']}
        onClose={() => {
          setNormalVisible(false);
        }}
        onCancel={() => {
          setNormalVisible(false);
        }}
      />
      <ActionSheet
        visible={descVisible}
        description="Email Settings"
        cancelText="cancel"
        items={['Move', 'Mark as important', 'Unsubscribe', 'Add to Tasks']}
        onClose={() => {
          setDescVisible(false);
        }}
        onCancel={() => {
          setDescVisible(false);
        }}
      />
      <ActionSheet
        visible={iconVisible}
        cancelText="cancel"
        items={[
          {
            label: 'Move',
            icon: <EnterIcon />,
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
        ]}
        onClose={() => {
          setIconVisible(false);
        }}
        onCancel={() => {
          setIconVisible(false);
        }}
      />
      <ActionSheet
        visible={badgeVisible}
        description="Email Settings"
        cancelText="cancel"
        items={[
          {
            label: 'Move',
            badge: { dot: true },
          },
          {
            label: 'Mark as important',
            badge: { count: 8, offset: [-6, 2] },
          },
          {
            label: 'Unsubscribe',
            badge: { count: 99, offset: [-6, 2] },
          },
          {
            label: 'Add to Tasks',
            badge: { count: 1000, offset: [-10, 2] },
          },
        ]}
        onClose={() => {
          setBadgeVisible(false);
        }}
        onCancel={() => {
          setBadgeVisible(false);
        }}
      />
    </div>
  );
}
