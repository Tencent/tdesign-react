import React, { forwardRef, useCallback, useMemo, MouseEvent } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import type { TdStickyItemProps, TdStickyToolProps } from './type';
import Popup, { PopupProps } from '../popup';
import type { StyledProps, Styles } from '../common';

export interface StickyItemProps extends TdStickyItemProps, StyledProps {
  type?: TdStickyToolProps['type'];
  shape?: TdStickyToolProps['shape'];
  placement?: TdStickyToolProps['placement'];
  basePopupProps?: PopupProps;
  baseWidth?: TdStickyToolProps['width'];
  onClick?: TdStickyToolProps['onClick'];
  onHover?: TdStickyToolProps['onHover'];
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
    (e: MouseEvent<HTMLDivElement>) => {
      const item = {
        icon,
        label,
        popup,
        popupProps,
        trigger,
      };
      onClick({ e, item });
    },
    [icon, label, popup, popupProps, trigger, onClick],
  );
  const handleHoverItem = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const item = {
        icon,
        label,
        popup,
        popupProps,
        trigger,
      };
      onHover({ e, item });
    },
    [icon, label, popup, popupProps, trigger, onHover],
  );
  const finalPopupProps = { hideEmptyPopup: true, ...basePopupProps, ...popupProps };

  return (
    <Popup
      overlayInnerClassName={classNames(`${classPrefix}-sticky-tool-popup-content`)}
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
        {props.type === 'normal' ? (
          <div className={classNames(`${classPrefix}-sticky-item__label`)}>{label}</div>
        ) : null}
      </div>
    </Popup>
  );
});

StickyItem.displayName = 'StickyItem';

export default StickyItem;
