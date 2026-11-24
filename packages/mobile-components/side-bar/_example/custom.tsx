import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { SideBarProps, SideBarItemProps } from 'tdesign-mobile-react';
import { SideBar, SideBarItem, Grid, GridItem } from 'tdesign-mobile-react';

const image = 'https://tdesign.gtimg.com/mobile/demos/example2.png';
const items = new Array(12).fill({ label: '标题文字', image });

const categories = [
  { label: '选项一', title: '标题一', badgeProps: {}, items },
  { label: '选项二', title: '标题二', badgeProps: { dot: true }, items: items.slice(0, 9) },
  { label: '选项三', title: '标题三', badgeProps: {}, items: items.slice(0, 9) },
  { label: '选项四', title: '标题四', badgeProps: { count: 6 }, items: items.slice(0, 6) },
  { label: '选项五', title: '标题五', badgeProps: {}, items: items.slice(0, 3) },
];

function SideBarWrapper() {
  const [sideBarIndex, setSideBarIndex] = useState<SideBarProps['value']>(1);
  const [offsetTopList, setOffsetTopList] = useState([]);
  const wrapperRef = useRef(null);

  const moveToActiveSideBar = useCallback(
    (index) => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollTop = offsetTopList[index] - offsetTopList[0];
      }
    },
    [offsetTopList],
  );

  const onSideBarChange = (value) => {
    setSideBarIndex(value);
    moveToActiveSideBar(value);
  };

  const onScroll = (e) => {
    const threshold = offsetTopList[0];
    const { scrollTop } = e.target;
    if (scrollTop < threshold) {
      setSideBarIndex(0);
      return;
    }
    const index = offsetTopList.findIndex((top) => top > scrollTop && top - scrollTop <= threshold);
    if (index > -1) {
      setSideBarIndex(index);
    }
  };

  const onSideBarClick = (value: SideBarProps['value'], label: SideBarItemProps['label']) => {
    console.log('=onSideBarClick===', value, label);
  };

  useEffect(() => {
    const newOffsetTopList = [];
    const titles = wrapperRef.current.querySelectorAll('.title');
    titles.forEach((title) => {
      newOffsetTopList.push(title.offsetTop);
    });
    setOffsetTopList(newOffsetTopList);
    moveToActiveSideBar(sideBarIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sideBarIndex]);

  return (
    <>
      <div className="side-bar-wrapper section-custom">
        <SideBar value={sideBarIndex} onChange={onSideBarChange} onClick={onSideBarClick}>
          {categories.map((item, index) => (
            <SideBarItem key={index} value={index} label={item.label} badgeProps={item.badgeProps} />
          ))}
        </SideBar>
        <div ref={wrapperRef} className="content" onScroll={onScroll}>
          {categories.map((item, index) => (
            <div key={index} className="section">
              <div className="title">{item.title || item.label}</div>
              <Grid column={3} border={false}>
                {item.items.map((cargo, cargoIndex) => (
                  <GridItem
                    key={cargoIndex}
                    text={cargo.label}
                    image={{ src: cargo.image, shape: 'round', lazy: true }}
                  ></GridItem>
                ))}
              </Grid>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideBarWrapper;
