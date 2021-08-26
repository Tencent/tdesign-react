import React from 'react';
import { Tree } from '@tencent/tdesign-react';

export default () => {
  const empty = () => <div>😊 空数据（ empty props ）</div>;

  return (
    <div className="tdesign-tree-base">
      <Tree data={[]} />
      <br />
      <Tree data={[]} empty="😊 空数据（string）" />
      <br />
      <Tree data={[]} empty={empty} />
      <br />
    </div>
  );
};
