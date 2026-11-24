import './style';

import _ActionSheet from './ActionSheet';
import { show, close } from './ActionSheetMethod';
import { attachMethodsToComponent } from '../_util/attachMethodsToComponent';
import type { ActionSheetProps } from './ActionSheet';

export type { ActionSheetProps };

type ActionSheetWithMethods = React.FC<ActionSheetProps> & {
  show: typeof show;
  close: typeof close;
};

export * from './type';

export const ActionSheet: ActionSheetWithMethods = attachMethodsToComponent(_ActionSheet, {
  show,
  close,
});

export default ActionSheet;
