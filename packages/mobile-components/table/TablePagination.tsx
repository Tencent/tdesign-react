import React, { useMemo } from 'react';
import { PaginationProps } from './type';
import Button from '../button';
import useClassName from './hooks/useClassName';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import { tablePaginationDefaultProps } from './tablePaginationDefaultProps';

const PAGE_COUNT_MIN = 1;
const TablePagination: React.FC<PaginationProps> = (originalProps) => {
  const props = useDefaultProps<PaginationProps>(originalProps, tablePaginationDefaultProps);
  const { total, onChange, onCurrentChange } = props;
  const { tablePaginationClasses } = useClassName();
  const [current, setCurrent] = useControlled(props, 'current', onCurrentChange);
  const [pageSize] = useControlled(props, 'pageSize', onCurrentChange);

  const pageCount = useMemo<number>(() => {
    const calCount = Math.ceil(total / pageSize);
    return calCount > 0 ? calCount : PAGE_COUNT_MIN;
  }, [pageSize, total]);

  const handlePageChange = (nextCurrent: number) => {
    let resNextCurrent = nextCurrent;
    // 边界处理
    if (nextCurrent < PAGE_COUNT_MIN) {
      resNextCurrent = PAGE_COUNT_MIN;
    }
    if (nextCurrent > pageCount) {
      resNextCurrent = pageCount;
    }
    setCurrent(resNextCurrent, { current: resNextCurrent, previous: current, pageSize });
    onChange({
      current: resNextCurrent,
      previous: current,
      pageSize,
    });
  };
  return (
    <div className={tablePaginationClasses.content}>
      <Button
        className={tablePaginationClasses.button}
        disabled={current === 1}
        shape="rectangle"
        size="small"
        variant="outline"
        onClick={() => handlePageChange(current - 1)}
      >
        上一页
      </Button>
      <div className={tablePaginationClasses.paginationIndicator}>
        <span>{current}</span>
        <span>/</span>
        <span>{pageCount}</span>
      </div>
      <Button
        className={tablePaginationClasses.button}
        disabled={current === pageCount}
        shape="rectangle"
        size="small"
        variant="outline"
        onClick={() => handlePageChange(current + 1)}
      >
        下一页
      </Button>
    </div>
  );
};

export default TablePagination;
