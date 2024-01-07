import React from 'react';
import { TdDescriptionItemProps } from './type';

export type ItemProps = TdDescriptionItemProps & { children?: React.ReactNode };

const Item: React.FC<ItemProps> = () => null;

Item.displayName = 'DescriptionsItem';

export default Item;
