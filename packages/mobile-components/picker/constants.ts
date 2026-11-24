import { PickerWheelConfig } from './type';

/** wheelConfig 默认值 */
export const DEFAULT_WHEEL_CONFIG: Required<PickerWheelConfig> = {
  inertiaDuration: 300,
  bounceDuration: 150,
  transitionDuration: 460,
  inertiaTimeThreshold: 460,
  inertiaDistanceThreshold: 15,
  boundOffset: 60,
  clickDistanceThreshold: 5,
  clickTimeThreshold: 200,
};
