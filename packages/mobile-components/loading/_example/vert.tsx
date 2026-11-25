import React from 'react';
import { Loading } from 'tdesign-mobile-react';

export default function VertLoading() {
  return (
    <>
      <Loading text="加载中..." layout="vertical" />
      <Loading theme="spinner" text="加载中..." layout="vertical" />
    </>
  );
}
