import React, { useMemo, forwardRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { TdTreeSelectProps } from './type';
import Input, { InputValue } from '../input';
import useConfig from '../_util/useConfig';

export interface TreeSelectInputProps extends TdTreeSelectProps {
  visible: boolean;
  filterText: string;
  setFilterText: Function;
  setFocusing: Function;
  selectedSingle: string;
}

const TreeSelectTags = forwardRef((props: TreeSelectInputProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    selectedSingle,
    visible,
    filterText,
    setFilterText,
    setFocusing,
    placeholder,
    filter,
    filterable,
    multiple,
    disabled,
    size,
    value,
    onSearch,
    onBlur,
    onFocus,
  } = props;
  const { classPrefix } = useConfig();

  const showFilter: boolean = useMemo(() => {
    if (disabled) {
      return false;
    }
    if (!multiple && selectedSingle && (filterable || isFunction(filter))) {
      return visible;
    }
    return filterable || isFunction(filter);
  }, [disabled, multiple, selectedSingle, filterable, visible, filter]);

  const showPlaceholder: boolean = useMemo(() => {
    if (
      !showFilter &&
      ((isString(value) && value === '' && !selectedSingle) ||
        (Array.isArray(value) && isEmpty(value)) ||
        value === null)
    ) {
      return true;
    }
    return false;
  }, [showFilter, value, selectedSingle]);

  const filterPlaceholder: string = useMemo(() => {
    if (multiple && Array.isArray(value) && !isEmpty(value)) {
      return '';
    }
    if (!multiple && selectedSingle) {
      return selectedSingle;
    }
    return placeholder;
  }, [multiple, value, selectedSingle, placeholder]);

  function handleChange(value) {
    setFilterText(value);
    onSearch?.(value);
  }

  function handleBlur(value: InputValue, context: { e: React.FocusEvent<HTMLDivElement> }) {
    setFocusing(false);
    onBlur?.({ value, e: context.e });
  }

  function handleFocus(value: InputValue, context: { e: React.FocusEvent<HTMLDivElement> }) {
    setFocusing(true);
    onFocus?.({ value, e: context.e });
  }

  const searchInput = showFilter && (
    <Input
      ref={ref}
      value={filterText}
      className={`${classPrefix}-select-input`}
      size={size}
      disabled={disabled}
      placeholder={filterPlaceholder}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );

  return (
    <>
      {showPlaceholder && <span className={`${classPrefix}-select-placeholder`}>{placeholder}</span>}

      {!multiple && !showPlaceholder && !showFilter && (
        <span className={`${classPrefix}-select-selectedSingle`}>{selectedSingle}</span>
      )}

      {searchInput}
    </>
  );
});

export default TreeSelectTags;
