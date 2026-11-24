import React from 'react';
import { NoticeBar } from 'tdesign-mobile-react';
import { SoundIcon } from 'tdesign-icons-react';

export default function Scrolling() {
  const content1 = '提示文字描述提示文字描述提示文字描述提示文字描述提示文字描述';
  const content2 = '这是一条带图标的水平滚动公告栏';
  const content3 = [
    '这是一条带图标的纵向滚动公告栏',
    '这是一条带图标的纵向滚动公告栏',
    '这是一条带图标的纵向滚动公告栏',
  ];

  return (
    <>
      <NoticeBar className="notice-bar-demo-block" visible marquee prefixIcon={null} content={content1} />
      <NoticeBar className="notice-bar-demo-block" visible marquee content={content2} />
      <NoticeBar visible marquee content={content3} direction="vertical" prefixIcon={<SoundIcon />} />
    </>
  );
}
