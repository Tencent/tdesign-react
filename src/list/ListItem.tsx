import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdListItemProps } from '../_type/components/list';
import { StyledProps } from '../_type';

export interface ListItemProps extends TdListItemProps, StyledProps {
  /**
   * 文本内容
   */
  children?: React.ReactNode;
}

/**
 * 列表组件
 */
const ListItem = forwardRef((props: ListItemProps, ref: React.Ref<HTMLLIElement>) => {
  const { children, className, action } = props;
  const { classPrefix } = useConfig();

  const actionElement = action && <ul className={`${classPrefix}-list-item__action`}>{action}</ul>;

  return (
    <li ref={ref} className={classNames(className, `${classPrefix}-list-item`)}>
      <div className={`${classPrefix}-list-item-main`}>
        {children}
        {actionElement}
      </div>
    </li>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
