import React from 'react';
import { Anchor, AnchorLink } from '@tencent/tdesign-react';
// const list = [
//   {
//     href: '/#default',
//     title: '默认',
//   },
//   {
//     href: '/#leveln',
//     title: '多级锚点',
//   },
//   {
//     href: '/#size',
//     title: '尺寸大小',
//     children: [
//       {
//         href: '#size-l',
//         title: '尺寸-大',
//       },
//       {
//         href: '#size-s',
//         title: '尺寸-小',
//       },
//       {
//         href: '#size-d',
//         title: '尺寸-默认',
//       },
//     ],
//   },
// ];
export default function AnchorBase() {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <h4 id="default">基础</h4>{' '}
        <Anchor>
          <AnchorLink href="/#/components/anchor/#default" title="默认" />
          <AnchorLink href="/#/components/anchor/#leveln" title="多级锚点" />
          <AnchorLink href="/#/components/anchor/#size" title="尺寸大小"></AnchorLink>
        </Anchor>
      </div>
    </>
  );
}
