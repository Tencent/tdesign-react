import React from 'react';
import { TdDescriptionItemProps } from './type';

export type DescriptionsItem = TdDescriptionItemProps & { children?: React.ReactNode };

const DescriptionsItem: React.FC<DescriptionsItem> = () => null;

DescriptionsItem.displayName = 'DescriptionsItem';

export default DescriptionsItem;
