import React, { useState } from 'react';
import { Pagination } from '@tencent/tdesign-react';

export default function PaginationExample() {
  const [pageSize, changePageSize] = useState(5);

  const onChange = (pageInfo) => {
    console.log(pageInfo);
  };

  return <Pagination total={100} pageSize={pageSize} onChange={onChange} onPageSizeChange={(v) => changePageSize(v)} />;
}
