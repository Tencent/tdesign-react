import React, { useMemo, useState } from 'react';
import classnames from 'classnames';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import { SearchIcon } from 'tdesign-icons-react';
import useConfig from '../_util/useConfig';
import { TdTransferProps, TransferValue } from './type';
import { TNode, StyledProps } from '../common';
import Checkbox from '../checkbox';
import Input from '../input';
import Pagination, { PaginationProps } from '../pagination';

interface TransferListProps extends Pick<TdTransferProps, 'data' | 'search' | 'checked' | 'transferItem'>, StyledProps {
  disabled?: boolean;
  empty?: TNode | string;
  title?: TNode;
  footer?: TNode;
  content?: TNode;
  pagination?: Pick<PaginationProps, 'pageSize'> & { onPageChange?: (current: number) => void };
  onCheckbox?: (checked: Array<TransferValue>) => void;
  onSearch?: (value: string) => void;
}

const TransferList: React.FunctionComponent<TransferListProps> = (props) => {
  const {
    className,
    style,
    data,
    search = false,
    checked = [],
    empty,
    title,
    footer,
    content,
    onCheckbox,
    onSearch,
    disabled = false,
    pagination,
    transferItem,
  } = props;

  const notDisabledData = data.filter((item) => !item.disabled);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [indeterminate, allChecked] = useMemo(() => {
    const aciveLen = checked.length;
    const notLen = notDisabledData.length;
    return [aciveLen && aciveLen < notLen, aciveLen && aciveLen === notLen];
  }, [checked, notDisabledData]);

  const { classPrefix } = useConfig();
  const CLASSPREFIX = `${classPrefix}-transfer-list`;

  const handleCheckbox = (vals: Array<TransferValue>) => {
    if (isFunction(onCheckbox)) onCheckbox(vals);
  };

  const handleAllCheckbox = (checked: boolean) => {
    if (isFunction(onCheckbox)) onCheckbox(checked ? notDisabledData.map((item) => item.value) : []);
  };

  const HeaderCmp = () => (
    <div className={`${CLASSPREFIX}__header`}>
      <div>
        <Checkbox
          indeterminate={indeterminate}
          checked={allChecked}
          disabled={disabled}
          onChange={handleAllCheckbox}
        ></Checkbox>
        <span>
          {checked.length} / {data.length} 项
        </span>
      </div>
      <span>{title}</span>
    </div>
  );

  const SearchCmp = () =>
    search ? (
      <div className={`${CLASSPREFIX}-search-wrapper`}>
        <Input placeholder="请输入关键词搜索" suffixIcon={<SearchIcon></SearchIcon>} onChange={onSearch}></Input>
      </div>
    ) : null;

  const viewData = useMemo(() => {
    if (!isEmpty(pagination)) {
      const pageSize = pagination.pageSize || 10;
      const start = (currentPage - 1) * pageSize;
      return data.slice(start, start + pageSize);
    }
    return data;
  }, [currentPage, data, pagination]);

  const EmptyCmp = () =>
    isString(empty) ? (
      <div className={`${classPrefix}-transfer-empty`}>
        <span>{empty || '暂无数据'}</span>
      </div>
    ) : (
      empty
    );

  const contentCmp = () => {
    if (typeof content === 'function') {
      return content({ data: viewData });
    }
    return (
      <Checkbox.Group value={checked} onChange={handleCheckbox} disabled={disabled}>
        {viewData.map((item, index) => (
          <Checkbox key={item.value} value={item.value} disabled={item.disabled} className={`${CLASSPREFIX}__item`}>
            <span>
              {typeof transferItem === 'function' ? transferItem({ data: item, index, type: 'source' }) : item.label}
            </span>
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  };
  const BodyCmp = () => (
    <div
      className={classnames(`${CLASSPREFIX}__body`, {
        [`${CLASSPREFIX}-with-search`]: search,
      })}
    >
      {SearchCmp()}
      <div className={`${CLASSPREFIX}__content narrow-scrollbar`}>{viewData.length ? contentCmp() : EmptyCmp()}</div>
    </div>
  );

  const PaginationCmp = () => {
    const handleCurrentPagination = (current: number) => {
      setCurrentPage(current);
      if (isFunction(pagination.onPageChange)) {
        pagination.onPageChange(current);
      }
    };

    return pagination ? (
      <div className={`${CLASSPREFIX}__pagination`}>
        <Pagination
          size="small"
          theme="simple"
          pageSizeOptions={[]}
          total={data.length}
          totalContent={false}
          onCurrentChange={handleCurrentPagination}
          pageSize={pagination.pageSize}
        />
      </div>
    ) : null;
  };

  const footerCmp = () => (!isEmpty(footer) ? <div className={`${classPrefix}-transfer-footer`}>{footer}</div> : null);

  return (
    <div style={style} className={classnames(CLASSPREFIX, className)}>
      {HeaderCmp()}
      {BodyCmp()}
      {PaginationCmp()}
      {footerCmp()}
    </div>
  );
};

export default TransferList;
