import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import Popup, { PopupVisibleChangeContext } from '../popup';
import useSingle from './useSingle';
import useMultiple from './useMultiple';
import useOverlayInnerStyle from './useOverlayInnerStyle';
import { TdSelectInputProps } from './type';
import { StyledProps } from '../common';
import { selectInputDefaultProps } from './defaultProps';

export interface SelectInputProps extends TdSelectInputProps, StyledProps {
  updateScrollTop?: (content: HTMLDivElement) => void;
}

const SelectInput = forwardRef((props: SelectInputProps, ref) => {
  const selectInputRef = useRef();
  const selectInputWrapRef = useRef();
  const { classPrefix: prefix } = useConfig();
  const { multiple, value, popupVisible, popupProps, borderless, disabled } = props;
  const { commonInputProps, inputRef, singleInputValue, onInnerClear, renderSelectSingle } = useSingle(props);
  const { tagInputRef, multipleInputValue, renderSelectMultiple } = useMultiple(props);

  const { tOverlayInnerStyle, innerPopupVisible, onInnerPopupVisibleChange } = useOverlayInnerStyle(props, {
    afterHidePopup: onInnerBlur,
  });

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

  // SelectInput.blur is not equal to Input or TagInput, example: click popup panel.
  // if trigger blur on click popup panel, filter data of tree select can not be checked.
  function onInnerBlur(ctx: PopupVisibleChangeContext) {
    const inputValue = props.multiple ? multipleInputValue : singleInputValue;
    const params: Parameters<TdSelectInputProps['onBlur']>[1] = { e: ctx.e, inputValue };
    props.onBlur?.(props.value, params);
  }

  // TODO: Popup trigger need to support array. both click and focus can open panel
  const mainContent = (
    <div className={popupClasses} style={props.style}>
      <Popup
        ref={selectInputRef}
        trigger={popupProps?.trigger || 'click'}
        placement="bottom-left"
        content={props.panel}
        hideEmptyPopup={true}
        onVisibleChange={onInnerPopupVisibleChange}
        updateScrollTop={props.updateScrollTop}
        {...visibleProps}
        {...popupProps}
        disabled={disabled}
        overlayInnerStyle={tOverlayInnerStyle}
      >
        {multiple
          ? renderSelectMultiple({
              commonInputProps,
              onInnerClear,
              popupVisible: visibleProps.visible,
              allowInput: props.allowInput,
            })
          : renderSelectSingle(visibleProps.visible)}
      </Popup>
    </div>
  );

  if (!props.tips) return mainContent;

  return (
    <div ref={selectInputWrapRef} className={`${prefix}-select-input__wrap`}>
      {mainContent}
      {props.tips && (
        <div className={`${prefix}-input__tips ${prefix}-input__tips--${props.status || 'normal'}`}>{props.tips}</div>
      )}
    </div>
  );
});

SelectInput.displayName = 'SelectInput';
SelectInput.defaultProps = selectInputDefaultProps;

export default SelectInput;
