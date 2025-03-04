import React from 'react';
import { Loading } from '@tdesign/components';

export default function TextExample() {
  return <Loading loading={true} text="静态文字加载中..." indicator={false}></Loading>;
}
