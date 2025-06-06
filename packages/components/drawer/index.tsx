import _Drawer from './Drawer';
import { DrawerPlugin as _DrawerPlugin } from './plugin';

import './style/index.js';

export type { DrawerProps } from './Drawer';
export * from './type';

export const Drawer = _Drawer;

export const drawer = _DrawerPlugin;
export const DrawerPlugin = _DrawerPlugin;

export default Drawer;
