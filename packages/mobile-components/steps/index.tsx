import _Steps from './Steps';
import _StepItem from './StepItem';

import './style';

export type { StepsProps } from './Steps';
export type { StepItemProps } from './StepItem';
export * from './type';

export const Steps = _Steps;
(Steps as any).StepItem = _StepItem;
export const StepItem = _StepItem;

export default Steps;
