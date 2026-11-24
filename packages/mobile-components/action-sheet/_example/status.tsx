import React, { useState } from 'react';
import { Button, ActionSheet } from 'tdesign-mobile-react';
import { EnterIcon, BookmarkIcon, PinIcon, CloudUploadIcon } from 'tdesign-icons-react';

export default function ListExample() {
  const [statusVisible, setStatusVisible] = useState(false);

  return (
    <div className="action-sheet-demo">
      <div className="action-sheet-demo-btns">
        <Button block size="large" variant="outline" theme="primary" onClick={() => setStatusVisible(true)}>
          列表型选项状态
        </Button>
      </div>
      <ActionSheet
        visible={statusVisible}
        description="列表型选项状态"
        cancelText="cancel"
        items={[
          {
            label: 'Move',
            icon: <EnterIcon />,
          },
          {
            label: 'Mark as important',
            icon: <BookmarkIcon />,
            color: '#0052D9',
          },
          {
            label: 'Unsubscribe',
            icon: <PinIcon />,
            color: '#E34D59',
          },
          {
            label: 'Add to Tasks',
            icon: <CloudUploadIcon />,
            disabled: true,
          },
        ]}
        onClose={() => {
          setStatusVisible(false);
        }}
        onCancel={() => {
          setStatusVisible(false);
        }}
      />
    </div>
  );
}
