import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import Popup from '../popup';
import useSingle from './useSingle';
import useMultiple from './useMultiple';
import useOverlayStyle from './useOverlayStyle';
import { TdSelectInputProps } from './type';
import { StyledProps } from '../common';

export interface SelectInputProps extends TdSelectInputProps, StyledProps {}

const SelectInput = forwardRef((props: SelectInputProps, ref) => {
  const selectInputRef = useRef();
  const { classPrefix: prefix } = useConfig();
  const { multiple, value, popupVisible, popupProps, borderless } = props;
  const { commonInputProps, inputRef, onInnerClear, renderSelectSingle } = useSingle(props);
  const { tPlaceholder, tagInputRef, renderSelectMultiple } = useMultiple(props);
  const { tOverlayStyle, innerPopupVisible, onInnerPopupVisibleChange } = useOverlayStyle(props);

  const popupClasses = classNames([
    props.className,
    `${prefix}-select-input`,
    {
      [`${prefix}-select-input--borderless`]: borderless,
      [`${prefix}-select-input--multiple`]: multiple,
      [`${prefix}-select-input--popup-visible`]: popupVisible ?? innerPopupVisible,
      [`${prefix}-select-input--empty`]: value instanceof Array ? !value.length : !value,
    },
  ]);

  useImperativeHandle(ref, () => ({
    ...(selectInputRef.current || {}),
    ...(inputRef.current || {}),
    ...(tagInputRef.current || {}),
  }));

  // 浮层显示的受控与非受控
  const visibleProps = { visible: popupVisible ?? innerPopupVisible };
  // 单选，值的呈现方式
  const singleValueDisplay = !multiple ? props.valueDisplay : null;
  // 左侧文本
  const prefixContent = [singleValueDisplay, props.label].filter((v) => v);

  return (
    <Popup
      ref={selectInputRef}
      style={props.style}
      className={popupClasses}
      trigger={popupProps?.trigger || 'click'}
      placement="bottom-left"
      content={props.panel}
      overlayStyle={tOverlayStyle}
      hideEmptyPopup={true}
      onVisibleChange={onInnerPopupVisibleChange}
      {...visibleProps}
      {...popupProps}
    >
      {multiple
        ? renderSelectMultiple({
            commonInputProps,
            onInnerClear,
          })
        : renderSelectSingle({
            prefixContent,
            singleValueDisplay,
            tPlaceholder,
          })}
    </Popup>
  );
});

SelectInput.displayName = 'SelectInput';

export default SelectInput;
