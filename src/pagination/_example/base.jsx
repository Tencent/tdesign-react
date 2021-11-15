import React from 'react';
import { Pagination } from 'tdesign-react';

export default function PaginationExample() {
  const onChange = (pageInfo) => {
    console.log(pageInfo);
  };

  const onPageSizeChange = (size) => {
    console.log('page-size:', size);
  };
  const onCurrentChange = (index, pageInfo) => {
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
