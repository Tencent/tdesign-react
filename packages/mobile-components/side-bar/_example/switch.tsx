import React, { useState, useRef } from 'react';
import type { SideBarProps, SideBarItemProps } from 'tdesign-mobile-react';
import { SideBar, SideBarItem, Cell, Image } from 'tdesign-mobile-react';

const image = 'https://tdesign.gtimg.com/mobile/demos/example2.png';
const items = new Array(12).fill({ label: '标题文字', image }, 0, 12);

const categories = [
  { label: '选项一', title: '标题一', badgeProps: {}, items },
  { label: '选项二', title: '标题二', badgeProps: { dot: true }, items: items.slice(0, 9) },
  { label: '选项三', title: '标题三', badgeProps: {}, items: items.slice(0, 9) },
  { label: '选项四', title: '标题四', badgeProps: { count: 6 }, items: items.slice(0, 6) },
  { label: '选项五', title: '标题五', badgeProps: {}, items: items.slice(0, 3) },
];

function SideBarWrapper() {
  const [sideBarIndex, setSideBarIndex] = useState<SideBarProps['value']>(1);
  const wrapperRef = useRef(null);

  const onSideBarChange = setSideBarIndex;

  const onSideBarClick = (value: SideBarProps['value'], label: SideBarItemProps['label']) => {
    console.log('=onSideBarClick===', value, label);
  };

  return (
    <>
      <div className="side-bar-wrapper section-switch">
        <SideBar value={sideBarIndex} onClick={onSideBarClick} onChange={onSideBarChange}>
          {categories.map((item, index) => (
            <SideBarItem key={index} value={index} label={item.label} badgeProps={item.badgeProps} />
          ))}
        </SideBar>

        <div ref={wrapperRef} className="content" style={{ transform: `translateY(-${Number(sideBarIndex) * 100}%)` }}>
          {categories.map((item, index) => (
            <div key={index} className="section">
              <div className="title">{item.title || item.label}</div>
              {item.items.map((cargo, cargoIndex) => (
                <Cell
                  key={cargoIndex}
                  title={`${cargo.label}${index}`}
                  image={<Image shape="round" src={cargo.image} className="image" />}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideBarWrapper;
