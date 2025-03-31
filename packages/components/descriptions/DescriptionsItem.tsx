import React from 'react';
import { TdDescriptionsItemProps } from './type';

export type DescriptionsItem = TdDescriptionsItemProps & { children?: React.ReactNode };

const DescriptionsItem: React.FC<DescriptionsItem> = () => null;

DescriptionsItem.displayName = 'DescriptionsItem';

export default DescriptionsItem;
