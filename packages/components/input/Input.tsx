import classNames from 'classnames';
import { isFunction } from 'lodash-es';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  BrowseIcon as TdBrowseIcon,
  BrowseOffIcon as TdBrowseOffIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
} from 'tdesign-icons-react';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import parseTNode from '../_util/parseTNode';
import { StyledProps, type TElement, type TNode } from '../common';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useLayoutEffect from '../hooks/useLayoutEffect';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { inputDefaultProps } from './defaultProps';
import InputGroup from './InputGroup';
import type { TdInputProps } from './type';
import useLengthLimit from './useLengthLimit';

export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      | 'size'
      | 'type'
      | 'value'
      | 'defaultValue'
      | 'spellCheck'
      | 'onBlur'
      | 'onChange'
      | 'onClick'
      | 'onFocus'
      | 'onPaste'
      | 'onWheel'
    >,
    TdInputProps,
    StyledProps {
  showInput?: boolean; // 控制透传 readonly 同时是否展示 input；默认保留，因为正常 Input 需要撑开宽度
  keepWrapperWidth?: boolean; // 控制透传 autoWidth 之后是否容器宽度也自适应；多选等组件需要用到自适应，但也需要保留宽度
}

export interface InputRef extends React.RefObject<unknown> {
  currentElement: HTMLDivElement;
  inputElement: HTMLInputElement;
  focus: () => void;
  blur: () => void;
  select: () => void;
}

type InputContextTrigger = 'input' | 'clear' | 'initial';

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: TNode | TElement) => {
  const result = parseTNode(icon);

  const iconClassName = icon ? `${classPrefix}-input__${type}-icon` : '';

  return result ? <span className={`${classPrefix}-input__${type} ${iconClassName}`}>{result}</span> : null;
};

const Input = forwardRefWithStatics(
  (originalProps: InputProps, ref: React.RefObject<InputRef>) => {
    // 国际化文本初始化
    const [local, t] = useLocaleReceiver('input');
    const { BrowseIcon, BrowseOffIcon, CloseCircleFilledIcon } = useGlobalIcon({
      BrowseIcon: TdBrowseIcon,
      BrowseOffIcon: TdBrowseOffIcon,
      CloseCircleFilledIcon: TdCloseCircleFilledIcon,
    });
    const props = useDefaultProps<InputProps>(originalProps, inputDefaultProps);
    const {
      type,
      autoWidth,
      borderless,
      placeholder = t(local.placeholder),
      disabled,
      status,
      size,
      className,
      inputClass,
      style,
      prefixIcon,
      suffixIcon,
      clearable,
      tips,
      align,
      maxlength,
      maxcharacter,
      showClearIconOnEmpty,
      autofocus,
      autocomplete,
      readonly,
      label,
      suffix,
      showInput = true,
      keepWrapperWidth,
      showLimitNumber,
      allowInput,
      allowInputOverMax,
      name,
      format,
      onClick,
      onClear,
      onEnter,
      onKeydown,
      onKeyup,
      onKeypress,
      onFocus,
      onBlur,
      onPaste,
      onMouseenter,
      onMouseleave,
      onWheel,
      onCompositionstart,
      onCompositionend,
      onValidate,
      onChange: onChangeFromProps,
      ...restProps
    } = props;

    const inputPropsNames = Object.keys(restProps).filter((key) => !/^on[A-Z]/.test(key));
    const inputProps = inputPropsNames.reduce(
      (textareaProps, key) => Object.assign(textareaProps, { [key]: props[key] }),
      {},
    );
    const eventPropsNames = Object.keys(restProps).filter((key) => /^on[A-Z]/.test(key));
    const eventProps = eventPropsNames.reduce((eventProps, key) => {
      Object.assign(eventProps, {
        [key]: (e: React.SyntheticEvent<HTMLInputElement>) => {
          if (disabled) return;
          props[key](e);
        },
      });
      return eventProps;
    }, {});

    const [value, onChange] = useControlled(props, 'value', onChangeFromProps);
    const { limitNumber, getValueByLimitNumber, tStatus } = useLengthLimit({
      value: value === undefined ? undefined : String(value),
      status,
      maxlength,
      maxcharacter,
      allowInputOverMax,
      onValidate,
    });

    const { classPrefix, input: inputConfig } = useConfig();
    const composingRef = useRef(false);
    const inputRef: React.RefObject<HTMLInputElement> = useRef(null);
    // inputPreRef 用于预存输入框宽度，应用在 auto width 模式中
    const inputPreRef: React.RefObject<HTMLInputElement> = useRef(null);
    const wrapperRef: React.RefObject<HTMLDivElement> = useRef(null);

    const [isHover, toggleIsHover] = useState(false);
    const [isFocused, toggleIsFocused] = useState(false);
    const [renderType, setRenderType] = useState(type);
    const [composingValue, setComposingValue] = useState<string>('');

    // 组件内部 input 原生控件是否处于 readonly 状态，当整个组件 readonly 时，或者处于不可输入时
    const isInnerInputReadonly = readonly || !allowInput;
    const isValueEnabled = value && !disabled;
    const alwaysShowClearIcon = inputConfig?.clearTrigger === 'always';
    const isShowClearIcon =
      (((clearable && isValueEnabled) || showClearIconOnEmpty) && isHover) || (isValueEnabled && alwaysShowClearIcon);

    const prefixIconContent = renderIcon(classPrefix, 'prefix', parseTNode(prefixIcon));
    let suffixIconNew = suffixIcon;

    if (isShowClearIcon)
      suffixIconNew = (
        <CloseCircleFilledIcon
          className={`${classPrefix}-input__suffix-clear`}
          onMouseDown={handleMouseDown}
          onClick={handleClear}
        />
      );
    if (type === 'password' && typeof suffixIcon === 'undefined') {
      if (renderType === 'password') {
        suffixIconNew = (
          <BrowseOffIcon className={`${classPrefix}-input__suffix-clear`} onClick={togglePasswordVisible} />
        );
      } else if (renderType === 'text') {
        suffixIconNew = <BrowseIcon className={`${classPrefix}-input__suffix-clear`} onClick={togglePasswordVisible} />;
      }
    }

    const suffixIconContent = renderIcon(classPrefix, 'suffix', parseTNode(suffixIconNew));
    const labelContent = isFunction(label) ? label() : label;
    const suffixContent = isFunction(suffix) ? suffix() : suffix;
    const limitNumberNode =
      limitNumber && showLimitNumber ? (
        <div
          className={classNames(`${classPrefix}-input__limit-number`, {
            [`${classPrefix}-is-disabled`]: disabled,
          })}
        >
          {limitNumber}
        </div>
      ) : null;

    const updateInputWidth = () => {
      if (!autoWidth || !inputRef.current) return;
      const { offsetWidth } = inputPreRef.current;
      const { width } = inputPreRef.current.getBoundingClientRect();
      // 异步渲染场景下 getBoundingClientRect 宽度为 0，需要使用 offsetWidth
      const calcWidth = width < offsetWidth ? offsetWidth + 1 : width;
      inputRef.current.style.width = `${calcWidth}px`;
    };

    useLayoutEffect(() => {
      // 推迟到下一帧处理防止异步渲染 input 场景宽度计算为 0
      requestAnimationFrame(() => {
        updateInputWidth();
      });
      // eslint-disable-next-line
    }, [autoWidth, value, placeholder, inputRef, composingValue]);

    // 当元素默认为 display: none 状态，无法提前准确计算宽度，因此需要监听元素宽度变化。比如：Tabs 场景切换。
    useEffect(() => {
      let resizeObserver: ResizeObserver = null;
      // IE 11 以下使用设置 minWidth 兼容；IE 11 以上使用 ResizeObserver
      if (typeof window.ResizeObserver === 'undefined' || !inputRef.current) return;
      resizeObserver = new window.ResizeObserver(() => {
        updateInputWidth();
      });
      resizeObserver.observe(inputRef.current);
      return () => {
        // resizeObserver.unobserve?.(inputRef.current);
        resizeObserver.disconnect?.();
        resizeObserver = null;
      };
      // eslint-disable-next-line
    }, [inputRef]);

    useEffect(() => {
      setRenderType(type);
    }, [type]);

    // 初始判断长度，如超限自动截断并触发onchange
    useEffect(() => {
      if (value) {
        const limitedValue = getValueByLimitNumber(value);
        if (limitedValue.length !== value.length && !allowInputOverMax) {
          onChange?.(limitedValue, { trigger: 'initial' });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const innerValue = composingRef.current ? composingValue : value ?? '';
    const formatDisplayValue = format && !isFocused ? format(innerValue) : innerValue;

    const renderInput = (
      <input
        {...inputProps}
        {...eventProps}
        ref={inputRef}
        name={name}
        placeholder={placeholder}
        type={renderType}
        className={classNames(`${classPrefix}-input__inner`, {
          [`${classPrefix}-input--soft-hidden`]: !showInput,
        })}
        value={formatDisplayValue}
        readOnly={isInnerInputReadonly}
        disabled={disabled}
        autoComplete={autocomplete ?? (local.autocomplete || undefined)}
        autoFocus={autofocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onKeyPress={handleKeyPress}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
      />
    );

    const renderInputNode = (
      <div
        className={classNames(inputClass, `${classPrefix}-input`, {
          [`${classPrefix}-is-readonly`]: readonly,
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-is-focused`]: isFocused,
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-align-${align}`]: align,
          [`${classPrefix}-is-${tStatus}`]: tStatus && tStatus !== 'default',
          [`${classPrefix}-input--prefix`]: prefixIcon || labelContent,
          [`${classPrefix}-input--suffix`]: suffixIconContent || suffixContent,
          [`${classPrefix}-input--borderless`]: borderless,
          [`${classPrefix}-input--focused`]: isFocused,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={(e) => onWheel?.({ e })}
        onClick={(e) => {
          inputRef.current?.focus();
          onClick?.({ e });
        }}
      >
        {prefixIconContent}
        {labelContent ? <div className={`${classPrefix}-input__prefix`}>{labelContent}</div> : null}
        {renderInput}
        {autoWidth && (
          <span ref={inputPreRef} className={`${classPrefix}-input__input-pre`}>
            {innerValue || placeholder}
          </span>
        )}
        {suffixContent || limitNumberNode ? (
          <div className={`${classPrefix}-input__suffix`}>
            {suffixContent}
            {limitNumberNode}
          </div>
        ) : null}
        {suffixIconContent}
      </div>
    );

    function togglePasswordVisible() {
      if (disabled) return;
      const toggleType = renderType === 'password' ? 'text' : 'password';
      setRenderType(toggleType);
    }

    function handleChange(
      e: React.ChangeEvent<HTMLInputElement> | React.CompositionEvent<HTMLInputElement>,
      trigger: InputContextTrigger = 'input',
    ) {
      let { value: newStr } = e.currentTarget;
      if (composingRef.current) {
        setComposingValue(newStr);
      } else {
        if (props.type !== 'number') {
          newStr = getValueByLimitNumber(newStr);
        }
        // 完成中文输入时同步一次 composingValue
        setComposingValue(newStr);
        onChange(newStr, { e, trigger });
      }
    }
    // 添加MouseDown阻止冒泡，防止點擊Clear value會導致彈窗閃爍一下
    // https://github.com/Tencent/tdesign-react/issues/2320
    function handleMouseDown(e: React.MouseEvent<SVGSVGElement, globalThis.MouseEvent>) {
      e.stopPropagation();
      // 兼容React16
      e.nativeEvent.stopImmediatePropagation();
    }
    function handleClear(e: React.MouseEvent<SVGSVGElement>) {
      onChange?.('', { e, trigger: 'clear' });
      onClear?.({ e });
    }
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      const {
        key,
        currentTarget: { value },
      } = e;
      key === 'Enter' && onEnter?.(value, { e });
      onKeydown?.(value, { e });
    }
    function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
      const {
        currentTarget: { value },
      } = e;
      onKeyup?.(value, { e });
    }
    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
      const {
        currentTarget: { value },
      } = e;
      onKeypress?.(value, { e });
    }
    function handleCompositionStart(e: React.CompositionEvent<HTMLInputElement>) {
      composingRef.current = true;
      const {
        currentTarget: { value },
      } = e;
      onCompositionstart?.(value, { e });
    }
    function handleCompositionEnd(e: React.CompositionEvent<HTMLInputElement>) {
      const {
        currentTarget: { value },
      } = e;
      if (composingRef.current) {
        composingRef.current = false;
        handleChange(e);
      }
      onCompositionend?.(value, { e });
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      if (isInnerInputReadonly) return;
      const {
        currentTarget: { value },
      } = e;
      onFocus?.(value, { e });
      toggleIsFocused(true);
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      if (isInnerInputReadonly) return;
      const {
        currentTarget: { value },
      } = e;
      onBlur?.(value, { e });
      toggleIsFocused(false);
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
      const clipData = e.clipboardData;
      const pasteValue = clipData?.getData('text/plain');
      onPaste?.({ e, pasteValue });
    }

    function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
      !readonly && toggleIsHover(true);
      onMouseenter?.({ e });
    }

    function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
      !readonly && toggleIsHover(false);
      onMouseleave?.({ e });
    }

    useImperativeHandle(ref as InputRef, () => ({
      currentElement: wrapperRef.current,
      inputElement: inputRef.current,
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      select: () => inputRef.current?.select(),
    }));

    return (
      <div
        ref={wrapperRef}
        style={style}
        className={classNames(`${classPrefix}-input__wrap`, className, {
          [`${classPrefix}-input--auto-width`]: autoWidth && !keepWrapperWidth,
        })}
      >
        {renderInputNode}
        {tips && (
          <div
            className={classNames(`${classPrefix}-input__tips`, `${classPrefix}-input__tips--${tStatus || 'default'}`)}
          >
            {tips}
          </div>
        )}
      </div>
    );
  },
  { Group: InputGroup },
);

Input.displayName = 'Input';

export default Input;
