import React, { useState, useEffect, Ref, useMemo } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import isString from 'lodash/isString';

import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import forwardRefWithStatics from '../../_util/forwardRefWithStatics';
import { getSelectValueArr, getValueToOption } from '../util/helper';
import noop from '../../_util/noop';

import FakeArrow from '../../common/FakeArrow';
import Loading from '../../loading';
import SelectInput from '../../select-input';
import Option, { SelectOptionProps } from './Option';
import OptionGroup from './OptionGroup';
import PopupContent from './PopupContent';

import { TdSelectProps, TdOptionProps } from '../type';
import { StyledProps } from '../../common';

export interface SelectProps extends TdSelectProps, StyledProps {
  // 子节点
  children?: React.ReactNode;
}

type OptionsType = TdOptionProps[];

const Select = forwardRefWithStatics(
  (props: SelectProps, ref: Ref<HTMLDivElement>) => {
    // 国际化文本初始化
    const [local, t] = useLocaleReceiver('select');
    const emptyText = t(local.loadingText);

    const {
      bordered = true,
      borderless,
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
      inputValue,
      defaultInputValue,
      inputProps,
      panelBottomContent,
      panelTopContent,
      selectInputProps,
      tagInputProps,
      tagProps,
    } = props;

    const { classPrefix } = useConfig();

    const name = `${classPrefix}-select`; // t-select

    const [showPopup, setShowPopup] = useState(false);
    const [inputVal, setInputVal] = useState<string>(undefined);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [tmpPropOptions, setTmpPropOptions] = useState([]);
    const [valueToOption, setValueToOption] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);

    const selectedLabel = useMemo(() => {
      if (multiple) {
        return selectedOptions.map((selectedOption) => get(selectedOption || {}, keys?.label || 'label') || '');
      }
      return get(selectedOptions[0] || {}, keys?.label || 'label') || '';
    }, [selectedOptions, keys, multiple]);

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

    const handleShowPopup = (visible: boolean) => {
      if (disabled) return;
      setShowPopup(visible);
      onVisibleChange?.(visible);
      if (!visible && !multiple && filterable) {
        setInputVal(selectedLabel);
      }
    };

    // 可以根据触发来源，自由定制标签变化时的筛选器行为
    const onTagChange = (currentTags, context) => {
      const { trigger, index, item, e: event } = context;
      // backspace
      if (trigger === 'backspace') {
        event.stopPropagation();
        const values = getSelectValueArr(value, value[index], true, valueType, keys);
        onChange(values, context);
      }

      if (trigger === 'clear') {
        event.stopPropagation();
        onChange([], context);
      }

      if (trigger === 'tag-remove') {
        event.stopPropagation();
        const values = getSelectValueArr(value, value[index], true, valueType, keys);
        onChange(values, context);
        if (isFunction(onRemove)) {
          onRemove({
            value: value[index],
            data: {
              label: item,
              value: value[index],
            },
            e: event as React.MouseEvent<HTMLDivElement, MouseEvent>,
          });
        }
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
      onChange ? onChange(value, null) : setInputVal(label);
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

    const onClearValue = (context) => {
      context.e.stopPropagation();
      if (Array.isArray(value)) {
        onChange([], context);
      } else {
        onChange(null, context);
      }
      setInputVal(undefined);
      onClear(context);
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

      return (
        showArrow && <FakeArrow overlayClassName={`${name}__right-icon`} isActive={showPopup} disabled={disabled} />
      );
    };

    // 渲染主体内容
    const renderContent = () => {
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
      return <PopupContent {...popupContentProps}>{children}</PopupContent>;
    };

    const renderValueDisplay = () => {
      if (!valueDisplay) return '';
      if (typeof valueDisplay === 'string') {
        return valueDisplay;
      }
      if (multiple) {
        return ({ onClose }) => valueDisplay({ value: selectedLabel, onClose });
      }
      return selectedLabel.length ? (valueDisplay({ value: selectedLabel[0], onClose: noop }) as string) : '';
    };

    const renderCollapsedItems = useMemo(
      () =>
        collapsedItems
          ? () =>
              collapsedItems({
                value: selectedLabel,
                collapsedSelectedItems: selectedLabel.slice(minCollapsedNum, selectedLabel.length),
                count: selectedLabel.length - minCollapsedNum,
              })
          : null,
      [selectedLabel, collapsedItems, minCollapsedNum],
    );

    return (
      <div className={`${name}__wrap`} style={{ ...style }}>
        <SelectInput
          className={name}
          ref={ref}
          allowInput={multiple || filterable}
          multiple={multiple}
          value={isString(inputVal) && !multiple ? inputVal : selectedLabel}
          valueDisplay={renderValueDisplay()}
          clearable={clearable}
          disabled={disabled}
          borderless={borderless || !bordered}
          label={prefixIcon}
          suffixIcon={renderSuffixIcon()}
          panel={renderContent()}
          placeholder={placeholder || t(local.placeholder)}
          inputValue={inputValue}
          defaultInputValue={defaultInputValue}
          tagInputProps={{
            excessTagsDisplayType: 'break-line',
            ...tagInputProps,
          }}
          tagProps={tagProps}
          inputProps={{
            size,
            ...inputProps,
          }}
          minCollapsedNum={minCollapsedNum}
          collapsedItems={renderCollapsedItems}
          popupProps={{
            overlayClassName: `${name}__dropdown`,
            ...popupProps,
          }}
          popupVisible={showPopup}
          onPopupVisibleChange={handleShowPopup}
          onTagChange={onTagChange}
          onInputChange={handleInputChange}
          onFocus={onFocus}
          onEnter={onEnter}
          onBlur={onBlur}
          onClear={(context) => {
            onClearValue(context);
          }}
          {...selectInputProps}
        ></SelectInput>
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
