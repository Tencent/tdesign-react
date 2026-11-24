import React from 'react';
import { NoticeBar } from 'tdesign-mobile-react';
import { CloseIcon } from 'tdesign-icons-react';

export default function SuffixIcon() {
  return <NoticeBar visible content="这是一条普通的通知信息" suffixIcon={<CloseIcon />} />;
}
