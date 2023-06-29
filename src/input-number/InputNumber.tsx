import React, { forwardRef, useImperativeHandle, useRef, ForwardedRef } from 'react';
import {
  ChevronDownIcon as TdChevronDownIcon,
  RemoveIcon as TdRemoveIcon,
  ChevronUpIcon as TdChevronUpIcon,
  AddIcon as TdAddIcon,
} from 'tdesign-icons-react';
import classNames from 'classnames';
import Input from '../input';
import Button from '../button';
import useInputNumber from './useInputNumber';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { inputNumberDefaultProps } from './defaultProps';
import { InputNumberValue, TdInputNumberProps } from './type';
import { StyledProps } from '../common';
import useDefaultProps from '../hooks/useDefaultProps';

export interface InputNumberProps<T = InputNumberValue> extends TdInputNumberProps<T>, StyledProps {}

export interface InputNumberRef {
  currentElement: ForwardedRef<HTMLDivElement>;
  inputElement: ForwardedRef<HTMLDivElement>;
}

// https://fettblog.eu/typescript-react-generic-forward-refs/
function TdInputNumber<T extends InputNumberValue = InputNumberValue>(
  originalProps: InputNumberProps<T>,
  ref: ForwardedRef<InputNumberRef>,
) {
  const { ChevronDownIcon, RemoveIcon, ChevronUpIcon, AddIcon } = useGlobalIcon({
    ChevronDownIcon: TdChevronDownIcon,
    RemoveIcon: TdRemoveIcon,
    ChevronUpIcon: TdChevronUpIcon,
    AddIcon: TdAddIcon,
  });
  const props = useDefaultProps<InputNumberProps<T>>(originalProps, inputNumberDefaultProps);
  const {
    classPrefix,
    wrapClasses,
    addClasses,
    reduceClasses,
    listeners,
    isError,
    inputRef,
    userInput,
    handleAdd,
    handleReduce,
    onInnerInputChange,
  } = useInputNumber(props);

  const wrapRef = useRef(null);

  const status = isError ? 'error' : props.status;
  const addIcon = props.theme === 'column' ? <ChevronUpIcon size={props.size} /> : <AddIcon size={props.size} />;
  const reduceIcon =
    props.theme === 'column' ? <ChevronDownIcon size={props.size} /> : <RemoveIcon size={props.size} />;

  useImperativeHandle(ref, () => ({
    currentElement: wrapRef.current,
    inputElement: inputRef.current,
  }));

  return (
    <div className={classNames(wrapClasses, props.className)} style={props.style} ref={wrapRef}>
      {props.theme !== 'normal' && (
        <Button
          className={reduceClasses}
          disabled={props.disabled}
          onClick={handleReduce}
          variant="outline"
          shape="square"
          icon={reduceIcon}
        />
      )}
      <Input
        ref={inputRef}
        autocomplete="off"
        disabled={props.disabled}
        readonly={props.readonly}
        placeholder={props.placeholder}
        autoWidth={props.autoWidth}
        align={props.align || (props.theme === 'row' ? 'center' : undefined)}
        status={status}
        label={props.label}
        suffix={props.suffix}
        value={userInput}
        onChange={onInnerInputChange}
        size={props.size}
        {...listeners}
        {...(props.inputProps || {})}
      />
      {props.theme !== 'normal' && (
        <Button
          className={addClasses}
          disabled={props.disabled}
          onClick={handleAdd}
          variant="outline"
          shape="square"
          icon={addIcon}
        />
      )}
      {props.tips && (
        <div className={classNames(`${classPrefix}-input__tips`, `${classPrefix}-input__tips--${status}`)}>
          {props.tips}
        </div>
      )}
    </div>
  );
}

export type InputNumberOuterForwardRef = {
  <T>(props: InputNumberProps<T> & { ref?: ForwardedRef<InputNumberRef> }): ReturnType<typeof TdInputNumber>;
} & React.ForwardRefExoticComponent<InputNumberProps>;

const InputNumber = forwardRef<InputNumberRef, InputNumberProps<InputNumberValue>>(TdInputNumber);

InputNumber.displayName = 'InputNumber';

export default InputNumber;
