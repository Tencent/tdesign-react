import React from 'react';
import { NoticeBar } from 'tdesign-mobile-react';
import { ChevronRightIcon, SoundIcon } from 'tdesign-icons-react';

export default function Custom() {
  return (
    <NoticeBar
      className="cover-class"
      visible
      content="提示文字描述提示文字描述提示文字描述"
      prefixIcon={<SoundIcon />}
      suffixIcon={<ChevronRightIcon />}
    />
  );
}
