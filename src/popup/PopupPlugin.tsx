import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPopper, Instance, Placement } from '@popperjs/core';
import isString from 'lodash/isString';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { render, unmount } from '../_util/react-render';
import { on, off, getAttach } from '../_util/dom';
import { TNode } from '../common';
import { TdPopupProps } from './type';
import useDefaultProps from '../hooks/useDefaultProps';
import { popupDefaultProps } from './defaultProps';

export interface PopupPluginApi {
  config: TdPopupProps;
}

type TriggerEl = string | HTMLElement;

export interface OverlayProps extends TdPopupProps {
  triggerEl: TriggerEl;
  renderCallback: (instance: HTMLElement) => void;
}

const triggers = ['click', 'hover', 'focus', 'context-menu'] as const;

let popperInstance: Instance;
let overlayInstance: HTMLElement;
let timeout: NodeJS.Timeout;
let triggerEl: HTMLElement;

const componentName = 't-popup';

const triggerType = (triggerProps: string) =>
  triggers.reduce(
    (map, trigger) => ({
      ...map,
      [trigger]: triggerProps.includes(trigger),
    }),
    {} as Record<(typeof triggers)[number], boolean>,
  );

function getPopperPlacement(placement: TdPopupProps['placement']) {
  return placement.replace(/-(left|top)$/, '-start').replace(/-(right|bottom)$/, '-end') as Placement;
}

const Overlay: React.FC<OverlayProps> = (originalProps) => {
  const props = useDefaultProps(originalProps, popupDefaultProps);
  const {
    trigger,
    content,
    showArrow,
    disabled,
    overlayInnerClassName,
    hideEmptyPopup,
    overlayClassName,
    overlayStyle,
    zIndex,
    overlayInnerStyle,
    renderCallback,
  } = props;

  const [visibleState, setVisibleState] = useState(false);
  const popperRef = useRef<HTMLDivElement>();
  const overlayRef = useRef<HTMLDivElement>();

  const hidePopup = hideEmptyPopup && isString(content) && ['', undefined, null].includes(content);

  const stylePoper = (): React.CSSProperties => {
    let style = {};
    if (hidePopup) {
      style = { visibility: 'hidden', pointerEvents: 'none' };
    }
    return {
      ...style,
      zIndex,
      ...overlayStyle,
    };
  };

  // useMemo
  const hasTrigger = useMemo(() => triggerType(trigger), [trigger]);
  const overlayClasses = useMemo(
    () => [
      `${componentName}__content`,
      {
        [`${componentName}__content--text`]: content === 'string',
        [`${componentName}__content--arrow`]: showArrow,
        [`${componentName}-is-disabled`]: disabled,
      },
      overlayInnerClassName,
    ],
    [content, overlayInnerClassName, showArrow, disabled],
  );

  // method
  const handleMouseLeave = () => {
    setVisibleState(false);
    removeOverlayInstance();
    popperInstance?.destroy();
    popperInstance = null;
  };
  const handleMouseEnter = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  const overlayInnerStyleMerge = () => {
    if (!overlayInnerStyle || !triggerEl || !popperRef.current) {
      return {};
    }
    if (typeof overlayInnerStyle === 'object') {
      return overlayInnerStyle;
    }
    return overlayInnerStyle(triggerEl, popperRef.current);
  };

  // mounted
  useLayoutEffect(() => {
    setVisibleState(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eventProps = hasTrigger.hover && {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseEnter,
  };

  // render node
  const renderNode = (
    <div
      ref={(ref) => {
        popperRef.current = ref;
        renderCallback(ref);
      }}
      className={classNames([componentName, overlayClassName])}
      style={stylePoper()}
      {...eventProps}
    >
      <div ref={overlayRef} className={classNames(overlayClasses)} style={overlayInnerStyleMerge()}>
        {content}
        {showArrow && <div className={`${componentName}__arrow`}></div>}
      </div>
    </div>
  );

  return visibleState ? (
    <CSSTransition appear timeout={0} in={visibleState} nodeRef={popperRef}>
      {renderNode}
    </CSSTransition>
  ) : null;
};

function removeOverlayInstance() {
  if (overlayInstance) {
    unmount(overlayInstance);
    overlayInstance.remove();
    overlayInstance = null;
  }
  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }
}

export type PluginMethod = (triggerEl: TriggerEl, content: TNode, popupProps?: TdPopupProps) => Promise<Instance>;

const renderInstance = (props, attach: HTMLElement): Promise<HTMLElement> =>
  new Promise((resolve) => {
    render(<Overlay {...props} renderCallback={(instance) => resolve(instance)} />, attach);
  });

const createPopupInstance: PluginMethod = async (trigger, content, popupProps) => {
  const hasTrigger = triggerType(popupProps?.trigger || 'hover');
  const currentTriggerEl = getAttach(trigger);
  if (triggerEl && hasTrigger.click) {
    return;
  }
  triggerEl = currentTriggerEl;
  removeOverlayInstance();

  let attach = getAttach(popupProps?.attach || 'body');

  const delay = [].concat(popupProps?.delay ?? [250, 150]);
  const closeDelay = delay[1] ?? delay[0];

  if (attach === document.body) {
    // don't allow mount on body directly
    const popupDom = document.createElement('div');
    document.body.appendChild(popupDom);
    attach = popupDom;

    overlayInstance = attach;
  }

  const instance = await renderInstance({ ...{ ...popupProps, content, triggerEl } }, attach);

  if (hasTrigger.hover) {
    const mouseoutEvent = () => {
      timeout = setTimeout(removeOverlayInstance, closeDelay);
      off(triggerEl, 'mouseleave', mouseoutEvent);
    };
    on(triggerEl, 'mouseleave', mouseoutEvent);
  } else if (hasTrigger.focus) {
    const focusoutEvent = () => {
      timeout = setTimeout(removeOverlayInstance, closeDelay);
      off(triggerEl, 'focusout', focusoutEvent);
    };
    on(triggerEl, 'focusout', focusoutEvent);
  }

  popperInstance = createPopper(triggerEl, instance, {
    placement: getPopperPlacement(popupProps?.placement || ('top' as TdPopupProps['placement'])),
    ...popupProps?.popperOptions,
  });
  return popperInstance;
};

const PopupPlugin: PluginMethod = (trigger, content, popupProps) => createPopupInstance(trigger, content, popupProps);

export default PopupPlugin;
