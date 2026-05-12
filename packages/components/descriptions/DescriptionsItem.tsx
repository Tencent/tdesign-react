import type React from 'react';
import type { TdDescriptionsItemProps } from './type';

export type DescriptionsItemProps = TdDescriptionsItemProps & { children?: React.ReactNode };

const DescriptionsItem: React.FC<DescriptionsItemProps> = () => null;

DescriptionsItem.displayName = 'DescriptionsItem';

export default DescriptionsItem;
