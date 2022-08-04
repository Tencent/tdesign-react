import React, { useState, useEffect, Ref, useMemo, useCallback, useRef } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import useControlled from '../../hooks/useControlled';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../hooks/useConfig';
import forwardRefWithStatics from '../../_util/forwardRefWithStatics';
import { getSelectValueArr, getValueToOption } from '../util/helper';
import noop from '../../_util/noop';
import FakeArrow from '../../common/FakeArrow';
import Loading from '../../loading';
import SelectInput from '../../select-input';
import Option from './Option';
import OptionGroup from './OptionGroup';
import PopupContent from './PopupContent';
import Tag from '../../tag';
import { TdSelectProps, TdOptionProps, SelectOption, SelectValueChangeTrigger } from '../type';
import { StyledProps } from '../../common';
import { selectDefaultProps } from '../defaultProps';
import { PopupVisibleChangeContext } from '../../popup';

export interface SelectProps extends TdSelectProps, StyledProps {
  // 子节点
  children?: React.ReactNode;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

type OptionsType = TdOptionProps[];

const Select = forwardRefWithStatics(
  (props: SelectProps, ref: Ref<HTMLDivElement>) => {
    // 国际化文本初始化
    const [local, t] = useLocaleReceiver('select');
    const emptyText = t(local.loadingText);

    const {
      readonly,
      bordered,
      borderless,
      autoWidth,
      creatable,
      filter,
      loadingText = emptyText,
      max,
      popupProps,
      reserveKeyword,
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
      empty,
      valueType,
      keys,
      children,
      collapsedItems,
      minCollapsedNum,
      valueDisplay,
      onEnter,
      onVisibleChange,
      showArrow,
      inputProps,
      panelBottomContent,
      panelTopContent,
      selectInputProps,
      tagInputProps,
      tagProps,
    } = props;

    const selectPopupRef = useRef();

    const [value, onChange] = useControlled(props, 'value', props.onChange);
    const { classPrefix } = useConfig();
    const { overlayClassName, ...restPopupProps } = popupProps || {};

    const name = `${classPrefix}-select`; // t-select

    const [showPopup, setShowPopup] = useControlled(props, 'popupVisible', props.onPopupVisibleChange);
    const [inputValue, onInputChange] = useControlled(props, 'inputValue', props.onInputChange);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [tmpPropOptions, setTmpPropOptions] = useState([]);
    const [valueToOption, setValueToOption] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);

    // 处理设置 option 的逻辑
    useEffect(() => {
      if (keys) {
        // 如果有定制 keys 先做转换
        const transformedOptions = options?.map((option) => ({
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

    // 同步 value 对应的 options
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

    const selectedLabel = useMemo(() => {
      if (multiple) {
        return selectedOptions.map((selectedOption) => get(selectedOption || {}, keys?.label || 'label') || '');
      }
      return get(selectedOptions[0] || {}, keys?.label || 'label') || undefined;
    }, [selectedOptions, keys, multiple]);

    const handleShowPopup = (visible: boolean, ctx: PopupVisibleChangeContext) => {
      if (disabled) return;
      setShowPopup(visible, ctx);
      onVisibleChange?.(visible);
      visible && onInputChange('');
    };

    // 可以根据触发来源，自由定制标签变化时的筛选器行为
    const onTagChange = (_currentTags, context) => {
      const { trigger, index, item, e } = context;
      // backspace
      if (trigger === 'backspace') {
        e.stopPropagation();

        let closest = -1;
        let len = index;
        while (len >= 0) {
          if (!selectedOptions[len]?.disabled) {
            closest = len;
            break;
          }
          len -= 1;
        }
        if (closest < 0) {
          return;
        }
        const values = getSelectValueArr(value, value[closest], true, valueType, keys);
        onChange(values, { e, trigger });
        return;
      }

      if (trigger === 'clear') {
        e.stopPropagation();
        onChange([], { e, trigger });
        return;
      }

      if (trigger === 'tag-remove') {
        e.stopPropagation();
        const values = getSelectValueArr(value, value[index], true, valueType, keys);
        onChange(values, { e, trigger });
        if (isFunction(onRemove)) {
          onRemove({
            value: value[index],
            data: {
              label: item,
              value: value[index],
            },
            e,
          });
        }
      }
    };

    // 选中 Popup 某项
    const handleChange = (
      value: string | number,
      context: { e: React.MouseEvent; trigger: SelectValueChangeTrigger },
    ) => {
      const { e, trigger } = context;
      if (multiple) {
        !reserveKeyword && onInputChange('', { trigger: 'clear' });
      }
      if (creatable && isFunction(onCreate)) {
        if ((options as OptionsType).filter((option) => option.value === value).length === 0) {
          onCreate(value);
        }
      }
      onChange?.(value, { e, trigger });
    };

    // 处理filter逻辑
    const handleFilter = (value: string) => {
      let filteredOptions: OptionsType = [];
      if (!value) {
        setCurrentOptions(tmpPropOptions);
        return;
      }

      if (filter && isFunction(filter)) {
        // 如果有自定义的filter方法 使用自定义的filter方法
        if (Array.isArray(tmpPropOptions)) {
          filteredOptions = tmpPropOptions.filter((option) => filter(value, option));
        }
      } else if (Array.isArray(tmpPropOptions)) {
        const upperValue = value.toUpperCase();
        filteredOptions = tmpPropOptions.filter((option) => (option?.label || '').toUpperCase().includes(upperValue)); // 不区分大小写
      }

      if (creatable) {
        filteredOptions = filteredOptions.concat([{ label: value, value }]);
      }
      setCurrentOptions(filteredOptions);
    };

    // 处理输入框逻辑
    const handleInputChange = (value: string) => {
      onInputChange(value);
      if (value === undefined) return;

      if (isFunction(onSearch)) {
        onSearch(value);
        return;
      }
    };

    const onClearValue = (context) => {
      context.e.stopPropagation();
      if (Array.isArray(value)) {
        onChange([], context);
      } else {
        onChange(null, context);
      }
      onInputChange(undefined);
      onClear(context);
    };

    useEffect(() => {
      if (typeof inputValue !== 'undefined') {
        handleFilter(String(inputValue));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    // 渲染后置图标
    const renderSuffixIcon = () => {
      if (loading) {
        return (
          <Loading className={classNames(`${name}__right-icon`, `${name}__active-icon`)} loading={true} size="small" />
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
        // popup弹出层内容只会在点击事件之后触发 并且无任何透传参数
        setShowPopup: (show) => handleShowPopup(show, {}),
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
      return (
        <PopupContent {...popupContentProps} ref={selectPopupRef}>
          {children}
        </PopupContent>
      );
    };

    const renderValueDisplay = () => {
      if (!valueDisplay) {
        if (!multiple) {
          if (typeof selectedLabel !== 'string') {
            return selectedLabel;
          }
          return '';
        }
        return ({ value: val }) =>
          val.slice(0, minCollapsedNum ? minCollapsedNum : val.length).map((v: string, key: number) => {
            const filterOption: SelectOption & { disabled?: boolean } = options?.find((option) => option.label === v);
            return (
              <Tag
                key={key}
                onClose={({ e }) => {
                  e.stopPropagation();
                  const values = getSelectValueArr(value, value[key], true, valueType, keys);
                  onChange(values, null);
                  return;
                }}
                closable={!filterOption?.disabled}
              >
                {v}
              </Tag>
            );
          });
      }
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

    // 将第一个选中的 option 置于列表可见范围的最后一位
    const updateScrollTop = useCallback(
      (content: HTMLDivElement) => {
        if (!selectPopupRef?.current) {
          return;
        }
        const firstSelectedNode: HTMLDivElement = (selectPopupRef?.current as HTMLUListElement).querySelector(
          `.${classPrefix}-is-selected`,
        );
        if (firstSelectedNode && content) {
          const { paddingBottom } = getComputedStyle(firstSelectedNode);
          const { marginBottom } = getComputedStyle(content);
          const elementBottomHeight = parseInt(paddingBottom, 10) + parseInt(marginBottom, 10);
          // 小于0时不需要特殊处理，会被设为0
          const updateValue =
            firstSelectedNode.offsetTop -
            content.offsetTop -
            (content.clientHeight - firstSelectedNode.clientHeight) +
            elementBottomHeight;
          // eslint-disable-next-line no-param-reassign
          content.scrollTop = updateValue;
        }
      },
      [classPrefix],
    );

    const { onMouseEnter, onMouseLeave } = props;

    return (
      <div
        className={classNames(`${name}__wrap`, className)}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <SelectInput
          autoWidth={!style?.width && autoWidth}
          ref={ref}
          className={name}
          readonly={readonly}
          allowInput={(filterable ?? local.filterable) || isFunction(filter)}
          multiple={multiple}
          value={selectedLabel}
          valueDisplay={renderValueDisplay()}
          clearable={clearable}
          disabled={disabled}
          borderless={borderless || !bordered}
          label={prefixIcon}
          suffixIcon={renderSuffixIcon()}
          panel={renderContent()}
          placeholder={!multiple && showPopup && selectedLabel ? selectedLabel : placeholder || t(local.placeholder)}
          inputValue={inputValue}
          tagInputProps={{
            autoWidth: true,
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
            overlayClassName: [`${name}__dropdown`, ['narrow-scrollbar'], overlayClassName],
            ...restPopupProps,
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
          updateScrollTop={updateScrollTop}
          {...selectInputProps}
        ></SelectInput>
      </div>
    );
  },
  {
    Option,
    OptionGroup,
  },
);

Select.displayName = 'Select';
Select.defaultProps = selectDefaultProps;

export default Select;
