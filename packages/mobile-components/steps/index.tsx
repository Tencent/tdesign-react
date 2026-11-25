import './style';

import _StepItem from './StepItem';
import _Steps from './Steps';

export type { StepItemProps } from './StepItem';
export type { StepsProps } from './Steps';
export * from './type';

export const Steps = _Steps;
(Steps as any).StepItem = _StepItem;
export const StepItem = _StepItem;

export default Steps;
