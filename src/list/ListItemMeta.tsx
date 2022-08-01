import React, { forwardRef } from 'react';
import useConfig from '../hooks/useConfig';
import { TdListItemMetaProps } from './type';

export type ListItemMetaProps = TdListItemMetaProps;
/**
 * 列表组件
 */
const ListItemMeta = forwardRef((props: ListItemMetaProps, ref: React.Ref<HTMLDivElement>) => {
  const { title, image, description } = props;
  const { classPrefix } = useConfig();

  const renderAvatar = () => {
    if (image && typeof image === 'string') {
      return (
        <div className={`${classPrefix}-list-item__meta-avatar`}>
          <img src={image} alt="" />
        </div>
      );
    }
    return <div className={`${classPrefix}-list-item__meta-avatar`}>{image}</div>;
  };
  return (
    <div ref={ref} className={`${classPrefix}-list-item__meta`}>
      {image && renderAvatar()}
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
