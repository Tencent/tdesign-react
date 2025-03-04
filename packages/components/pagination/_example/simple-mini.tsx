import React from 'react';
import { Pagination } from '@tdesign/components';

import type { PaginationProps } from '@tdesign/components';

export default function PaginationExample() {
  const onChange: PaginationProps['onChange'] = (pageInfo) => {
    console.log(pageInfo);
  };

  return <Pagination total={100} defaultPageSize={5} size="small" theme="simple" onChange={onChange} />;
}
