import { createContext } from 'react';
import { TdDescriptionsProps } from './type';

export type DescriptionsContextProps = TdDescriptionsProps;

export const DescriptionsContext = createContext<DescriptionsContextProps>(null);
