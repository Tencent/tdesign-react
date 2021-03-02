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
  activeItem: Item;
  scrollTo: (link: Item) => void;
  onChange: (currentLink: Item, prefLink: Item) => void;
}

export const AnchorContext = createContext<AnchorContextType>({
  onClick: noop,
  onChange: noop,
  scrollTo: noop,
  activeItem: { href: '', title: '' },
});
