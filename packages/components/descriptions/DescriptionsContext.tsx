import { createContext } from 'react';

import type { TdDescriptionsProps } from './type';

export type DescriptionsContextProps = TdDescriptionsProps;

export const DescriptionsContext = createContext<DescriptionsContextProps>(null);
