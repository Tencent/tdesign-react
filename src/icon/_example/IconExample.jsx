import React from 'react';
import { Icon } from '@tdesign/react/iconfont';

const iconNameList = [
  'bulletpoint',
  'browse-20',
  'close-fill',
  'close',
  'discount',
  'help-fill',
  'more',
  'not-visible-20',
  'loading',
  'search',
  'prompt-fill',
  'success-fill',
  'warning-fill',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'success-2',
];

export default function IconExample() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {iconNameList.map(icon => (
        <div
          key={icon}
          style={{ width: 150, height: 150, textAlign: 'center' }}
        >
          <Icon name={icon} />
          <p style={{ marginTop: 12 }}>{icon}</p>
        </div>
      ))}
    </div>
  );
}
