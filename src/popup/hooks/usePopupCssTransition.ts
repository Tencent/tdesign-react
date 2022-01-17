import { useState, useRef } from 'react';

interface UsePopupCssTransitionParams {
  contentRef: React.MutableRefObject<HTMLDivElement>;
  classPrefix: String;
  expandAnimation: boolean;
}

const usePopupCssTransition = ({ contentRef, classPrefix, expandAnimation }: UsePopupCssTransitionParams) => {
  const [presetMaxHeight, setPresetMaxHeight] = useState<number>(null);
  const timerRef = useRef(null);

  const contentEle = contentRef?.current;

  const popupAnimationClassPrefix = `${classPrefix}-popup--animation`;

  const defaultEvents = {
    onEnter: handleEnter,
    onExited: handleExited,
  };

  function handleEnter() {
    clearTimeout(timerRef.current);
    if (contentEle && contentEle.style.display === 'none') {
      contentEle.style.display = 'block';
    }
  }

  function handleEntering() {
    setPresetMaxHeight(parseInt(getComputedStyle(contentEle).maxHeight, 10) || Infinity);
    if (contentEle) {
      contentEle.style.overflow = 'hidden';
      contentEle.style.maxHeight = '0';
    }
  }

  function handleEntered() {
    if (contentEle) {
      const { scrollHeight } = contentEle;
      const minHeight = presetMaxHeight !== Infinity ? presetMaxHeight : scrollHeight;
      contentEle.style.maxHeight = `${minHeight}px`;
      if (presetMaxHeight !== Infinity) {
        contentEle.style.overflow = '';
      }
    }
  }

  function handleExiting() {
    if (contentEle) {
      contentEle.style.maxHeight = '0';
      contentEle.style.overflow = 'hidden';
    }
  }

  function handleExited() {
    // 动画结束后隐藏
    if (contentEle) {
      timerRef.current = setTimeout(() => {
        contentEle.style.display = 'none';
      }, 200);
    }
  }

  // 不需要扩展动画时，不需要生命周期函数
  const lifeCircleEvent = expandAnimation
    ? {
        ...defaultEvents,
        onEntering: handleEntering,
        onEntered: handleEntered,
        onExiting: handleExiting,
      }
    : { ...defaultEvents };

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
