import React from 'react';
import { Loading } from 'tdesign-mobile-react';

export default function BaseLoading() {
  return (
    <>
      <Loading />
      <Loading theme="spinner" />
      <Loading theme="dots" size="40px" />
    </>
  );
}
