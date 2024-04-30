import React from 'react';
import { Anchor } from 'tdesign-react';

const { AnchorItem } = Anchor;

export default function AnchorBase() {
  const handleClick = ({ e, href, title }) => {
    console.log('handleClick', e, href, title);
  };
  const handleChange = (currentLink, prevLink) => {
    console.log('currentLink', currentLink, 'prevLink', prevLink);
  };
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1' }}></div>
      <Anchor onClick={handleClick} onChange={handleChange} targetOffset={150} affixProps={{ offsetTop: 150 }}>
        <AnchorItem href="#基础锚点" title="基础锚点" />
        <AnchorItem href="#多级锚点" title="多级锚点" />
        <AnchorItem href="#指定容器锚点" title="指定容器锚点" />
        <AnchorItem href="#特定交互锚点" title="特定交互锚点" />
        <AnchorItem href="#尺寸" title="尺寸"></AnchorItem>
      </Anchor>
    </div>
  );
}
