import React, { useEffect, useMemo, useRef, useState } from 'react';
import isFunction from 'lodash/isFunction';
import cx from 'classnames';
import { createPortal } from 'react-dom';
import Button from '../button';
import useConfig from '../hooks/useConfig';
import Popup, { PopupProps } from '../popup';
import { StepPopupPlacement, TdGuideProps, GuideStep } from './type';
import { addClass, removeClass, isFixed, getWindowScroll } from '../_util/dom';
import { scrollToParentVisibleArea, getRelativePosition, getTargetElm, scrollToElm } from './utils';
import setStyle from '../_common/js/utils/set-style';
import useControlled from '../hooks/useControlled';
import { guideDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export type GuideProps = TdGuideProps;

export type GuideCrossProps = Pick<
  GuideStep,
  'mode' | 'skipButtonProps' | 'prevButtonProps' | 'nextButtonProps' | 'showOverlay' | 'highlightPadding'
>;

/**
 * @deprecated use GuideStep instead.
 * */
export type TdGuideStepProps = GuideStep;

const Guide: React.FC<GuideProps> = (originalProps) => {
  const props = useDefaultProps<TdGuideProps>(originalProps, guideDefaultProps);
  const { counter, hideCounter, hidePrev, hideSkip, steps, zIndex } = props;

  const { classPrefix, guide: guideGlobalConfig } = useConfig();
  const prefixCls = `${classPrefix}-guide`;
  const lockCls = `${prefixCls}--lock`;

  const [innerCurrent, setInnerCurrent] = useControlled(props, 'current', props.onChange);

  // 覆盖层，用于覆盖所有元素
  const overlayLayerRef = useRef<HTMLDivElement>(null);
  // 高亮层，用于高亮元素
  const highlightLayerRef = useRef<HTMLDivElement>(null);
  // 提示层，用于高亮元素
  const referenceLayerRef = useRef<HTMLDivElement>(null);
  // 当前高亮的元素
  const currentHighlightLayerElm = useRef<HTMLElement>(null);
  // dialog wrapper ref
  const dialogWrapperRef = useRef<HTMLDivElement>(null);
  // dialog ref
  const dialogTooltipRef = useRef<HTMLDivElement>(null);
  // 是否开始展示
  const [active, setActive] = useState(false);
  // 步骤总数
  const stepsTotal = steps.length;
  // 当前步骤的信息
  const currentStepInfo = useMemo(() => steps[innerCurrent], [steps, innerCurrent]);
  // 获取当前步骤的所有属性 用户当前步骤设置 > 用户全局设置的 > 默认值
  const getCurrentCrossProps = <Key extends keyof GuideCrossProps>(propsName: Key) =>
    currentStepInfo?.[propsName] ?? props[propsName];
  // 当前是否为 popup
  const isPopup = getCurrentCrossProps('mode') === 'popup';
  // 当前元素位置状态
  const currentElmIsFixed = isFixed(currentHighlightLayerElm.current || document.body);

  // 设置高亮层的位置
  const setHighlightLayerPosition = (highlightLayer: HTMLElement) => {
    let { top, left } = getRelativePosition(currentHighlightLayerElm.current);
    let { width, height } = currentHighlightLayerElm.current.getBoundingClientRect();
    const highlightPadding = getCurrentCrossProps('highlightPadding');

    if (isPopup) {
      width += highlightPadding * 2;
      height += highlightPadding * 2;
      top -= highlightPadding;
      left -= highlightPadding;
    } else {
      const { scrollTop, scrollLeft } = getWindowScroll();
      top += scrollTop;
      left += scrollLeft;
    }

    setStyle(highlightLayer, {
      width: `${width}px`,
      height: `${height}px`,
      top: `${top}px`,
      left: `${left}px`,
    });
  };

  const showPopupGuide = () => {
    currentHighlightLayerElm.current = getTargetElm(currentStepInfo.element);

    setTimeout(() => {
      scrollToParentVisibleArea(currentHighlightLayerElm.current);
      setHighlightLayerPosition(highlightLayerRef.current);
      setHighlightLayerPosition(referenceLayerRef.current);
      scrollToElm(currentHighlightLayerElm.current);
    });
  };

  const destroyTooltipElm = () => {
    referenceLayerRef.current?.parentNode.removeChild(referenceLayerRef.current);
  };

  const showDialogGuide = () => {
    setTimeout(() => {
      currentHighlightLayerElm.current = dialogTooltipRef.current;
      scrollToParentVisibleArea(currentHighlightLayerElm.current);
      setHighlightLayerPosition(highlightLayerRef.current);
      scrollToElm(currentHighlightLayerElm.current);
    });
  };

  const destroyDialogTooltipElm = () => {
    dialogTooltipRef.current?.parentNode.removeChild(dialogTooltipRef.current);
    dialogWrapperRef.current?.parentNode.removeChild(dialogWrapperRef.current);
  };

  const showGuide = () => {
    if (isPopup) {
      destroyDialogTooltipElm();
      showPopupGuide();
    } else {
      destroyTooltipElm();
      showDialogGuide();
    }
  };

  const destroyGuide = () => {
    destroyTooltipElm();
    destroyDialogTooltipElm();
    highlightLayerRef.current?.parentNode.removeChild(highlightLayerRef.current);
    overlayLayerRef.current?.parentNode.removeChild(overlayLayerRef.current);
    removeClass(document.body, lockCls);
  };

  const handleSkip = (e) => {
    const total = stepsTotal;
    setActive(false);
    setInnerCurrent(-1, { e, total });
    props.onSkip?.({ e, current: innerCurrent, total });
  };

  const handlePrev = (e) => {
    const total = stepsTotal;
    setInnerCurrent(innerCurrent - 1, { e, total });
    props.onPrevStepClick?.({
      e,
      prev: innerCurrent - 1,
      current: innerCurrent,
      total,
    });
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
    setActive(false);
    setInnerCurrent(-1, { e, total });
    props.onFinish?.({ e, current: innerCurrent, total });
  };

  const initGuide = () => {
    if (innerCurrent >= 0 && innerCurrent < steps.length) {
      if (!active) {
        setActive(true);
        addClass(document.body, lockCls);
      }
      showGuide();
    }
  };

  useEffect(() => {
    if (innerCurrent >= 0 && innerCurrent < steps.length) {
      initGuide();
    } else {
      setActive(false);
      destroyGuide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerCurrent]);

  useEffect(() => {
    initGuide();

    return destroyGuide;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderOverlayLayer = () =>
    createPortal(
      <div ref={overlayLayerRef} className={`${prefixCls}__overlay`} style={{ zIndex: zIndex - 2 }} />,
      document.body,
    );

  const renderHighlightLayer = () => {
    const style = { zIndex: zIndex - 1 };
    const highlightClass = [
      `${prefixCls}__highlight`,
      `${prefixCls}__highlight--${isPopup ? 'popup' : 'dialog'}`,
      `${prefixCls}--${currentElmIsFixed && isPopup ? 'fixed' : 'absolute'}`,
    ];
    const showOverlay = getCurrentCrossProps('showOverlay');
    const maskClass = [`${prefixCls}__highlight--${showOverlay ? 'mask' : 'nomask'}`];
    const { highlightContent } = currentStepInfo;
    const showHighlightContent = highlightContent && isPopup;
    return createPortal(
      <div
        ref={highlightLayerRef}
        className={cx(highlightClass.concat(showHighlightContent ? highlightClass : maskClass))}
        style={style}
      >
        {showHighlightContent &&
          React.cloneElement(highlightContent, {
            className: cx(highlightClass.concat(maskClass, highlightContent.props.className)),
            style: { ...style, ...highlightContent.props.style },
          })}
      </div>,
      document.body,
    );
  };

  const renderCounter = () => {
    const popupSlotCounter = isFunction(counter) ? counter({ total: stepsTotal, current: innerCurrent }) : counter;

    const popupDefaultCounter = (
      <div className={`${prefixCls}__counter`}>
        {popupSlotCounter || (
          <>
            {innerCurrent + 1}/{stepsTotal}
          </>
        )}
      </div>
    );
    return <>{!hideCounter && popupDefaultCounter}</>;
  };

  const renderAction = (mode: TdGuideProps['mode']) => {
    const isLast = innerCurrent === stepsTotal - 1;
    const isFirst = innerCurrent === 0;
    const buttonSize = mode === 'popup' ? 'small' : 'medium';

    return (
      <div className={`${prefixCls}__action`}>
        {!hideSkip && !isLast && (
          <Button
            className={`${prefixCls}__skip`}
            theme="default"
            size={buttonSize}
            variant="base"
            onClick={handleSkip}
            {...(getCurrentCrossProps('skipButtonProps') ?? guideGlobalConfig.skipButtonProps)}
          />
        )}
        {!hidePrev && !isFirst && (
          <Button
            className={`${prefixCls}__prev`}
            theme="primary"
            size={buttonSize}
            variant="base"
            onClick={handlePrev}
            {...(getCurrentCrossProps('prevButtonProps') ?? guideGlobalConfig.prevButtonProps)}
          />
        )}
        {!isLast && (
          <Button
            className={`${prefixCls}__next`}
            theme="primary"
            size={buttonSize}
            variant="base"
            onClick={handleNext}
            {...(getCurrentCrossProps('nextButtonProps') ?? guideGlobalConfig.nextButtonProps)}
          />
        )}
        {isLast && (
          <Button
            className={`${prefixCls}__finish`}
            theme="primary"
            size={buttonSize}
            variant="base"
            onClick={handleFinish}
            {...(props.finishButtonProps ?? guideGlobalConfig.finishButtonProps)}
          />
        )}
      </div>
    );
  };

  const renderTooltipBody = () => {
    const title = <div className={`${prefixCls}__title`}>{currentStepInfo.title}</div>;
    const { body: descBody } = currentStepInfo;

    const desc = <div className={`${prefixCls}__desc`}>{descBody}</div>;

    return (
      <>
        {title}
        {desc}
      </>
    );
  };

  const renderPopupContent = () => {
    const footerClasses = [`${prefixCls}__footer`, `${prefixCls}__footer--popup`];
    const action = (
      <div className={cx(footerClasses)}>
        {renderCounter()}
        {renderAction('popup')}
      </div>
    );

    return (
      <div className={`${prefixCls}__tooltip`}>
        {renderTooltipBody()}
        {action}
      </div>
    );
  };

  const renderPopupGuide = () => {
    const content = currentStepInfo.children ?? currentStepInfo.content;
    let renderBody;
    if (React.isValidElement(content)) {
      const contentProps = {
        handlePrev,
        handleNext,
        handleSkip,
        handleFinish,
        current: innerCurrent,
        total: stepsTotal,
      };
      renderBody = isFunction(content) ? content(contentProps) : content;
    } else {
      renderBody = renderPopupContent();
    }

    const classes = [`${prefixCls}__reference`, `${prefixCls}--${currentElmIsFixed ? 'fixed' : 'absolute'}`];

    const innerClassName: PopupProps['overlayInnerClassName'] = [{ [`${prefixCls}__popup--content`]: !!content }];
    return createPortal(
      <Popup
        visible={true}
        content={renderBody}
        showArrow={!content}
        zIndex={zIndex}
        placement={currentStepInfo.placement as StepPopupPlacement}
        {...currentStepInfo.popupProps}
        overlayClassName={currentStepInfo.stepOverlayClass}
        overlayInnerClassName={innerClassName.concat(currentStepInfo.popupProps?.overlayInnerClassName)}
      >
        <div ref={referenceLayerRef} className={cx(classes)} />
      </Popup>,
      document.body,
    );
  };

  const renderDialogGuide = () => {
    const style = { zIndex };
    const wrapperClasses = [
      `${prefixCls}__wrapper`,
      { [`${prefixCls}__wrapper--center`]: currentStepInfo.placement === 'center' },
    ];
    const dialogClasses = [
      `${prefixCls}__reference`,
      `${prefixCls}--absolute`,
      `${prefixCls}__dialog`,
      {
        [`${prefixCls}__dialog--nomask`]: !getCurrentCrossProps('showOverlay'),
        [currentStepInfo.stepOverlayClass]: !!currentStepInfo.stepOverlayClass,
      },
    ];
    const footerClasses = [`${prefixCls}__footer`, `${prefixCls}__footer--popup`];
    return (
      <>
        {createPortal(
          <div ref={dialogWrapperRef} className={cx(wrapperClasses)} style={style}>
            <div ref={dialogTooltipRef} className={cx(dialogClasses)}>
              {renderTooltipBody()}
              <div className={cx(footerClasses)}>
                {renderCounter()}
                {renderAction('dialog')}
              </div>
            </div>
          </div>,
          document.body,
        )}
      </>
    );
  };

  const renderGuide = () => (
    <>
      {renderOverlayLayer()}
      {renderHighlightLayer()}
      {isPopup ? renderPopupGuide() : renderDialogGuide()}
    </>
  );

  return <>{active && renderGuide()}</>;
};

Guide.displayName = 'Guide';

export default Guide;
