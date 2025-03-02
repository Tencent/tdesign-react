import React, { useState } from 'react';
import { Pagination } from 'tdesign-react';

import type { PaginationProps } from 'tdesign-react';

export default function PaginationExample() {
  const [pageSize, changePageSize] = useState(5);

  const onChange: PaginationProps['onChange'] = (pageInfo) => {
    console.log(pageInfo);
  };

  return (
    <div>
      <span>展示首尾页码省略</span>
      <Pagination total={100} pageSize={pageSize} onChange={onChange} onPageSizeChange={(v) => changePageSize(v)} />
      <span>不展示首尾页码省略</span>
      <Pagination
        total={100}
        pageSize={pageSize}
        onChange={onChange}
        pageEllipsisMode="both-ends"
        onPageSizeChange={(v) => changePageSize(v)}
      />
    </div>
  );
}
