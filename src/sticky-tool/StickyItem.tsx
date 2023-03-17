import React, { forwardRef, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdStickyItemProps } from './type';
import Popup from '../popup';
import { StyledProps, Styles } from '../common';

export interface StickyItemProps extends TdStickyItemProps, StyledProps {
  type?: String;
  shape?: String;
  placement?: String;
  basePopupProps?: Object;
  baseWidth?: String | Number;
  onClick?: Function;
  onHover?: Function;
  children?: React.ReactNode;
}

const StickyItem = forwardRef((props: StickyItemProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    icon,
    label,
    popup,
    popupProps,
    trigger,
    type,
    shape,
    placement,
    basePopupProps,
    baseWidth,
    onClick,
    onHover,
    style,
    className,
  } = props;
  const { classPrefix } = useConfig();
  const popupPlacement = useMemo(() => (placement.indexOf('right') !== -1 ? 'left' : 'right'), [placement]);
  const styles = useMemo(() => {
    const styles: Styles = { ...style };
    if (baseWidth) {
      const selfWidth = type === 'normal' ? '56px' : '40px';
      styles.margin = `calc((${baseWidth} - ${selfWidth})/2)`;
    }
    return styles;
  }, [baseWidth, style, type]);
  const handleClickItem = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const item = {
        icon,
        label,
        popup,
        popupProps,
        trigger,
      };
      onClick(e, item);
    },
    [icon, label, popup, popupProps, trigger, onClick],
  );
  const handleHoverItem = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const item = {
        icon,
        label,
        popup,
        popupProps,
        trigger,
      };
      onHover(e, item);
    },
    [icon, label, popup, popupProps, trigger, onHover],
  );
  const finalPopupProps = { hideEmptyPopup: true, ...basePopupProps, ...popupProps };

  return (
    <Popup
      trigger={props.trigger}
      hideEmptyPopup={true}
      placement={popupPlacement}
      content={popup}
      {...finalPopupProps}
    >
      <div
        ref={ref}
        className={classNames(
          `${classPrefix}-sticky-item`,
          `${classPrefix}-sticky-item--${shape}`,
          `${classPrefix}-sticky-item--${type}`,
          className,
        )}
        style={styles}
        onClick={handleClickItem}
        onMouseEnter={handleHoverItem}
      >
        {icon}
        {props.type === 'normal' ? <div className={classNames(`${classPrefix}-sticky-itemlabel`)}>{label}</div> : null}
      </div>
    </Popup>
  );
});

StickyItem.displayName = 'StickyItem';

export default StickyItem;
