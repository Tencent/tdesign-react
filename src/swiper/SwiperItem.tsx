import React from 'react';
import { StyledProps } from '../common';

export interface SwiperItemProps extends StyledProps {
  children?: React.ReactNode;
}

const SwiperItem = (props: SwiperItemProps) => {
  const { children, className } = props;
  return <div className={className}>{children}</div>;
};

SwiperItem.displayName = 'SwiperItem';

export default SwiperItem;
