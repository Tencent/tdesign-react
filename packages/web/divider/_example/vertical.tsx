import React from 'react';
import { Divider } from 'tdesign-react';

export default function BasicDivider() {
  return (
    <>
      <span>正直</span>
      <Divider layout="vertical"></Divider>
      <span>进取</span>
      <Divider layout="vertical"></Divider>
      <span>合作</span>
      <Divider layout="vertical"></Divider>
      <span>创新</span>
    </>
  );
}
