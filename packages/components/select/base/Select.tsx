import React, {
  Children,
  KeyboardEvent,
  WheelEvent,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { debounce, get, isFunction } from 'lodash-es';
import composeRefs from '../../_util/composeRefs';
import forwardRefWithStatics from '../../_util/forwardRefWithStatics';
import { getOffsetTopToContainer } from '../../_util/helper';
import noop from '../../_util/noop';
import { parseContentTNode } from '../../_util/parseTNode';
import FakeArrow from '../../common/FakeArrow';
import useConfig from '../../hooks/useConfig';
import useControlled from '../../hooks/useControlled';
import useDefaultProps from '../../hooks/useDefaultProps';
import Loading from '../../loading';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import SelectInput, { type SelectInputValue, type SelectInputValueChangeContext } from '../../select-input';
import Tag from '../../tag';
import { selectDefaultProps } from '../defaultProps';
import useOptions, { isSelectOptionGroup } from '../hooks/useOptions';
import { getSelectValueArr, getSelectedOptions } from '../util/helper';
import Option from './Option';
import OptionGroup from './OptionGroup';
import PopupContent from './PopupContent';

import type { StyledProps } from '../../common';
import type { PopupVisibleChangeContext } from '../../popup';
import type { SelectOption, SelectValue, SelectValueChangeTrigger, TdOptionProps, TdSelectProps } from '../type';

export interface SelectProps<T = SelectOption> extends TdSelectProps<T>, StyledProps {
  // 子节点
  children?: React.ReactNode;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

type OptionsType = TdOptionProps[];

const Select = forwardRefWithStatics(
  (originalProps: SelectProps, ref: React.Ref<HTMLDivElement>) => {
    const props = useDefaultProps<SelectProps>(originalProps, selectDefaultProps);
    // 国际化文本初始化
    const [local, t] = useLocaleReceiver('select');
    const emptyText = t(local.loadingText);

    const {
      readonly,
      borderless,
      autoWidth,
      creatable,
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
      empty,
      valueType,
      keys,
      children,
      collapsedItems,
      minCollapsedNum,
      valueDisplay,
      showArrow,
      inputProps,
      panelBottomContent,
      panelTopContent,
      selectInputProps,
      tagInputProps,
      tagProps,
      scroll,
      suffixIcon,
      label,
      filter,
      onFocus,
      onBlur,
      onClear = noop,
      onCreate,
      onRemove,
      onSearch,
      onEnter,
      onPopupVisibleChange,
    } = props;

    const [value, onChange] = useControlled(props, 'value', props.onChange);
    const selectInputRef = useRef(null);
    const { classPrefix } = useConfig();
    const { overlayClassName, onScroll, onScrollToBottom, ...restPopupProps } = popupProps || {};
    const [isScrolling, toggleIsScrolling] = useState(false);

    const name = `${classPrefix}-select`; // t-select

    const [showPopup, setShowPopup] = useControlled(props, 'popupVisible', onPopupVisibleChange);
    const [inputValue, onInputChange] = useControlled(props, 'inputValue', props.onInputChange);

    const { currentOptions, setCurrentOptions, tmpPropOptions, valueToOption, selectedOptions } = useOptions(
      keys,
      options,
      children,
      valueType,
      value,
      reserveKeyword,
    );

    const selectedLabel = useMemo(() => {
      if (multiple) {
        return selectedOptions.map((selectedOption) => get(selectedOption || {}, keys?.label || 'label') || '');
      }
      return get(selectedOptions[0] || {}, keys?.label || 'label') || undefined;
    }, [selectedOptions, keys, multiple]);

    const handleShowPopup = (visible: boolean, ctx: PopupVisibleChangeContext) => {
      if (disabled) return;
      visible && toggleIsScrolling(false);
      !visible && onInputChange('', { trigger: 'blur' });
      setShowPopup(visible, ctx);
    };

    // 可以根据触发来源，自由定制标签变化时的筛选器行为
    const onTagChange = (_currentTags: SelectInputValue, context) => {
      const { trigger, index, item, e } = context;
      // backspace
      if (trigger === 'backspace') {
        e.stopPropagation();

        let closest = -1;
        let len = index;
        while (len >= 0) {
          const option = selectedOptions[len];
          if (!isSelectOptionGroup(option) && !option.disabled) {
            closest = len;
            break;
          }
          len -= 1;
        }
        if (closest < 0) {
          return;
        }
        const values = getSelectValueArr(value, value[closest], true, valueType, keys);

        // 处理onChange回调中的selectedOptions参数
        const { currentSelectedOptions } = getSelectedOptions(values, multiple, valueType, keys, valueToOption);
        onChange(values, { e, trigger, selectedOptions: currentSelectedOptions });
        return;
      }

      if (trigger === 'tag-remove') {
        e?.stopPropagation?.();
        const values = getSelectValueArr(value, value[index], true, valueType, keys);
        // 处理onChange回调中的selectedOptions参数
        const { currentSelectedOptions } = getSelectedOptions(values, multiple, valueType, keys, valueToOption);

        onChange(values, { e, trigger, selectedOptions: currentSelectedOptions });
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

    const onCheckAllChange = (checkAll: boolean, e: React.MouseEvent<HTMLLIElement>) => {
      const isDisabledCheckAll = (opt: TdOptionProps) => opt.checkAll && opt.disabled;
      if (!multiple || currentOptions.some((opt) => !isSelectOptionGroup(opt) && isDisabledCheckAll(opt))) {
        return;
      }

      const valueKey = keys?.value || 'value';
      const isObjectType = valueType === 'object';

      const enabledOptions = currentOptions.filter(
        (opt) => !isSelectOptionGroup(opt) && !opt.checkAll && !opt.disabled,
      );

      const currentValues = Array.isArray(value) ? value : [];
      const disabledSelectedOptions = currentOptions.filter((opt) => {
        if (isSelectOptionGroup(opt) || opt.checkAll) return false;
        if (!opt.disabled) return false;
        if (isObjectType) {
          return currentValues.some((v) => get(v, valueKey) === opt[valueKey]);
        }
        return currentValues.includes(opt[valueKey]);
      });

      let checkAllValue: SelectValue[];

      if (checkAll) {
        // 全选：选中所有未禁用的选项 + 保留已选中的禁用选项
        const enabledValues = enabledOptions.map((opt) => (isObjectType ? opt : opt[valueKey]));
        const disabledValues = disabledSelectedOptions.map((opt) => (isObjectType ? opt : opt[valueKey]));
        checkAllValue = [...disabledValues, ...enabledValues];
      } else {
        // 取消全选：只保留已选中的禁用选项
        checkAllValue = disabledSelectedOptions.map((opt) => (isObjectType ? opt : opt[valueKey]));
      }

      const { currentSelectedOptions } = getSelectedOptions(checkAllValue, multiple, valueType, keys, valueToOption);

      onChange?.(checkAllValue, {
        e,
        trigger: checkAll ? 'check' : 'uncheck',
        selectedOptions: currentSelectedOptions,
      });
    };

    // 选中 Popup 某项
    const handleChange = (
      value: string | number | Array<string | number | Record<string, string | number>>,
      context: {
        e: React.MouseEvent<HTMLLIElement>;
        trigger: SelectValueChangeTrigger;
        value?: SelectValue;
        label?: string;
      },
    ) => {
      const selectedValue = multiple ? context.value : value;

      if (multiple) {
        !reserveKeyword && inputValue && onInputChange('', { e: context.e, trigger: 'change' });
      }
      if (creatable && isFunction(onCreate)) {
        if ((options as OptionsType).filter((option) => option.value === selectedValue).length === 0) {
          onCreate(selectedValue as string); // 手动输入 此时为string
        }
      }
      // 处理onChange回调中的selectedOptions参数
      const { currentSelectedOptions, currentOption } = getSelectedOptions(
        value,
        multiple,
        valueType,
        keys,
        valueToOption,
        selectedValue,
      );
      onChange?.(value, {
        e: context.e,
        trigger: context.trigger,
        selectedOptions: currentSelectedOptions,
        option: currentOption,
      });

      if (multiple && context?.trigger === 'uncheck' && isFunction(onRemove)) {
        const value = context?.value;
        const option = (options as OptionsType).find((option) => option.value === value);
        onRemove({
          value,
          data: option,
          e: context.e,
        });
      }
    };

    // 处理filter逻辑
    const handleFilter = (value: string) => {
      let filteredOptions: SelectOption[] = [];
      if (filterable && isFunction(onSearch)) {
        return;
      }
      if (!value) {
        setCurrentOptions(tmpPropOptions);
        return;
      }

      const filterLabels = [];
      const filterMethods = (option: SelectOption) => {
        if (filter && isFunction(filter)) {
          return filter(value, option);
        }
        const upperValue = value.toUpperCase();
        return (option?.label || '').toUpperCase().includes(upperValue);
      };

      tmpPropOptions?.forEach((option) => {
        if (isSelectOptionGroup(option)) {
          filteredOptions.push({
            ...option,
            children: option.children?.filter((child) => {
              if (filterMethods(child)) {
                filterLabels.push(child.label);
                return true;
              }
              return false;
            }),
          });
        } else if (filterMethods(option)) {
          filterLabels.push(option.label);
          filteredOptions.push(option);
        }
      });
      const isSameLabelOptionExist = filterLabels.includes(value);
      if (creatable && !isSameLabelOptionExist) {
        filteredOptions = filteredOptions.concat([{ label: value, value }]);
      }
      setCurrentOptions(filteredOptions);
    };

    // 处理输入框逻辑
    const handleInputChange = (value: string, context: SelectInputValueChangeContext) => {
      if (context.trigger !== 'clear') {
        onInputChange(value, { e: context.e, trigger: 'input' });
      }
      if (value === undefined) {
        return;
      }
      if (isFunction(onSearch)) {
        onSearch(value, { e: context.e as KeyboardEvent<HTMLDivElement> });
        return;
      }
    };

    const handleClear = (context) => {
      context.e.stopPropagation();
      if (Array.isArray(value)) {
        onChange([], { ...context, trigger: 'clear', selectedOptions: [] });
      } else {
        onChange(null, { ...context, trigger: 'clear', selectedOptions: [] });
      }
      onClear(context);
    };

    useEffect(() => {
      if (typeof inputValue !== 'undefined') {
        handleFilter(String(inputValue));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, tmpPropOptions]);

    // 渲染后置图标
    const renderSuffixIcon = () => {
      if (suffixIcon) {
        return suffixIcon;
      }
      if (loading) {
        return (
          <Loading className={classNames(`${name}__right-icon`, `${name}__active-icon`)} loading={true} size="small" />
        );
      }

      return showArrow && <FakeArrow className={`${name}__right-icon`} isActive={showPopup} disabled={disabled} />;
    };
    const getPopupInstance = useCallback(() => (selectInputRef as any).current?.getPopupContentElement(), []);

    const childrenWithProps = Children.map(children, (child) => {
      if (isValidElement(child)) {
        const addedProps = { multiple };
        return cloneElement(child, { ...addedProps });
      }
      return child;
    });
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
        setShowPopup: (show: boolean) => handleShowPopup(show, {}),
        options: currentOptions,
        empty,
        max,
        loadingText,
        loading,
        valueType,
        keys,
        panelBottomContent,
        panelTopContent,
        onCheckAllChange,
        getPopupInstance,
        scroll,
      };
      return <PopupContent {...popupContentProps}>{childrenWithProps}</PopupContent>;
    };

    const renderValueDisplay = useMemo(() => {
      if (!valueDisplay) {
        if (!multiple) {
          if (typeof selectedLabel !== 'string') {
            return selectedLabel;
          }
          return '';
        }
        return ({ value: val }) =>
          val.slice(0, minCollapsedNum ? minCollapsedNum : val.length).map((_, index: number) => {
            const valueKey = keys?.value || 'value';
            const labelKey = keys?.label || 'label';
            const disabledKey = keys?.disabled || 'disabled';

            const targetVal = selectedOptions[index]?.[valueKey];
            const targetOption = currentOptions.find((option) => {
              if (isSelectOptionGroup(option)) {
                return option.children?.some((child) => child[valueKey] === targetVal);
              }
              return option[valueKey] === targetVal;
            });
            if (!targetOption) return null;

            return (
              <Tag
                key={index}
                closable={!targetOption[disabledKey] && !disabled && !readonly}
                size={size}
                {...tagProps}
                onClose={({ e }) => {
                  e.stopPropagation();
                  e?.nativeEvent?.stopImmediatePropagation?.();
                  const values = getSelectValueArr(value, value[index], true, valueType, keys);

                  const { currentSelectedOptions } = getSelectedOptions(
                    values,
                    multiple,
                    valueType,
                    keys,
                    valueToOption,
                    value,
                  );
                  onChange(values, {
                    e,
                    selectedOptions: currentSelectedOptions,
                    trigger: 'tag-remove',
                  });
                  tagProps?.onClose?.({ e });

                  onRemove?.({
                    value: targetVal,
                    data: { label: targetOption[labelKey], value: targetVal },
                    e: e as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>,
                  });
                }}
              >
                {targetOption[labelKey]}
              </Tag>
            );
          });
      }
      if (typeof valueDisplay === 'string') {
        return valueDisplay;
      }
      if (multiple) {
        return ({ onClose }) => parseContentTNode(valueDisplay, { value: selectedOptions, onClose });
      }
      return parseContentTNode(valueDisplay, { value: selectedLabel, onClose: noop });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      valueDisplay,
      multiple,
      selectedLabel,
      minCollapsedNum,
      options,
      disabled,
      readonly,
      size,
      tagProps,
      value,
      valueType,
      keys,
      valueToOption,
      onRemove,
      selectedOptions,
    ]);

    // 将第一个选中的 option 置于列表可见范围的最后一位
    const updateScrollTop = (content: HTMLDivElement) => {
      if (!content || isScrolling) {
        return;
      }
      const firstSelectedNode: HTMLDivElement = content.querySelector(`.${classPrefix}-is-selected`);
      if (!multiple && firstSelectedNode) {
        const { paddingBottom } = getComputedStyle(firstSelectedNode);
        const { marginBottom } = getComputedStyle(content);
        const elementBottomHeight = parseInt(paddingBottom, 10) + parseInt(marginBottom, 10);
        // 小于0时不需要特殊处理，会被设为0
        const updateValue =
          getOffsetTopToContainer(firstSelectedNode, content) -
          content.offsetTop -
          (content.clientHeight - firstSelectedNode.clientHeight) +
          elementBottomHeight;

        // 通过 setTimeout 确保组件渲染完成后再设置 scrollTop
        setTimeout(() => {
          // eslint-disable-next-line no-param-reassign
          content.scrollTop = updateValue;
        });
      }
    };

    const { onMouseEnter, onMouseLeave } = props;

    const handleEnter = (_, context: { inputValue: string; e: KeyboardEvent<HTMLDivElement> }) => {
      onEnter?.({ ...context, value });
    };

    const handleScroll = ({ e }: { e: WheelEvent<HTMLDivElement> }) => {
      toggleIsScrolling(true);

      onScroll?.({ e });
      if (onScrollToBottom) {
        const debounceOnScrollBottom = debounce((e) => onScrollToBottom({ e }), 100);

        const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLDivElement;
        if (clientHeight + Math.floor(scrollTop) === scrollHeight) {
          debounceOnScrollBottom(e);
        }
      }
    };
    return (
      <div
        className={classNames(`${name}__wrap`, className)}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <SelectInput
          autoWidth={!style?.width && autoWidth}
          ref={composeRefs(ref, selectInputRef)}
          className={name}
          readonly={readonly}
          autofocus={props.autofocus}
          allowInput={(filterable ?? local.filterable) || isFunction(filter)}
          multiple={multiple}
          value={selectedLabel}
          options={selectedOptions}
          valueDisplay={renderValueDisplay}
          clearable={clearable}
          disabled={disabled}
          status={props.status}
          tips={props.tips}
          borderless={borderless}
          label={label}
          suffix={props.suffix}
          prefixIcon={prefixIcon}
          suffixIcon={renderSuffixIcon()}
          panel={renderContent()}
          placeholder={!multiple && showPopup && selectedLabel ? selectedLabel : placeholder || t(local.placeholder)}
          inputValue={inputValue}
          tagInputProps={{
            size,
            ...tagInputProps,
          }}
          tagProps={{ size, ...tagProps }}
          inputProps={{
            size,
            ...inputProps,
          }}
          minCollapsedNum={minCollapsedNum}
          collapsedItems={collapsedItems}
          updateScrollTop={updateScrollTop}
          popupProps={{
            overlayClassName: [`${name}__dropdown`, overlayClassName],
            onScroll: handleScroll,
            ...restPopupProps,
          }}
          popupVisible={showPopup}
          onPopupVisibleChange={handleShowPopup}
          onTagChange={onTagChange}
          onInputChange={handleInputChange}
          onFocus={onFocus}
          onEnter={handleEnter}
          onBlur={(_, context) => {
            onBlur?.({ value, e: context.e as React.FocusEvent<HTMLDivElement> });
          }}
          onClear={handleClear}
          {...selectInputProps}
        />
      </div>
    );
  },
  { Option, OptionGroup },
);

Select.displayName = 'Select';

export default Select;
