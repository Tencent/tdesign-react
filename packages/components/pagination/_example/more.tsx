import React, { useState } from 'react';
import { Pagination } from 'tdesign-react';

import type { PaginationProps } from 'tdesign-react';

export default function PaginationExample() {
  const [pageSize, setPageSize] = useState(5);

  const onChange: PaginationProps['onChange'] = (pageInfo) => {
    console.log(pageInfo);
  };

  return (
    <div>
      <span>展示首尾页码省略</span>
      <Pagination total={100} pageSize={pageSize} onChange={onChange} onPageSizeChange={(v) => setPageSize(v)} />
      <span>不展示首尾页码省略</span>
      <Pagination
        total={100}
        pageSize={pageSize}
        onChange={onChange}
        pageEllipsisMode="both-ends"
        onPageSizeChange={(v) => setPageSize(v)}
      />
    </div>
  );
}
