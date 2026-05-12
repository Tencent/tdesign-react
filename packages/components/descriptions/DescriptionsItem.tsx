import type { TdDescriptionsItemProps } from './type';
import type React from 'react';

export type DescriptionsItemProps = TdDescriptionsItemProps & { children?: React.ReactNode };

const DescriptionsItem: React.FC<DescriptionsItemProps> = () => null;

DescriptionsItem.displayName = 'DescriptionsItem';

export default DescriptionsItem;
