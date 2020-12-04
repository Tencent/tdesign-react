import React from 'react';
import { Pagination } from '@tencent/tdesign-react';

export default function PaginationExample() {
  return <Pagination showSizer showJumper disabled total={100} pageSize={5} />;
}
