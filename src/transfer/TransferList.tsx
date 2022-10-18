import React, { useMemo, useState } from 'react';
import classnames from 'classnames';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import { SearchIcon as TdSearchIcon } from 'tdesign-icons-react';
import { getLeafNodes } from './utils';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { TdTransferProps, TransferValue } from './type';
import { TNode, StyledProps } from '../common';
import Checkbox from '../checkbox';
import Input from '../input';
import Pagination, { PaginationProps } from '../pagination';
import { useLocaleReceiver } from '../locale/LocalReceiver';

interface TransferListProps
  extends Pick<TdTransferProps, 'data' | 'search' | 'checked' | 'transferItem' | 'tree'>,
    StyledProps {
  disabled?: boolean;
  empty?: TNode | string;
  title?: TNode;
  footer?: TNode;
  content?: TNode | TNode<{ data: Object }>;
  pagination?: Pick<PaginationProps, 'pageSize'> & { onPageChange?: (current: number) => void };
  onCheckbox?: (checked: Array<TransferValue>) => void;
  onSearch?: (value: string) => void;
  showCheckAll?: boolean;
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
    tree: treeNode,
    showCheckAll,
  } = props;
  const notDisabledData = !treeNode
    ? data.filter((item) => !item.disabled)
    : getLeafNodes(data).filter((item) => !item.disabled);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [indeterminate, allChecked] = useMemo(() => {
    const activeLen = checked.length;
    const notLen = notDisabledData.length;
    return [activeLen && activeLen < notLen, activeLen && activeLen === notLen];
  }, [checked, notDisabledData]);

  const { classPrefix } = useConfig();
  const { SearchIcon } = useGlobalIcon({
    SearchIcon: TdSearchIcon,
  });
  const CLASSPREFIX = `${classPrefix}-transfer__list`;
  const [local, t] = useLocaleReceiver('transfer');

  const handleCheckbox = (vals: Array<TransferValue>) => {
    if (isFunction(onCheckbox)) onCheckbox(vals);
  };

  const handleAllCheckbox = (checked: boolean) => {
    if (isFunction(onCheckbox)) onCheckbox(checked ? notDisabledData.map((item) => item.value) : []);
  };

  const HeaderCmp = () => {
    const total = treeNode ? getLeafNodes(data).length : data.length;
    return (
      <div className={`${CLASSPREFIX}-header`}>
        <div>
          {showCheckAll ? (
            <Checkbox
              indeterminate={indeterminate}
              checked={allChecked}
              disabled={disabled}
              onChange={handleAllCheckbox}
            />
          ) : null}
          <span>{t(local.title, { checked: checked.length, total })}</span>
        </div>
        <span>{title}</span>
      </div>
    );
  };

  const SearchCmp = () =>
    search ? (
      <div className={`${classPrefix}-transfer__search-wrapper`}>
        <Input placeholder={local.placeholder} suffixIcon={<SearchIcon></SearchIcon>} onChange={onSearch}></Input>
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
      <div className={`${classPrefix}-transfer__empty`}>
        <span>{empty || '暂无数据'}</span>
      </div>
    ) : (
      empty
    );

  const contentCmp = () => {
    if (typeof treeNode === 'function') {
      return treeNode({ data: viewData, value: checked, onChange: handleCheckbox });
    }
    if (typeof content === 'function') {
      return content({ data: viewData });
    }
    return (
      <Checkbox.Group value={checked} onChange={handleCheckbox} disabled={disabled}>
        {viewData.map((item, index) => (
          <Checkbox key={item.value} value={item.value} disabled={item.disabled} className={`${CLASSPREFIX}-item`}>
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
      className={classnames(`${CLASSPREFIX}-body`, {
        [`${CLASSPREFIX}--with-search`]: search,
      })}
    >
      {SearchCmp()}
      <div className={`${CLASSPREFIX}-content narrow-scrollbar`}>{viewData.length ? contentCmp() : EmptyCmp()}</div>
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
      <div className={`${CLASSPREFIX}-pagination`}>
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

  const footerCmp = () => (!isEmpty(footer) ? <div className={`${classPrefix}-transfer__footer`}>{footer}</div> : null);

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
