import React, { FC, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import TPopover, { PopoverProps } from '../popover';
import TPopup, { PopupProps } from '../popup';
import TButton, { ButtonProps } from '../button';

import { guideDefaultProps } from './defaultProps';
import { TdGuideProps } from './type';
import { GuideCrossProps } from './interface';

import Portal from '../common/Portal';
import { SizeEnum, StyledProps } from '../common';
import setStyle from '../_common/js/utils/setStyle';

import { usePrefixClass } from '../hooks/useClass';
import useDefault from '../_util/useDefault';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';

import { isFixed, getRelativePosition, getTargetElm, scrollToParentVisibleArea, scrollToElm } from './utils/index';
import { addClass, getWindowScroll, removeClass } from './utils/shared';

export interface GuideProps extends TdGuideProps, StyledProps {}

const tryCallBack = (check: () => boolean, cb: () => void) => {
  const execute = () => {
    if (check()) {
      cb();
      return true;
    }
  };
  if (execute()) return;

  setTimeout(() => {
    if (execute()) return;
    setTimeout(() => {
      execute();
    }, 0);
  });
};

const DEFAULT_BUTTON_MAP = {
  SKIP: '跳过',
  NEXT: '下一步',
  BACK: '返回',
  FINISH: '完成',
};

const Guide: FC<GuideProps> = (originProps) => {
  const props = useDefaultProps<GuideProps>(originProps, guideDefaultProps);
  const { className, style, zIndex, onChange, steps, current, defaultCurrent, hideSkip, hideBack, hideCounter } = props;

  const guideClass = usePrefixClass('guide');
  const LOCK_CLASS = `${guideClass}--lock`;
  const overlayLayerRef = useRef<HTMLDivElement>(null);
  const highlightLayerRef = useRef<HTMLDivElement>(null);
  const popoverWrapperRef = useRef<HTMLDivElement>(null);
  const referenceLayerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef(null);
  const currentHighlightLayerElm = useRef<HTMLElement>(null);

  const [innerCurrent, setInnerCurrent] = useDefault(current, defaultCurrent, onChange);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const currentStepInfo = useMemo(() => steps?.[innerCurrent], [steps, innerCurrent]);
  const getCurrentCrossProps = <Key extends keyof GuideCrossProps>(propsName: Key) =>
    currentStepInfo?.[propsName] ?? props[propsName];

  const isPopover = getCurrentCrossProps('mode') === 'popover';

  const [actived, setActived] = useState(false);

  const stepsTotal = useMemo(() => steps?.length || 0, [steps]);
  const isLast = useMemo(() => innerCurrent === stepsTotal - 1, [innerCurrent, stepsTotal]);
  const buttonSize = useMemo(() => (isPopover ? 'extra-small' : 'medium') as SizeEnum, [isPopover]);

  const isPopoverCenter = useMemo(
    () => isPopover && currentStepInfo?.placement === 'center',
    [isPopover, currentStepInfo],
  );

  const stepProps = useMemo(() => {
    if (isPopover) {
      return {
        visible: popoverVisible,
        placement: isPopoverCenter ? 'bottom' : currentStepInfo?.placement,
        theme: 'light',
        showArrow: false,
        ...currentStepInfo?.popoverProps,
      } as PopoverProps;
    }
    return {
      visible: popoverVisible,
      zIndex,
      placement: 'center',
      class: `${guideClass}__dialog`,
      overlayProps: {
        zIndex: zIndex - 1,
      },
    } as PopupProps;
  }, [isPopover, popoverVisible, isPopoverCenter, currentStepInfo, zIndex, guideClass]);

  const currentElmIsFixed = isFixed(currentHighlightLayerElm.current || document.body);

  // highlight layer 相关
  // 获取当前步骤的用户设定的高亮内容
  const currentCustomHighlightContent = useCallback(() => {
    if (!currentStepInfo) return null;
    const { highlightContent } = currentStepInfo;

    return parseTNode(highlightContent);
  }, [currentStepInfo]);

  // 是否展示高亮区域
  const showCustomHighlightContent = useMemo(
    () => Boolean(currentCustomHighlightContent() && isPopover),
    [currentCustomHighlightContent, isPopover],
  );
  const showOverlay = getCurrentCrossProps('showOverlay');

  // 设置高亮层的位置
  const setHighlightLayerPosition = (highlightLayer: HTMLElement, isReference = false) => {
    if (!highlightLayer) return;

    let { top, left } = getRelativePosition(currentHighlightLayerElm.current);
    let { width, height } = currentHighlightLayerElm.current.getBoundingClientRect();
    const highlightPadding = getCurrentCrossProps('highlightPadding');

    if (isPopover) {
      width += highlightPadding * 2;
      height += highlightPadding * 2;
      top -= highlightPadding;
      left -= highlightPadding;
    } else {
      const { scrollTop, scrollLeft } = getWindowScroll();
      top += scrollTop;
      left += scrollLeft;
    }

    const style = {
      top: `${top}px`,
      left: `${left}px`,
    };

    // 展示自定义高亮
    if (showCustomHighlightContent) {
      // 高亮框本身不设定宽高，引用用框的宽高设定为用户自定义的宽高
      if (isReference) {
        const { width, height } = highlightLayerRef.current.getBoundingClientRect();
        Object.assign(style, {
          width: `${width}px`,
          height: `${height}px`,
        });
      } else {
        Object.assign(style, {
          width: 'auto',
          height: 'auto',
        });
      }
    } else {
      Object.assign(style, {
        width: `${width}px`,
        height: `${height}px`,
      });
    }

    setStyle(highlightLayer, style);
  };

  const setReferenceFullW = (referenceElements: HTMLElement[]): void => {
    const style = {
      left: 0,
      width: '100vw',
    };

    referenceElements.forEach((elem) => {
      if (elem) {
        setStyle(elem, style);
      }
    });
  };

  const showPopoverGuide = () => {
    setTimeout(() => {
      currentHighlightLayerElm.current = getTargetElm(currentStepInfo?.element);
      if (!currentHighlightLayerElm.current) return;
      scrollToParentVisibleArea(currentHighlightLayerElm.current);
      setHighlightLayerPosition(highlightLayerRef.current);
      setHighlightLayerPosition(popoverWrapperRef.current, true);
      setHighlightLayerPosition(referenceLayerRef.current, true);
      scrollToElm(currentHighlightLayerElm.current);
      if (isPopoverCenter) {
        setReferenceFullW([referenceLayerRef.current, popoverWrapperRef.current]);
      }
      popoverRef.current?.updatePopper?.();
    });
  };

  const showDialogGuide = () => {
    setTimeout(() => {
      currentHighlightLayerElm.current = getTargetElm(currentStepInfo?.element);
      scrollToParentVisibleArea(currentHighlightLayerElm.current);
      setHighlightLayerPosition(highlightLayerRef.current);
      scrollToElm(currentHighlightLayerElm.current);
    });
  };

  const showGuide = () => {
    if (isPopover) {
      tryCallBack(() => !!highlightLayerRef.current, showPopoverGuide);
    } else {
      tryCallBack(() => !!highlightLayerRef.current, showDialogGuide);
    }
    setTimeout(() => {
      setPopoverVisible(true);
    });
  };

  const destroyGuide = () => {
    if (highlightLayerRef.current?.parentNode) {
      highlightLayerRef.current.parentNode.removeChild(highlightLayerRef.current);
    }
    if (overlayLayerRef.current?.parentNode) {
      overlayLayerRef.current.parentNode.removeChild(overlayLayerRef.current);
    }
    removeClass(document.body, LOCK_CLASS);
  };

  const renderButtonContent = (buttonProps: ButtonProps, defaultContent: string) => {
    const { content } = buttonProps || {};
    return parseTNode(content) || defaultContent;
  };

  const handleSkip = (e) => {
    const total = stepsTotal;
    setActived(false);
    setInnerCurrent(-1, { e, total });
    props.onSkip?.({ e, current: innerCurrent, total });
  };

  const handleNext = (e) => {
    const total = stepsTotal;
    setInnerCurrent(innerCurrent + 1, { e, total });
    props.onNextStepClick?.({
      e,
      next: innerCurrent + 1,
      current: innerCurrent,
      total,
    });
  };

  const handleFinish = (e) => {
    const total = stepsTotal;
    setActived(false);
    setInnerCurrent(-1, { e, total });
    props.onFinish?.({ e, current: innerCurrent, total });
  };

  const handleBack = (e) => {
    const total = stepsTotal;
    setInnerCurrent(0, { e, total });
    props.onBack?.({ e, current: innerCurrent, total });
  };

  const initGuide = () => {
    if (steps?.length && innerCurrent >= 0 && innerCurrent < steps.length) {
      if (!actived) {
        setActived(true);
        addClass(document.body, LOCK_CLASS);
      }
      showGuide();
    }
  };

  useEffect(() => {
    if (innerCurrent >= 0 && innerCurrent < stepsTotal) {
      if (isPopover) {
        setPopoverVisible(false);
      }
      initGuide();
    } else {
      setActived(false);
      destroyGuide();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerCurrent, isPopover, stepsTotal]);

  const renderStepContent = () => {
    const renderTitleNode = () => {
      if (!currentStepInfo) return null;
      const { title } = currentStepInfo;
      return parseTNode(title);
    };

    const renderBodyNode = () => {
      if (!currentStepInfo) return null;
      const { body } = currentStepInfo;
      return parseTNode(body);
    };

    const renderCounterNode = () => {
      const params = {
        total: stepsTotal,
        current: innerCurrent,
      };
      const { counter } = props;
      const renderCounter = parseTNode(counter, params);

      return renderCounter || ` (${innerCurrent + 1}/${stepsTotal})`;
    };
    return (
      <>
        <div className={classNames([`${guideClass}__content--${isPopover ? 'popover' : 'dialog'}`])}>
          <div className={`${guideClass}__tooltip`}>
            <div className={`${guideClass}__title`}>{renderTitleNode()}</div>
            <div className={`${guideClass}__desc`}>{renderBodyNode()}</div>
          </div>
          <div
            className={classNames([
              `${guideClass}__footer`,
              `${guideClass}__footer--${isPopover ? 'popover' : 'dialog'}`,
            ])}
          >
            {!hideSkip && !isLast && (
              <TButton
                key="skip"
                className={`${guideClass}__skip`}
                theme="light"
                size={buttonSize}
                variant="base"
                content={DEFAULT_BUTTON_MAP.SKIP}
                {...getCurrentCrossProps('skipButtonProps')}
                onClick={handleSkip}
              />
            )}
            {!isLast && (
              <TButton
                key="next"
                className={`${guideClass}__next`}
                theme="primary"
                size={buttonSize}
                variant="base"
                {...getCurrentCrossProps('nextButtonProps')}
                onClick={handleNext}
                content={
                  <>
                    {renderButtonContent(getCurrentCrossProps('nextButtonProps'), DEFAULT_BUTTON_MAP.NEXT)}
                    {!hideCounter && renderCounterNode()}
                  </>
                }
              ></TButton>
            )}
            {isLast && !hideBack && (
              <TButton
                key="back"
                className={`${guideClass}__back`}
                theme="light"
                size={buttonSize}
                variant="base"
                content={DEFAULT_BUTTON_MAP.BACK}
                {...getCurrentCrossProps('backButtonProps')}
                onClick={handleBack}
              ></TButton>
            )}
            {isLast && (
              <TButton
                key="finish"
                className={`${guideClass}__finish`}
                theme="primary"
                size={buttonSize}
                variant="base"
                {...getCurrentCrossProps('finishButtonProps')}
                onClick={handleFinish}
                content={
                  <>
                    {renderButtonContent(getCurrentCrossProps('finishButtonProps'), DEFAULT_BUTTON_MAP.FINISH)}
                    {!hideCounter && renderCounterNode()}
                  </>
                }
              ></TButton>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderContentNode = () => {
    if (!currentStepInfo) return null;
    const { content } = currentStepInfo;
    const contentProps = {
      handleSkip,
      handleNext,
      handleFinish,
      handleBack,
      current: innerCurrent,
      total: stepsTotal,
    };

    return parseTNode(content, contentProps);
  };

  const renderPopover = () => (
    <TPopover
      {...(stepProps as PopoverProps)}
      ref={popoverRef}
      triggerElement={<div ref={referenceLayerRef} className={`${guideClass}__reference`}></div>}
      content={renderContentNode() || renderStepContent()}
    ></TPopover>
  );
  const renderPopup = () => (
    <TPopup {...(stepProps as PopupProps)}>{renderContentNode() || renderStepContent()}</TPopup>
  );

  return (
    actived && (
      <Portal attach="body">
        <div
          ref={overlayLayerRef}
          className={classNames([`${guideClass}__overlay`, className])}
          style={{ zIndex: zIndex - 2, ...style }}
        ></div>
        <div
          className={classNames([
            `${guideClass}__highlight`,
            `${guideClass}__highlight--${isPopover ? 'popover' : 'dialog'}`,
            `${guideClass}--${currentElmIsFixed && isPopover ? 'fixed' : 'absolute'}`,
            `${guideClass}__highlight--${showOverlay ? 'mask' : 'nomask'}`,
          ])}
          ref={highlightLayerRef}
          style={{ zIndex: zIndex - 1 }}
        >
          {showCustomHighlightContent && currentCustomHighlightContent()}
        </div>
        <div
          ref={popoverWrapperRef}
          className={classNames([
            `${guideClass}__wrapper`,
            `${guideClass}--${currentElmIsFixed ? 'fixed' : 'absolute'}`,
            {
              [`${guideClass}__wrapper--content`]: !!currentStepInfo?.content,
            },
          ])}
          style={{ zIndex }}
        >
          {isPopover ? renderPopover() : renderPopup()}
        </div>
      </Portal>
    )
  );
};

Guide.displayName = 'Guide';

export default Guide;
