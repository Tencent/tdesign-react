import React from 'react';
import { Pagination } from 'tdesign-react';

export default function PaginationExample() {
  const [current, setCurrent] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const onChange = React.useCallback((pageInfo) => {
    const index = pageInfo.current;
    setCurrent(index);
    console.log(`current: ${index}`);
  }, []);

  const onPageSizeChange = React.useCallback((index, pageInfo) => {
    setPageSize(index);
    console.log(`pageSize: ${index}`);
    console.log(`pageInfo: ${JSON.stringify(pageInfo)}`);
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
