import React from 'react';
import { Space, Tree } from 'tdesign-react';

import type { TreeProps } from 'tdesign-react';

export default () => {
  const empty: TreeProps['empty'] = <div>😊 空数据（ empty props ）</div>;

  return (
    <Space direction="vertical">
      <Tree data={[]} />

      <Tree data={[]} empty="😊 空数据（string）" />

      <Tree data={[]} empty={empty} />
    </Space>
  );
};
