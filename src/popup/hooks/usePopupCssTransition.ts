interface UsePopupCssTransitionParams {
  contentRef: React.MutableRefObject<HTMLDivElement>;
  classPrefix: String;
  expandAnimation: boolean;
}

const usePopupCssTransition = ({ contentRef, classPrefix, expandAnimation }: UsePopupCssTransitionParams) => {
  const handleBeforeEnter = () => {
    const contentEle = contentRef?.current;
    if (contentEle) {
      contentEle.style.overflow = 'hidden';
      contentEle.style.maxHeight = '0';
    }
  };

  const handleEntering = () => {
    const contentEle = contentRef?.current;
    if (contentEle) {
      const { scrollHeight } = contentEle;
      contentEle.style.maxHeight = `${scrollHeight}px`;
    }
  };

  const handleExiting = () => {
    console.log('trigger before exiting');
    const contentEle = contentRef?.current;
    if (contentEle) {
      contentEle.style.maxHeight = '0';
    }
  };

  const popupAnimationClassPrefix = `${classPrefix}-popup_animation`;

  // 不需要扩展动画时，不需要生命周期函数
  const lifeCircleEvent = expandAnimation
    ? {
        onEnter: handleBeforeEnter,
        onEntering: handleEntering,
        onExiting: handleExiting,
      }
    : {};

  return {
    props: {
      timeout: 200,
      nodeRef: contentRef,
      ...lifeCircleEvent,
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
    },
  };
};

export default usePopupCssTransition;
