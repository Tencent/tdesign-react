import React from 'react';
import { Tree } from '@tencent/tdesign-react';

const items = [
  {
    label: '第一段',
    children: [
      {
        label: '第二段',
      }, {
        label: '第二段',
      }],
  }, {
    label: '第一段',
    children: [
      {
        label: '第二段',
      }, {
        label: '第二段',
      }],
  }, {
    label: '第一段',
    children: [
      {
        label: '第二段',
      }, {
        label: '第二段',
      }],
  }, {
    label: '第一段',
    children: [
      {
        label: '第二段',
      }, {
        label: '第二段',
      }],
  }];

export default () => {
  return (
    <div className="tdesign-tree-base">
      <Tree data={items} transition />
    </div>
  );
}
