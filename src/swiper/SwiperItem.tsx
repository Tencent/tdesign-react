import React from 'react';
import { StyledProps } from '../_type';

export interface SwiperItemProps extends StyledProps {
  children?: React.ReactNode;
}

const SwiperItem = (props: SwiperItemProps) => {
  const { children, className } = props;
  return <div className={className}>{children}</div>;
};

SwiperItem.displayName = 'SwiperItem';

export default SwiperItem;
