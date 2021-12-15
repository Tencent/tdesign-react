import React, { useState, useRef, useEffect, Ref, ReactElement } from 'react';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import isString from 'lodash/isString';

import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import composeRefs from '../../_util/composeRefs';
import useDefaultValue from '../../_util/useDefaultValue';
import forwardRefWithStatics from '../../_util/forwardRefWithStatics';
import { getLabel, getMultipleTags, getSelectValueArr } from '../util/helper';
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
    } = useDefaultValue(props);

    const { classPrefix } = useConfig();

    const name = `${classPrefix}-select`; // t-select

    let selectedLabel = '';

    const [showPopup, setShowPopup] = useState(false);
    const [isHover, toggleHover] = useState(false);
    const [inputVal, setInputVal] = useState<string>(undefined);
    const [currentOptions, setCurrentOptions] = useState([]);

    const [width, setWidth] = useState(0);

    const selectRef = useRef(null);
    const overlayRef = useRef(null);

    if (value) {
      selectedLabel = getLabel(children, value, currentOptions, keys);
    }

    // 计算Select的宽高
    useEffect(() => {
      if (showPopup && selectRef?.current) {
        const domRect = selectRef.current.getBoundingClientRect();
        const overlayRect = overlayRef?.current?.getContentRef?.getBoundingClientRect?.();

        // 获取overlay的内容的宽度进行比较 如果比select本身宽，则优先使用overlay内容宽度，减少text被省略展示的情况
        const width =
          domRect.width > MAX_OVERLAY_WIDTH
            ? domRect.width
            : Math.min(MAX_OVERLAY_WIDTH, Math.max(domRect.width, overlayRect?.width));

        setWidth(width);
      }
    }, [showPopup]);

    useEffect(() => {
      onVisibleChange?.(showPopup);
    }, [showPopup, onVisibleChange]);

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
      } else {
        setCurrentOptions(options);
      }
    }, [options, keys, children]);

    // handle click outside
    useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (!selectRef.current || selectRef.current.contains(event.target)) {
          return;
        }
        if (showPopup) {
          setShowPopup(false);
        }
        if (!showPopup) {
          toggleHover(false);
        }
      };
      document.addEventListener('click', listener);
      return () => {
        document.removeEventListener('click', listener);
      };
    }, [showPopup, onVisibleChange]);

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
      onChange(value);

      if (filterable) {
        setInputVal(!multiple || (reserveKeyword && multiple) ? label : '');
      }
      if (creatable && isFunction(onCreate)) {
        if ((options as OptionsType).filter((option) => option.value === value).length === 0) {
          onCreate(value);
        }
      }
    };

    // 处理filter逻辑
    const handleFilter = (value: string) => {
      let filteredOptions: OptionsType;
      if (value.length === 0) {
        setCurrentOptions(options);
        return;
      }

      if (filter && isFunction(filter)) {
        // 如果有自定义的filter方法 使用自定义的filter方法
        filteredOptions = Array.isArray(options) && options.filter((option) => filter(value, option));
      } else {
        const filterRegExp = new RegExp(value, 'i');
        filteredOptions = Array.isArray(options) && options.filter((option) => filterRegExp.test(option?.label)); // 不区分大小写
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
          { [`${name}-placeholder`]: !value || (Array.isArray(value) && value.length < 1) },
          {
            [`${name}-selectedSingle`]: selectedLabel,
          },
        )}
      >
        {selectedLabel || placeholder || '-请选择-'}
      </span>
    );

    const renderMultipleTags = () => {
      if (multiple && Array.isArray(value) && value.length > 0) {
        let tags: OptionsType;
        let optionValue = [];
        if (valueType === 'value') {
          if (currentOptions) {
            optionValue = currentOptions.filter((option) => value.includes(option?.value));
          }
          if (children && Array.isArray(children)) {
            optionValue = children
              .reduce(
                (acc, item: ReactElement) =>
                  acc.concat({ value: item.props.value, label: item.props.label || item.props.children }),
                [],
              )
              .filter((option) => value.includes(option?.value));
          }

          tags = getMultipleTags(optionValue, keys);
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

    const renderInput = () => {
      const isEmpty = !value || (Array.isArray(value) && value.length === 0);
      return (
        <Input
          value={isString(inputVal) ? inputVal : selectedLabel}
          placeholder={isEmpty ? placeholder || '-请选择-' : undefined}
          className={`${name}-input`}
          onChange={handleInputChange}
          onFocus={(_, context) => onFocus?.({ value, e: context?.e })}
          onBlur={(_, context) => onBlur?.({ value, e: context?.e })}
          onEnter={(_, context) => onEnter?.({ inputValue: inputVal, value, e: context?.e })}
        />
      );
    };

    const onInputClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!disabled) {
        setShowPopup(!showPopup);
      }
    };

    const onClearValue = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (Array.isArray(value)) {
        onChange([]);
      } else {
        onChange('');
      }
      // Icon组件目前的ref
      onClear({ e: event as React.MouseEvent<HTMLDivElement, MouseEvent> });
    };

    // 渲染后置图标
    const renderSuffixIcon = () => {
      if (loading) {
        return (
          <Loading
            className={classNames(className, `${name}-right-icon`, `${name}-active-icon`)}
            loading={true}
            size="small"
          />
        );
      }
      if (clearable && value && isHover) {
        return (
          <CloseCircleFilledIcon
            onClick={clearable ? onClearValue : undefined}
            className={classNames(className, `${name}-right-icon`, `${name}-right-icon__clear`)}
          />
        );
      }
      return <FakeArrow overlayClassName={`${name}-right-icon`} isActive={showPopup} disabled={disabled} />;
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
        className={`${name}-wrap`}
        style={{ ...style }}
        onMouseEnter={() => toggleHover(true)}
        onMouseLeave={() => toggleHover(false)}
      >
        <Popup
          content={renderContent()}
          placement="bottom-left"
          visible={showPopup}
          overlayStyle={{
            width: width ? `${width}px` : 'none',
          }}
          overlayClassName={classNames(className, `${name}-dropdown`, `${classPrefix}-popup`, 'narrow-scrollbar')}
          className={`${name}-popup-reference`}
          expandAnimation={true}
          {...popupProps}
          ref={overlayRef}
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
            {<span className={`${name}-left-icon`}>{prefixIcon}</span>}
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
