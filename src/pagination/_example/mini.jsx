import React from 'react';
import { Pagination } from '@tencent/tdesign-react';

export default function PaginationExample() {
  return <Pagination size="small" total={100} defaultPageSize={5} />;
}
