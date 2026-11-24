import React from 'react';
import { AddIcon } from 'tdesign-icons-react';
import { Fab } from 'tdesign-mobile-react';

export default function () {
  const onClick = (e) => {
    console.log('click Fab', e);
  };
  const yBounds = [30, 0];  // 0 表示允许贴底部

  return (
    <>
      <Fab
        icon={<AddIcon size={24} />}
        draggable="all"
        style={{ right: '16px', bottom: '32px' }}
        onClick={onClick}
        yBounds={yBounds}
      />
    </>
  );
}
