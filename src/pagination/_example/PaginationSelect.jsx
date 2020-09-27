import React from 'react';
import { Pagination } from '@tencent/tdesign-react';

export default function PaginationExample() {
  const [current, setCurrent] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const onChange = React.useCallback((index, event) => {
    setCurrent(index);
    console.log(`current: ${index}`, event);
  }, []);

  const onPageSizeChange = React.useCallback((index, event) => {
    setPageSize(index);
    console.log(`pageSize: ${index}`, event);
  }, []);

  return (
    <Pagination
      showSizer
      total={645}
      current={current}
      pageSize={pageSize}
      pageSizeOption={[20, 30, 100, 200]}
      onChange={onChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
