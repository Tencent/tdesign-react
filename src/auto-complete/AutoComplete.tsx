import React, { FormEvent, forwardRef, useRef, useState, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useControlled from '../hooks/useControlled';
import { ClassName, StyledProps } from '../common';
import { AutoCompleteOption, TdAutoCompleteProps } from './type';
import { autoCompleteDefaultProps } from './defaultProps';
import useCommonClassName from '../hooks/useCommonClassName';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import Input, { InputProps, InputRef } from '../input';
import Popup, { PopupProps, PopupRef } from '../popup';
import AutoCompleteOptionList, { OptionsListProps } from './OptionList';

export interface AutoCompleteProps<T extends AutoCompleteOption = AutoCompleteOption>
  extends TdAutoCompleteProps<T>,
    StyledProps {}

export interface AutoCompleteRef {
  inputRef: InputRef;
  popupRef: PopupRef;
}

const AutoComplete = forwardRef<AutoCompleteRef, AutoCompleteProps>((props, ref) => {
  const inputRef = useRef();
  const popupRef = useRef();
  const [tValue, setTValue] = useControlled(props, 'value', props.onChange);
  const { classPrefix, sizeClassNames } = useCommonClassName();
  const [global] = useLocaleReceiver('input');

  const [popupVisible, setPopupVisible] = useState(false);

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

  const classes = [`${classPrefix}-auto-complete`];
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

  const onInputChange = (value: string, context: { e: FormEvent<HTMLInputElement> }) => {
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
      onChange={onInputChange}
      onFocus={onInnerFocus}
      {...innerInputProps}
    />
  );
  // 联想词列表
  const listContent = (
    <AutoCompleteOptionList
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
    <div className={classNames(classes)}>
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
AutoComplete.defaultProps = autoCompleteDefaultProps;

export default AutoComplete as <T extends AutoCompleteOption = AutoCompleteOption>(
  props: AutoCompleteProps<T> & {
    ref?: React.Ref<AutoCompleteProps>;
  },
) => React.ReactElement;
