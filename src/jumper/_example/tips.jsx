import React from 'react';
import { Jumper } from 'tdesign-react';

export default function DemoJumper() {
  const tips = { prev: '前尘忆梦', current: '回到现在', next: '展望未来' };
  return <Jumper tips={tips} />;
}
