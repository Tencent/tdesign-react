import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdListItemMetaProps } from './type';
import { StyledProps } from '../common';

export interface ListItemMetaProps extends TdListItemMetaProps, StyledProps {}
/**
 * 列表组件
 */
const ListItemMeta = forwardRef<HTMLDivElement, ListItemMetaProps>((props, ref) => {
  const { title, image, description, className, style } = props;
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
    <div ref={ref} className={classNames(`${classPrefix}-list-item__meta`, className)} style={style}>
      {image && renderAvatar()}
      <div className={`${classPrefix}-list-item__meta-content`}>
        <h3 className={`${classPrefix}-list-item__meta-title`}>{title}</h3>
        <div className={`${classPrefix}-list-item__meta-description`}>
          {typeof description === 'string' ? <p>{description}</p> : description}
        </div>
      </div>
    </div>
  );
});

ListItemMeta.displayName = 'ListItemMeta';

export default ListItemMeta;
