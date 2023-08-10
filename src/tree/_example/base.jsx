import React from 'react';
import { Tree } from 'tdesign-react';

const items = [
  {
    label: '第一段',
    children: [],
  },
];

const render0perations = () => <div>111</div>;

export default () => (
  <>
    <Tree data={items} line icon activable expandAll expandParent operations={render0perations} />
  </>
);
