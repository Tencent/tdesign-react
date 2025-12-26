import React, {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import classNames from 'classnames';
import { debounce, get, isFunction } from 'lodash-es';
import { composeRefs } from '../../_util/ref';
import forwardRefWithStatics from '../../_util/forwardRefWithStatics';
import { getOffsetTopToContainer } from '../../_util/helper';
import noop from '../../_util/noop';
import { extractTextFromTNode, parseContentTNode } from '../../_util/parseTNode';
import FakeArrow from '../../common/FakeArrow';
import useConfig from '../../hooks/useConfig';
import useControlled from '../../hooks/useControlled';
import useDefaultProps from '../../hooks/useDefaultProps';
import Loading from '../../loading';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import SelectInput, { type SelectInputValue, type SelectInputValueChangeContext } from '../../select-input';
import Tag from '../../tag';
import { selectDefaultProps } from '../defaultProps';
import useKeyboardControl from '../hooks/useKeyboardControl';
import useOptions, { isSelectOptionGroup } from '../hooks/useOptions';
import { getKeyMapping, getSelectValueArr, getSelectedOptions } from '../util/helper';
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
    const readOnly = props.readOnly || props.readonly;

    const [value, onChange] = useControlled(props, 'value', props.onChange);

    const { valueKey, labelKey, disabledKey } = useMemo(() => getKeyMapping(keys), [keys]);

    const selectInputRef = useRef(null);
    const { classPrefix } = useConfig();
    const { overlayClassName, onScroll, onScrollToBottom, ...restPopupProps } = popupProps || {};
    const [isScrolling, toggleIsScrolling] = useState(false);

    const name = `${classPrefix}-select`; // t-select
    const [inputValue, onInputChange] = useControlled(props, 'inputValue', props.onInputChange);

    const [innerPopupVisible, setInnerPopupVisible] = useControlled(props, 'popupVisible', onPopupVisibleChange);

    const handlePopupVisibleChange = (visible: boolean, ctx: PopupVisibleChangeContext) => {
      if (disabled) return;
      visible ? toggleIsScrolling(false) : onInputChange('', { trigger: 'blur' });
      setInnerPopupVisible(visible, ctx);
    };

    const { currentOptions, setCurrentOptions, tmpPropOptions, valueToOption, selectedOptions, flattenedOptions } =
      useOptions(keys, options, children, valueType, value, reserveKeyword);

    const onCheckAllChange = useCallback(
      (checkAll: boolean, e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLInputElement>) => {
        const isDisabledCheckAll = (opt: TdOptionProps) => opt.checkAll && opt.disabled;
        if (!multiple || currentOptions.some((opt) => !isSelectOptionGroup(opt) && isDisabledCheckAll(opt))) return;

        const isObjectType = valueType === 'object';
        const enabledOptions: SelectOption[] = [];

        currentOptions.forEach((option) => {
          // 如果涉及分组，需要将分组内的选项进行计算，否则会影响全选的功能
          if (isSelectOptionGroup(option)) {
            option.children?.forEach((item) => {
              if (!item.checkAll && !item.disabled) {
                enabledOptions.push(item);
              }
            });
          } else {
            !option.checkAll && !option.disabled && enabledOptions.push(option);
          }
        });

        const currentValues = Array.isArray(value) ? value : [];
        const disabledSelectedOptions: SelectOption[] = [];

        const isDisabledAndSelected = (opt: TdOptionProps) => {
          if (opt.checkAll || !opt.disabled) return false;
          if (isObjectType) return currentValues.some((v) => get(v, valueKey) === opt[valueKey]);
          return currentValues.includes(opt[valueKey]);
        };

        currentOptions.forEach((opt) => {
          if (isSelectOptionGroup(opt)) {
            // 处理分组内的禁用选项
            opt.children?.forEach((item) => {
              if (isDisabledAndSelected(item)) {
                disabledSelectedOptions.push(item);
              }
            });
          } else if (isDisabledAndSelected(opt)) {
            disabledSelectedOptions.push(opt);
          }
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
      },
      [currentOptions, keys, multiple, value, valueKey, valueToOption, valueType, onChange],
    );

    const selectedLabel = useMemo(() => {
      if (multiple) {
        return selectedOptions.map((selectedOption) => get(selectedOption || {}, labelKey) || '');
      }
      return get(selectedOptions[0] || {}, labelKey) || undefined;
    }, [multiple, selectedOptions, labelKey]);

    // 可以根据触发来源，自由定制标签变化时的筛选器行为
    const onTagChange = (_currentTags: SelectInputValue, context) => {
      const handleRemove = (removeIndex, trigger, e, label) => {
        const values = getSelectValueArr(value, value[removeIndex], true, valueType, keys);
        const { currentSelectedOptions } = getSelectedOptions(values, multiple, valueType, keys, valueToOption);
        onChange(values, { e, trigger, selectedOptions: currentSelectedOptions });
        onRemove?.({
          value: value[removeIndex],
          data: {
            label,
            value: value[removeIndex],
          },
          e,
        });
      };

      const { trigger, index, item, e } = context;
      e.stopPropagation();

      if (trigger === 'backspace') {
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
        if (closest >= 0) {
          const label = get(selectedOptions[closest], getKeyMapping(keys).labelKey);
          handleRemove(closest, trigger, e, label);
        }
        return;
      }

      if (trigger === 'tag-remove') {
        e?.stopPropagation?.();
        handleRemove(index, trigger, e, item);
      }
    };

    // 选中 Popup 某项
    const handleChange = (
      value: string | number | Array<string | number | Record<string, string | number>>,
      context: {
        e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLInputElement>;
        trigger: SelectValueChangeTrigger;
        value?: SelectValue;
        label?: string | number;
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
        const option = (options as OptionsType)?.find((option) => option.value === value);
        onRemove({
          value,
          data: option,
          e: context.e,
        });
      }
    };

    const { hoverIndex, handleKeyDown } = useKeyboardControl({
      displayOptions: flattenedOptions as TdOptionProps[],
      keys,
      innerPopupVisible,
      max,
      multiple,
      selectInputRef,
      value,
      valueType,
      handlePopupVisibleChange,
      handleChange,
      onCheckAllChange,
      toggleIsScrolling,
    });

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
        const searchableText = extractTextFromTNode(option.label);
        return searchableText.toUpperCase().includes(upperValue);
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
        onSearch(value, { e: context.e as React.KeyboardEvent<HTMLDivElement> });
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

      return (
        showArrow && <FakeArrow className={`${name}__right-icon`} isActive={innerPopupVisible} disabled={disabled} />
      );
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
        showPopup: innerPopupVisible,
        // popup弹出层内容只会在点击事件之后触发 并且无任何透传参数
        setShowPopup: (show: boolean) => handlePopupVisibleChange(show, {}),
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
        hoverIndex,
      };
      return <PopupContent {...popupContentProps}>{childrenWithProps}</PopupContent>;
    };

    const renderValueDisplay = useMemo(() => {
      if (!valueDisplay) {
        if (!multiple) return selectedLabel;
        return ({ value: val }) =>
          val.slice(0, minCollapsedNum ? minCollapsedNum : val.length).map((_, index: number) => {
            const targetVal = get(selectedOptions[index], valueKey);
            const targetLabel = get(selectedOptions[index], labelKey);
            const targetOption = valueToOption[targetVal];
            if (!targetOption) return null;
            return (
              <Tag
                key={index}
                closable={!get(targetOption, disabledKey) && !disabled && !readOnly}
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
                    data: { label: targetLabel, value: targetVal },
                    e: e as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>,
                  });
                }}
              >
                {targetLabel}
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
      readOnly,
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

    const handleEnter = (_, context: { inputValue: string; e: React.KeyboardEvent<HTMLDivElement> }) => {
      onEnter?.({ ...context, value });
    };

    const handleScroll = ({ e }: { e: React.WheelEvent<HTMLDivElement> }) => {
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
          readonly={readOnly}
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
          placeholder={
            !multiple && innerPopupVisible && selectedLabel ? selectedLabel : placeholder || t(local.placeholder)
          }
          inputValue={inputValue}
          tagInputProps={{
            size,
            ...tagInputProps,
          }}
          tagProps={{ size, ...tagProps }}
          inputProps={{
            size,
            ...inputProps,
            onKeydown: handleKeyDown,
          }}
          minCollapsedNum={minCollapsedNum}
          collapsedItems={collapsedItems}
          updateScrollTop={updateScrollTop}
          popupProps={{
            overlayClassName: [`${name}__dropdown`, overlayClassName],
            onScroll: handleScroll,
            ...restPopupProps,
          }}
          popupVisible={innerPopupVisible}
          onPopupVisibleChange={handlePopupVisibleChange}
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
