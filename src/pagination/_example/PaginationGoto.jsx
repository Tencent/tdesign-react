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
      showJumper
      total={645}
      current={current}
      pageSize={pageSize}
      onChange={onChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
