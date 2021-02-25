import { createContext } from 'react';
import noop from '../_util/noop';

export interface Link {
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
  onClick: (e: React.MouseEvent<HTMLElement>, link: Link) => void;
  actLink: Link;
  scrollTo: (link: Link) => void;
  onChange: (currentLink: Link, prefLink: Link) => void;
}

export const AnchorContext = createContext<AnchorContextType>({
  onClick: noop,
  onChange: noop,
  scrollTo: noop,
  actLink: { href: '', title: '' },
});
