import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdListItemProps } from './type';
import { StyledProps } from '../common';

export interface ListItemProps extends TdListItemProps, StyledProps {
  /**
   * 文本内容
   */
  children?: React.ReactNode;
  content?: React.ReactNode;
}

/**
 * 列表组件
 */
const ListItem = forwardRef((props: ListItemProps, ref: React.Ref<HTMLLIElement>) => {
  const { children, className, style, action, content } = props;
  const { classPrefix } = useConfig();

  const actionElement = action && <ul className={`${classPrefix}-list-item__action`}>{action}</ul>;

  return (
    <li ref={ref} className={classNames(`${classPrefix}-list-item`, className)} style={style}>
      <div className={`${classPrefix}-list-item-main`}>
        {children ? children : content}
        {actionElement}
      </div>
    </li>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
