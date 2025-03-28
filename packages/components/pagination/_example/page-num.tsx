import React from 'react';
import { Pagination } from 'tdesign-react';

import type { PaginationProps } from 'tdesign-react';

export default function PaginationExample() {
  const [current, setCurrent] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const onChange: PaginationProps['onChange'] = React.useCallback((pageInfo) => {
    const index = pageInfo.current;
    setCurrent(index);
    console.log(`current: ${index}`);
  }, []);

  const onPageSizeChange: PaginationProps['onPageSizeChange'] = React.useCallback((index, pageInfo) => {
    setPageSize(index);
    console.log(`pageSize: ${index}`);
    console.log(`pageInfo: ${JSON.stringify(pageInfo)}`);
  }, []);

  return (
    <Pagination
      total={645}
      current={current}
      pageSize={pageSize}
      pageSizeOptions={[20, 30, 100, 200]}
      onChange={onChange}
      onPageSizeChange={onPageSizeChange}
      selectProps={{
        popupProps: {
          overlayStyle: { fontWeight: 'normal' },
          overlayInnerStyle: { fontWeight: 'normal' },
          overlayClassName: 'pagination-num-custom-overlay-class',
          overlayInnerClassName: 'pagination-num-custom-overlay-inner-class',
        },
      }}
    />
  );
}
