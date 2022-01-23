import React, { useState, useRef, useEffect, Ref, useMemo, useCallback } from 'react';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import isString from 'lodash/isString';

import { isNumber } from 'lodash';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import composeRefs from '../../_util/composeRefs';
import useDefaultValue from '../../_util/useDefaultValue';
import forwardRefWithStatics from '../../_util/forwardRefWithStatics';
import { getMultipleTags, getSelectValueArr, getValueToOption } from '../util/helper';
import noop from '../../_util/noop';

import FakeArrow from '../../common/FakeArrow';
import Loading from '../../loading';
import Input from '../../input';
import Popup from '../../popup';
import Tag from '../../tag';
import Option, { SelectOptionProps } from './Option';
import OptionGroup from './OptionGroup';
import PopupContent from './PopupContent';

import { TdSelectProps, SelectValue, TdOptionProps } from '../type';
import { StyledProps } from '../../common';

const MAX_OVERLAY_WIDTH = 500;

export interface SelectProps extends TdSelectProps, StyledProps {
  // 子节点
  children?: React.ReactNode;
}

type OptionsType = TdOptionProps[];

enum KeyCode {
  BACKSPACE = 8,
}

const Select = forwardRefWithStatics(
  (props: SelectProps, ref: Ref<HTMLDivElement>) => {
    // 国际化文本初始化
    const [local, t] = useLocaleReceiver('select');
    const emptyText = t(local.loadingText);

    const {
      bordered = true,
      creatable,
      filter,
      loadingText = emptyText,
      max = 0,
      popupProps,
      reserveKeyword,
      value,
      className,
      style,
      disabled,
      size,
      multiple,
      placeholder,
      clearable,
      prefixIcon,
      options,
      filterable,
      loading,
      onFocus,
      onBlur,
      onClear = noop,
      onCreate,
      onRemove,
      onSearch,
      onChange,
      empty,
      valueType = 'value',
      keys,
      children,
      collapsedItems,
      minCollapsedNum,
      valueDisplay,
      onEnter,
      onVisibleChange,
      showArrow = true,
      inputProps,
      panelBottomContent,
      panelTopContent,
    } = useDefaultValue(props);

    const { classPrefix, locale } = useConfig();

    const name = `${classPrefix}-select`; // t-select

    const [showPopup, setShowPopup] = useState(false);
    const [isHover, toggleHover] = useState(false);
    const [inputVal, setInputVal] = useState<string>(undefined);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [tmpPropOptions, setTmpPropOptions] = useState([]);
    const [valueToOption, setValueToOption] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);

    const [width, setWidth] = useState(0);

    const selectRef = useRef(null);
    const overlayRef = useRef(null);

    const selectedLabel = useMemo(
      () => get(selectedOptions[0] || {}, keys?.label || 'label') || '',
      [selectedOptions, keys],
    );

    // 计算Select的宽高
    useEffect(() => {
      if (showPopup && selectRef?.current) {
        const domRect = selectRef.current.getBoundingClientRect();
        const overlayRect = overlayRef?.current?.getBoundingClientRect?.();

        // 获取overlay的内容的宽度进行比较 如果比select本身宽，则优先使用overlay内容宽度，减少text被省略展示的情况
        const width =
          domRect.width > MAX_OVERLAY_WIDTH
            ? domRect.width
            : Math.min(MAX_OVERLAY_WIDTH, Math.max(domRect.width, overlayRect?.width));

        setWidth(width);
      }
    }, [showPopup]);

    const handleShowPopup = (visible: boolean) => {
      if (disabled) return;
      setShowPopup(visible);
      onVisibleChange?.(visible);
      if (!visible && !multiple && filterable) {
        setInputVal(selectedLabel);
      }
    };

    // 处理设置option的逻辑
    useEffect(() => {
      if (keys) {
        // 如果有定制keys 先做转换
        const transformedOptions = options.map((option) => ({
          ...option,
          value: get(option, keys?.value || 'value'),
          label: get(option, keys?.label || 'label'),
        }));
        setCurrentOptions(transformedOptions);
        setTmpPropOptions(transformedOptions);
      } else {
        setCurrentOptions(options);
        setTmpPropOptions(options);
      }
      setValueToOption(getValueToOption(children, options, keys) || {});
    }, [options, keys, children]);

    // 同步value对应的options
    // 没太看明白effect的必要，感觉是一个useMemo而已
    useEffect(() => {
      setSelectedOptions((oldSelectedOptions) => {
        const valueKey = keys?.value || 'value';
        const labelKey = keys?.label || 'label';
        if (Array.isArray(value)) {
          return value
            .map((item) => {
              if (valueType === 'value') {
                return (
                  valueToOption[item as string | number] ||
                  oldSelectedOptions.find((option) => get(option, valueKey) === item) || {
                    [valueKey]: item,
                    [labelKey]: item,
                  }
                );
              }
              return item;
            })
            .filter(Boolean);
        }

        if (value !== undefined && value !== null) {
          if (valueType === 'value') {
            return [
              valueToOption[value as string | number] ||
                oldSelectedOptions.find((option) => get(option, valueKey) === value) || {
                  [valueKey]: value,
                  [labelKey]: value,
                },
            ].filter(Boolean);
          }
          return [value];
        }
        return [];
      });
    }, [value, keys, valueType, valueToOption]);

    // 移除 Tag
    const removeTag = (
      event?: React.MouseEvent,
      selectValue?: SelectValue,
      tagData?: {
        label?: string;
        value?: string | number;
      },
    ) => {
      event.stopPropagation();
      const values = getSelectValueArr(value, selectValue, true, valueType, keys);
      onChange(values);
      if (isFunction(onRemove)) {
        onRemove({ value: tagData.value, data: tagData, e: event as React.MouseEvent<HTMLDivElement, MouseEvent> });
      }
    };

    // 选中 Popup 某项
    const handleChange: SelectOptionProps['onSelect'] = (value, { label }) => {
      if (filterable) {
        setInputVal(!multiple || (reserveKeyword && multiple) ? label : '');
      }
      if (creatable && isFunction(onCreate)) {
        if ((options as OptionsType).filter((option) => option.value === value).length === 0) {
          onCreate(value);
        }
      }
      onChange(value);
    };

    // 处理filter逻辑
    const handleFilter = (value: string) => {
      let filteredOptions: OptionsType;
      if (!value) {
        setCurrentOptions(tmpPropOptions);
        return;
      }

      if (filter && isFunction(filter)) {
        // 如果有自定义的filter方法 使用自定义的filter方法
        filteredOptions = Array.isArray(tmpPropOptions) && tmpPropOptions.filter((option) => filter(value, option));
      } else {
        const filterRegExp = new RegExp(value, 'i');
        filteredOptions =
          Array.isArray(tmpPropOptions) && tmpPropOptions.filter((option) => filterRegExp.test(option?.label)); // 不区分大小写
      }

      if (creatable) {
        filteredOptions = filteredOptions.concat([{ label: value, value }]);
      }
      setCurrentOptions(filteredOptions);
    };

    // 处理输入框逻辑
    const handleInputChange = (value: string) => {
      setInputVal(value);

      if (isFunction(onSearch)) {
        onSearch(value);
        return;
      }

      handleFilter(value);
    };

    const defaultLabel = (
      <span
        className={classNames(
          className,
          {
            [`${name}__placeholder`]: (!value && !isNumber(value)) || (Array.isArray(value) && value.length < 1),
          },
          {
            [`${name}__single`]: selectedLabel,
          },
        )}
      >
        {selectedLabel || placeholder || locale.select.placeholder}
      </span>
    );

    const renderMultipleTags = () => {
      if (multiple && Array.isArray(value) && value.length > 0) {
        let tags: OptionsType;
        if (valueType === 'value') {
          tags = getMultipleTags(selectedOptions, keys);
        } else {
          tags = getMultipleTags(value, keys);
        }

        if (tags.length > 0)
          return (
            <>
              {tags.slice(0, minCollapsedNum).map((item) => (
                <Tag
                  closable={!disabled}
                  key={item.value}
                  onClose={({ e }) => removeTag(e, item.value, item)}
                  disabled={disabled}
                  size={size}
                >
                  {item.label}
                </Tag>
              ))}
              {collapsedItems}
              {minCollapsedNum && tags.length - minCollapsedNum > 0 && !collapsedItems ? (
                <Tag size={size}> {`+${tags.length - minCollapsedNum}`}</Tag>
              ) : null}
            </>
          );
        return !filterable ? defaultLabel : null;
      }
      return !filterable ? defaultLabel : null;
    };

    const handleInputKeyDown = useCallback(
      (inputValue, { e }) => {
        if (!inputValue && multiple && Array.isArray(value) && e.which === KeyCode.BACKSPACE) {
          const lastValue = value[value.length - 1];
          const values = getSelectValueArr(value, lastValue, true, valueType, keys);
          onChange(values);
        }
      },
      [value, onChange, multiple, valueType, keys],
    );

    const renderInput = () => (
      <Input
        value={isString(inputVal) || multiple ? inputVal : selectedLabel}
        placeholder={
          multiple && get(value, 'length') > 0 ? null : selectedLabel || placeholder || locale.select.placeholder
        }
        className={`${name}__input`}
        onChange={handleInputChange}
        onKeydown={handleInputKeyDown}
        size={size}
        onFocus={(_, context) => onFocus?.({ value, e: context?.e })}
        onBlur={(_, context) => onBlur?.({ value, e: context?.e })}
        onEnter={(_, context) => onEnter?.({ inputValue: inputVal, value, e: context?.e })}
        {...inputProps}
      />
    );

    const onInputClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!disabled) {
        setShowPopup(!showPopup);
        setInputVal('');
      }
    };

    const onClearValue = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (Array.isArray(value)) {
        onChange([]);
      } else {
        onChange('');
      }
      setInputVal(undefined);
      onClear({ e: event as React.MouseEvent<HTMLDivElement, MouseEvent> });
    };

    // 渲染后置图标
    const renderSuffixIcon = () => {
      if (loading) {
        return (
          <Loading
            className={classNames(className, `${name}__right-icon`, `${name}__active-icon`)}
            loading={true}
            size="small"
          />
        );
      }
      if (clearable && value && isHover) {
        return (
          <CloseCircleFilledIcon
            onClick={clearable ? onClearValue : undefined}
            className={classNames(className, `${name}__right-icon`, `${name}__right-icon-clear`)}
          />
        );
      }
      return (
        showArrow && <FakeArrow overlayClassName={`${name}__right-icon`} isActive={showPopup} disabled={disabled} />
      );
    };

    const popupContentProps = {
      onChange: handleChange,
      value,
      className,
      size,
      multiple,
      showPopup,
      setShowPopup,
      options: currentOptions,
      empty,
      max,
      loadingText,
      loading,
      valueType,
      keys,
      panelBottomContent,
      panelTopContent,
    };

    const renderContent = () => <PopupContent {...popupContentProps}>{children}</PopupContent>;

    const renderMultipleInput = () => {
      if (valueDisplay) {
        return valueDisplay({ value: value as OptionsType, onClose: removeTag }) || defaultLabel;
      }
      return renderMultipleTags();
    };
    return (
      <div
        className={`${name}__wrap`}
        style={{ ...style }}
        onMouseEnter={() => toggleHover(true)}
        onMouseLeave={() => toggleHover(false)}
      >
        <Popup
          trigger="click"
          ref={overlayRef}
          content={renderContent()}
          placement="bottom-left"
          visible={showPopup}
          overlayStyle={{
            width: width ? `${width}px` : 'none',
          }}
          onVisibleChange={handleShowPopup}
          overlayClassName={classNames(className, `${name}__dropdown`, `${classPrefix}-popup`, 'narrow-scrollbar')}
          className={`${name}__popup-reference`}
          expandAnimation={true}
          destroyOnClose={true}
          {...popupProps}
        >
          <div
            className={classNames(className, name, {
              [`${classPrefix}-is-disabled`]: disabled,
              [`${classPrefix}-is-active`]: showPopup,
              [`${classPrefix}-size-s`]: size === 'small',
              [`${classPrefix}-size-l`]: size === 'large',
              [`${classPrefix}-no-border`]: !bordered,
              [`${classPrefix}-has-prefix`]: !!prefixIcon,
            })}
            ref={composeRefs(selectRef, ref)}
            style={{ userSelect: 'none' }}
            onClick={onInputClick}
          >
            {<span className={`${name}__left-icon`}>{prefixIcon}</span>}
            {multiple ? renderMultipleInput() : null}
            {filterable && renderInput()}
            {!multiple && !filterable && defaultLabel}
            {renderSuffixIcon()}
          </div>
        </Popup>
      </div>
    );
  },
  {
    displayName: 'Select',
    Option,
    OptionGroup,
  },
);

export default Select;
