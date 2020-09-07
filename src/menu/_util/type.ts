/** menuName 类型 */
export type MenuNameType = string | number;
export interface MenuStaticProps {
  blockType: MenuBlockType;
}
/** menu 组件类型，包括 MenuItem，SubMenu，MenuItemGroup */
export enum MenuBlockType {
  MenuItem = 'MenuItem',
  SubMenu = 'SubMenu',
  MenuItemGroup = 'MenuItemGroup',
}
