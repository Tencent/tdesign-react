const DEFAULT_SUBMENU_PADDING_LEFT = 44;
const INCREASE_SUBMENU_PADDING_LEFT = 16;

export const cacularPaddingLeft = (level: number) =>
  DEFAULT_SUBMENU_PADDING_LEFT + level * INCREASE_SUBMENU_PADDING_LEFT;
