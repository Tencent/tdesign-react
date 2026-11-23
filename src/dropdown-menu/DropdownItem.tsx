import { useClickAway } from 'ahooks';
import cx from 'classnames';
import uniqueId from 'lodash-es/uniqueId';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CaretDownSmallIcon, CaretUpSmallIcon } from 'tdesign-icons-react';
import Button from '../button';
import Checkbox from '../checkbox';
import Popup from '../popup';
import { RadioGroup } from '../radio';
import useDefault from '../_util/useDefault';
import parseTNode from '../_util/parseTNode';
import CheckboxGroup from '../checkbox/CheckboxGroup';
import { StyledProps } from '../common';
import useDefaultProps from '../hooks/useDefaultProps';
import useConfig from '../hooks/useConfig';
import { usePrefixClass } from '../hooks/useClass';
import { dropdownItemDefaultProps } from './defaultProps';
import DropdownMenuContext from './DropdownMenuContext';
import type { TdDropdownItemProps } from './type';

export interface DropdownItemProps extends TdDropdownItemProps, StyledProps {
  children?: React.ReactNode;
}

const DropdownItem: React.FC<DropdownItemProps> = (props) => {
  const {
    className,
    children,
    style,
    disabled,
    options: inputOptions,
    optionsColumns,
    placement,
    label,
    value,
    defaultValue,
    onChange,
    multiple,
    onClose,
    onClosed,
    onConfirm,
    onOpen,
    onOpened,
    onReset,
    footer,
    keys,
    icon,
    keepLabelActive,
  } = useDefaultProps<DropdownItemProps>(props, dropdownItemDefaultProps);
  const { classPrefix } = useConfig();
  const dropdownMenuClass = usePrefixClass('dropdown-menu');
  const dropdownItemClass = usePrefixClass('dropdown-item');

  const [innerValue, setInnerValue] = useDefault(value, defaultValue, onChange);
  const [modalValue, setModalValue] = useState(innerValue);

  const options = useMemo(
    () =>
      inputOptions.map((item) => ({
        value: item[keys?.value ?? 'value'],
        label: item[keys?.label ?? 'label'],
        disabled: item[keys?.disabled ?? 'disabled'],
      })),
    [keys, inputOptions],
  );

  const [id] = useState(() => uniqueId());

  const { direction, activedId, onChangeActivedId, showOverlay, zIndex, closeOnClickOverlay, duration } =
    useContext(DropdownMenuContext);

  const labelText = useMemo(
    () => label || options.find((item) => item.value === innerValue)?.label || '',
    [options, label, innerValue],
  );

  const isActived = id === activedId;

  const keepLabelActived = useMemo(
    () => Boolean(multiple && keepLabelActive && Array.isArray(innerValue) && innerValue.length > 0),
    [multiple, keepLabelActive, innerValue],
  );

  // wrapperVisible 控制外层挂载，isShowItems 控制弹层动画（两段式卸载）
  const [wrapperVisible, setWrapperVisible] = useState(isActived);
  const [isShowItems, setIsShowItems] = useState(isActived);

  const dropdownItemEventRef = useRef({ onOpen, onClose, onOpened, onClosed });
  dropdownItemEventRef.current = { onOpen, onClose, onOpened, onClosed };

  const prevActivedRef = useRef(isActived);
  useLayoutEffect(() => {
    const prevActived = prevActivedRef.current;
    prevActivedRef.current = isActived;
    if (prevActived === isActived) return;

    const {
      onOpen: handleOpen,
      onClose: handleClose,
      onOpened: handleOpened,
      onClosed: handleClosed,
    } = dropdownItemEventRef.current;
    const durationMs = Number(duration);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isActived) {
      // 展开：先挂载 wrapper，提交后由下一个 effect 触发进入动画
      handleOpen?.();
      setWrapperVisible(true);
      timer = setTimeout(() => {
        handleOpened?.();
      }, durationMs);
    } else {
      // 收起：先关闭弹层触发退出动画，动画结束后卸载 wrapper
      handleClose?.();
      setIsShowItems(false);
      timer = setTimeout(() => {
        handleClosed?.();
        setWrapperVisible(false);
      }, durationMs);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActived, duration]);

  // wrapper 挂载完成后，再切换弹层 visible 以触发进入动画
  // 用 useLayoutEffect 在绘制前同步完成挂载 + 动画切换，避免中间帧导致遮罩动画卡顿
  useLayoutEffect(() => {
    if (wrapperVisible && isActived) {
      setIsShowItems(true);
    }
  }, [wrapperVisible, isActived]);

  const menuItemRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const getDropdownItemStyle = () => {
    const ele = menuItemRef.current;
    if (!ele) {
      return {};
    }

    const { top, bottom } = ele.getBoundingClientRect();

    if (direction === 'up') {
      return {
        zIndex,
        bottom: `calc(100vh - ${top}px)`,
      };
    }

    return {
      zIndex,
      top: `${bottom}px`,
    };
  };

  useClickAway(() => {
    if (!isActived || !closeOnClickOverlay) {
      return;
    }
    onChangeActivedId('');
  }, itemRef);

  useEffect(() => {
    if (isActived) {
      setModalValue(innerValue);
    }
  }, [isActived, innerValue]);

  useEffect(() => {
    if (disabled && isActived) {
      onChangeActivedId('');
    }
  }, [disabled, isActived, onChangeActivedId]);

  const attach = useCallback(() => itemRef.current || document.body, []);

  const renderIcon = () => {
    const iconClass = cx(`${dropdownMenuClass}__icon`, {
      [`${dropdownMenuClass}__icon--active`]: isActived,
    });

    // 使用自定义图标
    if (icon) {
      const isArray = Array.isArray(icon);
      const isTwoIcons = isArray && icon.length === 2;

      let selectedIcon: DropdownItemProps['icon'];
      if (isTwoIcons) {
        selectedIcon = isActived ? icon[0] : icon[1];
      } else {
        selectedIcon = isArray ? icon[0] : icon;
      }

      return <div className={iconClass}>{parseTNode(selectedIcon)}</div>;
    }

    return direction === 'down' ? (
      <CaretDownSmallIcon className={iconClass} />
    ) : (
      <CaretUpSmallIcon className={iconClass} />
    );
  };

  return (
    <>
      <div
        ref={menuItemRef}
        className={cx(`${dropdownMenuClass}__item`, {
          [`${dropdownMenuClass}__item--active`]: isActived || keepLabelActived,
          [`${dropdownMenuClass}__item--disabled`]: disabled,
        })}
        onClick={(e) => {
          if (disabled) {
            return;
          }
          onChangeActivedId(isActived ? '' : id);
          if (!isActived) {
            e.stopPropagation();
          }
        }}
      >
        <div className={`${dropdownMenuClass}__title`}>{labelText}</div>
        {renderIcon()}
      </div>
      {wrapperVisible ? (
        <div
          key={id}
          className={cx(dropdownItemClass, className)}
          style={{
            ...style,
            ...getDropdownItemStyle(),
          }}
          ref={itemRef}
        >
          <Popup
            attach={attach}
            visible={isShowItems}
            placement={direction === 'up' ? 'bottom' : 'top'}
            closeOnOverlayClick={closeOnClickOverlay}
            showOverlay={showOverlay}
            zIndex={zIndex}
            duration={Number(duration)}
            style={{
              position: 'absolute',
              overflow: 'hidden',
            }}
            overlayProps={{
              style: {
                position: 'absolute',
              },
            }}
            onVisibleChange={(visible) => {
              if (!visible) {
                onChangeActivedId('');
              }
            }}
          >
            <div className={cx(`${dropdownItemClass}__content`, `${classPrefix}-popup__content`)}>
              <div className={cx(`${dropdownItemClass}__body`)}>
                {parseTNode(children) || (
                  <>
                    {multiple ? (
                      <CheckboxGroup
                        value={modalValue as (string | number)[]}
                        onChange={(value) => {
                          if (disabled) return;
                          setModalValue(value as (string | number)[]);
                        }}
                        className={`${dropdownItemClass}__checkbox-group`}
                        style={{
                          gridTemplateColumns: `repeat(${optionsColumns}, 1fr)`,
                        }}
                      >
                        {options.map((item, index) => (
                          <Checkbox
                            key={`${item.value}-${index}`}
                            className={`${dropdownItemClass}__checkbox-item t-checkbox--tag`}
                            icon={false}
                            borderless
                            value={item.value as string | number}
                            label={item.label}
                            disabled={item.disabled}
                          />
                        ))}
                      </CheckboxGroup>
                    ) : (
                      <RadioGroup
                        className={`${dropdownItemClass}__radio-group`}
                        icon="line"
                        options={options}
                        placement={placement}
                        value={modalValue as string | number}
                        onChange={(value: string | number) => {
                          if (disabled) return;
                          setModalValue(value);
                          setInnerValue(value);
                          onChangeActivedId('');
                        }}
                      />
                    )}
                  </>
                )}
              </div>
              {parseTNode(footer) ||
                (multiple && (
                  <div className={`${dropdownItemClass}__footer`}>
                    <Button
                      disabled={Array.isArray(modalValue) && modalValue.length === 0}
                      theme="light"
                      className={`${dropdownItemClass}__footer-btn ${dropdownItemClass}__reset-btn`}
                      onClick={() => {
                        if (disabled) return;
                        if (typeof onReset === 'function') {
                          onReset(modalValue);
                        } else {
                          setModalValue(innerValue);
                        }
                      }}
                    >
                      重置
                    </Button>
                    <Button
                      disabled={Array.isArray(modalValue) && modalValue.length === 0}
                      theme="primary"
                      className={`${dropdownItemClass}__footer-btn ${dropdownItemClass}__confirm-btn`}
                      onClick={() => {
                        if (disabled) return;
                        if (typeof onConfirm === 'function') {
                          onConfirm(modalValue);
                        } else {
                          setInnerValue(modalValue);
                        }
                        onChangeActivedId('');
                      }}
                    >
                      确定
                    </Button>
                  </div>
                ))}
            </div>
          </Popup>
        </div>
      ) : null}
    </>
  );
};

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
