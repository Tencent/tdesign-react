import React, { forwardRef } from 'react';
import useConfig from '../_util/useConfig';
import { TdListItemMetaProps } from '../_type/components/list';

export interface ListItemMetaProps extends TdListItemMetaProps {}
/**
 * 列表组件
 */
const ListItemMeta = forwardRef((props: ListItemMetaProps, ref: React.Ref<HTMLDivElement>) => {
  const { title, avatar, description } = props;
  const { classPrefix } = useConfig();

  const renderAvatar = () => {
    if (avatar && typeof avatar === 'string') {
      return (
        <div className={`${classPrefix}-list-item__meta-avatar`}>
          <img src={avatar} alt="" />
        </div>
      );
    }
    return <div className={`${classPrefix}-list-item__meta-avatar`}>{avatar}</div>;
  };
  return (
    <div ref={ref} className={`${classPrefix}-list-item__meta`}>
      {avatar && renderAvatar()}
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
