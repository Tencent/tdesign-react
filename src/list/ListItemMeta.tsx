import React, { forwardRef } from 'react';
import useConfig from '../_util/useConfig';
import { ListItemMetaProps } from './ListProps';

/**
 * 列表组件
 */
const ListItemMeta = forwardRef((props: ListItemMetaProps, ref: React.Ref<HTMLDivElement>) => {
  const { title, avatar, description } = props;
  const { classPrefix } = useConfig();

  return (
    <div ref={ref} className={`${classPrefix}-list-item__meta`}>
      {avatar && <div className={`${classPrefix}-list-item__meta-avatar`}>{avatar}</div>}
      <div className={`${classPrefix}-list-item__meta-content`}>
        <h3 className={`${classPrefix}-list-item__meta-title`}>{title}</h3>
        <div className={`${classPrefix}-list-item__meta-description`}>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
});

ListItemMeta.displayName = 'ListItemMeta';

export default ListItemMeta;
