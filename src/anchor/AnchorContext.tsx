import { createContext } from 'react';
import noop from '../_util/noop';

export interface Item {
  /**
   * 锚点链接
   */
  href: string;
  /**
   * 锚点描述
   */
  title: string;
}

export interface AnchorContextType {
  onClick: (e: React.MouseEvent<HTMLElement>, link: Item) => void;
  activeItem: string;
  registerItem: (href: string) => void;
  unregisterItem: (href: string) => void;
}

export const AnchorContext = createContext<AnchorContextType>({
  onClick: noop,
  activeItem: '',
  registerItem: noop,
  unregisterItem: noop,
});
