export interface IAnimationTransitionParams {
  classPrefix: String;
  expandAnimation?: boolean;
  fadeAnimation?: boolean;
}

export const getTransitionParams = ({ classPrefix, expandAnimation, fadeAnimation }: IAnimationTransitionParams) => {
  if (!fadeAnimation) return {};

  const popupAnimationClassPrefix = expandAnimation
    ? `${classPrefix}-popup--animation-expand`
    : `${classPrefix}-popup--animation`;

  return {
    // 与公共 className 保持一致
    classNames: {
      appear: `${popupAnimationClassPrefix}-enter ${popupAnimationClassPrefix}-enter-active`,
      appearActive: `${popupAnimationClassPrefix}-enter-active`,
      appearDone: `${popupAnimationClassPrefix}-enter-active ${popupAnimationClassPrefix}-enter-to`,
      enter: `${popupAnimationClassPrefix}-enter ${popupAnimationClassPrefix}-enter-active`,
      enterActive: `${popupAnimationClassPrefix}-enter-active`,
      enterDone: `${popupAnimationClassPrefix}-enter-active ${popupAnimationClassPrefix}-enter-to`,
      exit: `${popupAnimationClassPrefix}-leave ${popupAnimationClassPrefix}-leave-active`,
      exitActive: `${popupAnimationClassPrefix}-leave-active`,
      exitDone: `${popupAnimationClassPrefix}-leave-active ${popupAnimationClassPrefix}-leave-to`,
    },
  };
};
