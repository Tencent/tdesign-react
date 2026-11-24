import { GuideStep } from './type';

export type GuideCrossProps = Pick<
  GuideStep,
  | 'mode'
  | 'skipButtonProps'
  | 'nextButtonProps'
  | 'backButtonProps'
  | 'finishButtonProps'
  | 'showOverlay'
  | 'highlightPadding'
>;
