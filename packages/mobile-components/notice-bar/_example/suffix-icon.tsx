import React from 'react';
import { CloseIcon } from 'tdesign-icons-react';
import { NoticeBar } from 'tdesign-mobile-react';

export default function SuffixIcon() {
  return <NoticeBar visible content="这是一条普通的通知信息" suffixIcon={<CloseIcon />} />;
}
