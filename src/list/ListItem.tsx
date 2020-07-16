import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { ListItemProps } from './ListProps';

/**
 * 列表组件
 */
const ListItem = forwardRef(
  (props: ListItemProps, ref: React.Ref<HTMLLIElement>) => {
    const { children, className, action, extra } = props;
    const { classPrefix } = useConfig();

    const actionElement = action && action.length > 0 && (
      <ul className={`${classPrefix}-list-item__action`}>
        {action.map((actionItem, index) => (
          <li key={index}>{actionItem}</li>
        ))}
      </ul>
    );

    const extraElement = extra && (
      <div className={`${classPrefix}-list-item__extra`}>{extra}</div>
    );

    return (
      <li
        ref={ref}
        className={classNames(className, `${classPrefix}-list-item`)}
      >
        <div className={`${classPrefix}-list-item-main`}>
          {children}
          {actionElement}
        </div>
        {extraElement}
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';

export default ListItem;
