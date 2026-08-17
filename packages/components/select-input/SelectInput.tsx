import React, { useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';

import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import Popup from '../popup';
import { selectInputDefaultProps } from './defaultProps';
import useMultiple from './useMultiple';
import useOverlayInnerStyle from './useOverlayInnerStyle';
import useSingle from './useSingle';

import type { StyledProps } from '../common';
import type { InputRef } from '../input';
import type { PopupRef, PopupVisibleChangeContext } from '../popup';
import type { TdSelectInputProps } from './type';

export interface SelectInputProps extends TdSelectInputProps, StyledProps {
  updateScrollTop?: (content: HTMLDivElement) => void;
  options?: any[]; // 参数穿透options, 给SelectInput/SelectInput 自定义选中项呈现的内容和多选状态下设置折叠项内容
}

const SelectInput = React.forwardRef<Partial<PopupRef & InputRef>, SelectInputProps>((originalProps, ref) => {
  const { classPrefix: prefix } = useConfig();

  const props = useDefaultProps<SelectInputProps>(originalProps, selectInputDefaultProps);
  const { multiple, value, popupVisible, popupProps, borderless, disabled } = props;

  const selectInputRef = useRef<PopupRef>(null);
  const selectInputWrapRef = useRef<HTMLDivElement>(null);

  const { commonInputProps, inputRef, singleInputValue, onInnerClear, renderSelectSingle } = useSingle(props);
  const { tagInputRef, tags, multipleInputValue, renderSelectMultiple } = useMultiple(props);

  const { tOverlayInnerStyle, innerPopupVisible, onInnerPopupVisibleChange, skipNextBlur } = useOverlayInnerStyle(
    props,
    {
      afterHidePopup: onInnerBlur,
    },
  );

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

  // React 19 下 useImperativeHandle 每次重建 handle 都会让父级 ref 重新 detach/attach，
  // 所以这里固定 deps 为 []，用 Proxy 在读取时才合并三个子 ref。
  useImperativeHandle(
    ref,
    () => {
      const mergeRefs = () => ({
        ...(selectInputRef.current || {}),
        ...(inputRef.current || {}),
        ...(tagInputRef.current || {}),
      });

      return new Proxy({} as Partial<PopupRef & InputRef>, {
        get(_, prop) {
          const merged = mergeRefs();
          const value = merged[prop as keyof typeof merged];
          return typeof value === 'function' ? value.bind(merged) : value;
        },
        // getRefDom 等调用方会用 `in` 探测 currentElement，缺少这些陷阱会永远返回 false
        has: (_, prop) => prop in mergeRefs(),
        ownKeys: () => Reflect.ownKeys(mergeRefs()),
        getOwnPropertyDescriptor: (_, prop) => {
          const merged = mergeRefs();
          if (!(prop in merged)) return undefined;
          return {
            configurable: true,
            enumerable: true,
            value: merged[prop as keyof typeof merged],
          };
        },
      });
    },
    // 三个 ref 本身引用稳定，Proxy 读取时才取值，无需进依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // 浮层显示的受控与非受控
  const visibleProps = { visible: popupVisible ?? innerPopupVisible };

  /* SelectInput 与普通 Input 的 blur 事件触发时机不同
    该组件的 blur 事件在 popup 隐藏时才触发，避免点击浮层内容时触发 blur 事件 */
  function onInnerBlur(ctx: PopupVisibleChangeContext) {
    if (skipNextBlur.current) return;
    const inputValue = props.multiple ? multipleInputValue : singleInputValue;
    const params: Parameters<TdSelectInputProps['onBlur']>[1] = {
      e: ctx.e,
      inputValue,
      ...(props.multiple && { tagInputValue: tags }),
    };
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
              popupVisible: visibleProps.visible,
              allowInput: props.allowInput,
              onInnerClear,
              onInnerBlur,
            })
          : renderSelectSingle(visibleProps.visible, onInnerBlur)}
      </Popup>
    </div>
  );

  if (!props.tips) {
    return mainContent;
  }

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

export default SelectInput;
