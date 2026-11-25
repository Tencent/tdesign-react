import React from 'react';
import { Loading } from 'tdesign-mobile-react';

export default function HorzLoading() {
  return (
    <>
      <Loading text="加载中..." />
      <Loading theme="spinner" text="加载中..." />
    </>
  );
}
