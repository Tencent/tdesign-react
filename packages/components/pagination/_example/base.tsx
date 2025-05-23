import React from 'react';
import { Pagination } from 'tdesign-react';

import type { PaginationProps } from 'tdesign-react';

export default function PaginationExample() {
  const onChange: PaginationProps['onChange'] = (pageInfo) => {
    console.log(pageInfo);
  };

  const onPageSizeChange: PaginationProps['onPageSizeChange'] = (size) => {
    console.log('page-size:', size);
  };
  const onCurrentChange: PaginationProps['onCurrentChange'] = (index, pageInfo) => {
    console.log(`转到第${index}页`);
    console.log(pageInfo);
  };

  return (
    <Pagination
      total={100}
      defaultPageSize={5}
      onChange={onChange}
      onCurrentChange={onCurrentChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
