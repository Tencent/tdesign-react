import React, { forwardRef, useRef, useState, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useControlled from '../hooks/useControlled';
import { ClassName, StyledProps } from '../common';
import { AutoCompleteOption, TdAutoCompleteProps } from './type';
import { autoCompleteDefaultProps } from './defaultProps';
import useCommonClassName from '../hooks/useCommonClassName';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import Input, { InputProps, InputRef, TdInputProps } from '../input';
import Popup, { PopupProps, PopupRef } from '../popup';
import AutoCompleteOptionList, { OptionsListProps } from './OptionList';
import useDefaultProps from '../hooks/useDefaultProps';

export interface AutoCompleteProps<T extends AutoCompleteOption = AutoCompleteOption>
  extends TdAutoCompleteProps<T>,
    StyledProps {}

export interface AutoCompleteRef {
  inputRef: InputRef;
  popupRef: PopupRef;
}

const AutoComplete = forwardRef<AutoCompleteRef, AutoCompleteProps>((originalProps, ref) => {
  const props = useDefaultProps(originalProps, autoCompleteDefaultProps);
  const inputRef = useRef();
  const popupRef = useRef();
  const [tValue, setTValue] = useControlled(props, 'value', props.onChange);
  const { classPrefix, sizeClassNames } = useCommonClassName();
  const [global] = useLocaleReceiver('input');

  const [popupVisible, setPopupVisible] = useState(false);
  const optionListRef = useRef(null);

  useImperativeHandle(ref, () => ({
    inputRef: inputRef.current,
    popupRef: popupRef.current,
  }));

  const getOverlayStyle = (trigger: HTMLElement, popupElement: HTMLElement) => {
    const triggerWidth = trigger.getBoundingClientRect().width || trigger.offsetWidth || trigger.clientWidth;
    const popupWidth =
      popupElement.getBoundingClientRect().width || popupElement.offsetWidth || popupElement.clientWidth;
    return {
      width: triggerWidth >= popupWidth ? `${triggerWidth}px` : 'auto',
      ...props.popupProps?.overlayInnerStyle,
    };
  };

  const classes = [`${classPrefix}-auto-complete`].concat(props.className);
  const popupClasses = (() => {
    let classes: ClassName = [`${classPrefix}-select__dropdown`];
    if (props.popupProps?.overlayClassName) {
      classes = classes.concat(props.popupProps.overlayClassName);
    }
    return classNames(classes);
  })();
  const popupInnerClasses = (() => {
    let classes: ClassName = [`${classPrefix}-select__dropdown-inner`];
    if (props.popupProps?.overlayInnerClassName) {
      classes = classes.concat(props.popupProps.overlayInnerClassName);
    }
    return classNames(classes);
  })();

  const onInputChange: TdInputProps['onChange'] = (value, context) => {
    setTValue(value, context);
  };

  const innerInputProps = (() => {
    const tProps: InputProps = {
      value: tValue,
      size: props.size,
      ...props.inputProps,
    };
    return tProps;
  })();

  const onInnerFocus: InputProps['onFocus'] = (value, context) => {
    setPopupVisible(true);
    props.onFocus?.({ ...context, value });
    const timer = setTimeout(() => {
      optionListRef.current?.addKeyboardListener();
      clearTimeout(timer);
    }, 0);
  };

  const onInnerBlur: InputProps['onBlur'] = (value, context) => {
    props.onBlur?.({ ...context, value });
  };

  const onInnerEnter: InputProps['onEnter'] = (value, context) => {
    props.onEnter?.({ ...context, value });
  };

  const onInnerCompositionend: InputProps['onCompositionend'] = (value, context) => {
    props.onCompositionend?.({ ...context, value });
  };

  const onInnerCompositionstart: InputProps['onCompositionstart'] = (value, context) => {
    props.onCompositionstart?.({ ...context, value });
  };

  const onInnerSelect: OptionsListProps['onSelect'] = (value, context) => {
    if (props.readonly || props.disabled) return;
    setPopupVisible(false);
    setTValue(value, context);
    props.onSelect?.(value, context);
  };

  const onPopupVisibleChange: PopupProps['onVisibleChange'] = (visible, { trigger }) => {
    if (trigger !== 'trigger-element-click') {
      setPopupVisible(visible);
    }
  };

  // 触发元素
  const triggerNode = props.triggerElement || props.children || (
    <Input
      ref={inputRef}
      placeholder={props.placeholder ?? global.placeholder}
      tips={props.tips}
      status={props.status}
      readonly={props.readonly}
      disabled={props.disabled}
      clearable={props.clearable}
      autofocus={props.autofocus}
      onClear={props.onClear}
      onChange={onInputChange}
      onFocus={onInnerFocus}
      onBlur={onInnerBlur}
      onEnter={onInnerEnter}
      onCompositionend={onInnerCompositionend}
      onCompositionstart={onInnerCompositionstart}
      {...innerInputProps}
    />
  );
  // 联想词列表
  const listContent = Array.isArray(props.options) && (
    <AutoCompleteOptionList
      ref={optionListRef}
      value={tValue}
      options={props.options}
      size={props.size}
      sizeClassNames={sizeClassNames}
      onSelect={onInnerSelect}
      popupVisible={popupVisible}
      highlightKeyword={props.highlightKeyword}
      filterable={props.filterable}
      filter={props.filter}
    />
  );
  const topContent = props.panelTopContent;
  const bottomContent = props.panelBottomContent;
  const panelContent =
    topContent || listContent || bottomContent ? (
      <div className={`${classPrefix}-autocomplete__panel`}>
        {topContent}
        {listContent}
        {bottomContent}
      </div>
    ) : null;

  const popupProps = {
    ...props.popupProps,
    overlayInnerStyle: getOverlayStyle,
    overlayInnerClassName: popupInnerClasses,
    overlayClassName: popupClasses,
  };
  return (
    <div className={classNames(classes)} style={props.style}>
      <Popup
        ref={popupRef}
        visible={popupVisible}
        onVisibleChange={onPopupVisibleChange}
        trigger="focus"
        placement="bottom-left"
        hideEmptyPopup={true}
        content={panelContent}
        {...popupProps}
      >
        {triggerNode}
      </Popup>
    </div>
  );
});

AutoComplete.displayName = 'AutoComplete';

export default AutoComplete as <T extends AutoCompleteOption = AutoCompleteOption>(
  props: AutoCompleteProps<T> & {
    ref?: React.Ref<AutoCompleteProps>;
  },
) => React.ReactElement;
