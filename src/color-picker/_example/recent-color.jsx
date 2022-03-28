import React from 'react';
import { ColorPicker } from 'tdesign-react';

export default function RecentColor() {
  const color = '#0052d9';
  const recentColors = [
    'red',
    'green',
    'yellow',
    'blue',
    'purple',
    'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    'linear-gradient(45deg, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)',
    'linear-gradient(120deg, #fcc5e4 0%, #fda34b 15%, #ff7882 35%, #c8699e 52%, #7046aa 71%, #0c1db8 87%, #020f75 100%)',
  ];

  return (
    <div className="tdesign-demo-block-row">
      <ColorPicker defaultValue={color} recentColors={recentColors} />
    </div>
  );
}
