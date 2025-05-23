import React from 'react';
import { TdDescriptionsItemProps } from './type';

export type DescriptionsItemProps = TdDescriptionsItemProps & { children?: React.ReactNode };

const DescriptionsItem: React.FC<DescriptionsItemProps> = () => null;

DescriptionsItem.displayName = 'DescriptionsItem';

export default DescriptionsItem;
