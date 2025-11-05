import React, { Children, cloneElement, isValidElement, useEffect, useMemo, useRef } from 'react';

import classNames from 'classnames';

import useConfig from '../../hooks/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import usePanelVirtualScroll from '../hooks/usePanelVirtualScroll';
import Option, { type SelectOptionProps } from './Option';
import OptionGroup from './OptionGroup';

import type {
  SelectOption,
  SelectOptionGroup,
  SelectValue,
  SelectValueChangeTrigger,
  TdOptionProps,
  TdSelectProps,
} from '../type';

interface SelectPopupProps
  extends Pick<
    TdSelectProps,
    | 'value'
    | 'size'
    | 'multiple'
    | 'empty'
    | 'options'
    | 'max'
    | 'loadingText'
    | 'loading'
    | 'valueType'
    | 'keys'
    | 'panelTopContent'
    | 'panelBottomContent'
    | 'scroll'
  > {
  onSelect?: SelectOptionProps['onSelect'];
  onChange?: (
    value: SelectValue,
    context?: {
      label?: string | number;
      value?: SelectValue;
      restData?: Record<string, any>;
      e: React.MouseEvent<HTMLLIElement>;
      trigger: SelectValueChangeTrigger;
    },
  ) => void;
  children?: React.ReactNode;
  hoverIndex: number;
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
  onCheckAllChange?: (checkAll: boolean, e: React.MouseEvent<HTMLLIElement>) => void;
  getPopupInstance?: () => HTMLDivElement;
}

const PopupContent = React.forwardRef<HTMLDivElement, SelectPopupProps>((props, ref) => {
  const {
    value,
    size,
    max,
    multiple,
    empty,
    loadingText,
    loading,
    children,
    keys,
    panelTopContent,
    panelBottomContent,
    onSelect,
    onCheckAllChange,
    getPopupInstance,
    options: propsOptions,
    scroll: propsScroll,
  } = props;

  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('select');
  const emptyText = t(local.empty);
  const popupContentRef = useRef<HTMLDivElement>(null);

  popupContentRef.current = getPopupInstance();

  const { visibleData, handleRowMounted, isVirtual, panelStyle, cursorStyle } = usePanelVirtualScroll({
    popupContentRef,
    scroll: propsScroll,
    options: propsOptions,
    size,
  });

  const optionsExcludedCheckAll = useMemo(() => {
    const uniqueOptions = {};
    propsOptions?.forEach((option: SelectOption) => {
      if ((option as SelectOptionGroup).group) {
        (option as SelectOptionGroup).children.forEach((item) => {
          if (!item.checkAll) {
            uniqueOptions[item.value] = item;
          }
        });
      } else if (!(option as TdOptionProps).checkAll) {
        uniqueOptions[(option as TdOptionProps).value] = option;
      }
    });
    return Object.values(uniqueOptions);
  }, [propsOptions]);

  const { classPrefix } = useConfig();

  // 当 hoverIndex 变化时，滚动到对应的选项
  useEffect(() => {
    if (props.hoverIndex < 0 || !popupContentRef.current || !props.showPopup) return;

    const rafId = requestAnimationFrame(() => {
      const hoverOption = popupContentRef.current?.querySelector(`.${classPrefix}-select-option__hover`) as HTMLElement;

      if (hoverOption && popupContentRef.current) {
        const container = popupContentRef.current;
        const containerRect = container.getBoundingClientRect();
        const optionRect = hoverOption.getBoundingClientRect();

        // 计算选项相对于容器的位置
        const optionTop = optionRect.top - containerRect.top + container.scrollTop;
        const optionBottom = optionTop + optionRect.height;

        const containerScrollTop = container.scrollTop;
        const containerScrollBottom = containerScrollTop + container.clientHeight;

        // 添加一个小的缓冲区，避免选项紧贴边缘
        const buffer = 4;

        // 如果选项在可见区域上方，滚动到选项顶部（向上滚动）
        if (optionTop < containerScrollTop + buffer) {
          container.scrollTop = Math.max(0, optionTop - buffer);
        }
        // 如果选项在可见区域下方，滚动到选项底部可见（向下滚动）
        else if (optionBottom > containerScrollBottom - buffer) {
          container.scrollTop = optionBottom - container.clientHeight + buffer;
        }
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [props.hoverIndex, props.showPopup, classPrefix]);

  if (!children && !propsOptions) {
    return null;
  }

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      const addedProps = {
        size,
        max,
        multiple,
        selectedValue: value,
        onSelect,
        currentOptions: propsOptions,
        valueType: props.valueType,
        onCheckAllChange,
        keys,
      };
      return cloneElement(child, { ...addedProps });
    }
    return child;
  });

  // 渲染 options
  const renderOptions = (options: SelectOption[], startFlatIndex = 0) => {
    if (options) {
      let flatIndex = startFlatIndex;
      // 通过 options API配置的
      return (
        <ul className={`${classPrefix}-select__list`}>
          {options.map((item, index) => {
            const { group, divider, ...rest } = item as SelectOptionGroup;
            if (group) {
              // 分组：递归渲染子选项，传递当前的 flatIndex
              const groupContent = renderOptions(rest.children, flatIndex);
              // 更新 flatIndex，跳过分组内的所有选项
              flatIndex += rest.children?.length || 0;
              return (
                <OptionGroup label={group} divider={divider} key={index} {...rest}>
                  {groupContent}
                </OptionGroup>
              );
            }

            const { value: optionValue, label, disabled, children, ...restData } = item as TdOptionProps;
            // 当 keys 属性配置 content 作为 value 或 label 时，确保 restData 中也包含它, 不参与渲染计算
            const { content } = item as TdOptionProps;
            const shouldOmitContent = Object.values(keys || {}).includes('content');

            const currentFlatIndex = flatIndex;
            flatIndex += 1; // 为下一个选项递增

            // 判断当前选项是否被 hover
            const isHovered = currentFlatIndex === props.hoverIndex;

            return (
              <Option
                key={index}
                className={classNames({
                  [`${classPrefix}-select-option__hover`]: isHovered,
                })}
                isHovered={isHovered}
                max={max}
                label={label}
                value={optionValue}
                onSelect={onSelect}
                selectedValue={value}
                optionLength={optionsExcludedCheckAll.length}
                multiple={multiple}
                size={size}
                disabled={disabled}
                restData={restData}
                keys={keys}
                onCheckAllChange={onCheckAllChange}
                onRowMounted={handleRowMounted}
                currentOptions={propsOptions}
                valueType={props.valueType}
                {...(isVirtual
                  ? {
                      isVirtual,
                      bufferSize: propsScroll?.bufferSize,
                      scrollType: propsScroll?.type,
                    }
                  : {})}
                {...restData}
                content={shouldOmitContent ? null : content}
              >
                {children}
              </Option>
            );
          })}
        </ul>
      );
    }
    return <ul className={`${classPrefix}-select__list`}>{childrenWithProps}</ul>;
  };

  const isEmpty =
    (Array.isArray(childrenWithProps) && !childrenWithProps.length) || (propsOptions && propsOptions.length === 0);

  const renderPanel = (renderedOptions: SelectOption[], extraStyle?: React.CSSProperties) => (
    <div
      ref={ref}
      className={classNames(`${classPrefix}-select__dropdown-inner`, {
        [`${classPrefix}-select__dropdown-inner--size-s`]: size === 'small',
        [`${classPrefix}-select__dropdown-inner--size-l`]: size === 'large',
        [`${classPrefix}-select__dropdown-inner--size-m`]: size === 'medium',
      })}
      style={extraStyle}
    >
      {loading && <div className={`${classPrefix}-select__loading-tips`}>{loadingText}</div>}
      {!loading && isEmpty && (
        <div className={`${classPrefix}-select__empty`}>{empty ? empty : <p>{emptyText}</p>}</div>
      )}
      {!loading && !isEmpty && renderOptions(renderedOptions)}
    </div>
  );
  if (isVirtual) {
    return (
      <>
        {panelTopContent}
        <div>
          <div style={cursorStyle}></div>
          {renderPanel(visibleData, panelStyle)}
        </div>
        {panelBottomContent}
      </>
    );
  }

  return (
    <>
      {panelTopContent}
      {renderPanel(propsOptions)}
      {panelBottomContent}
    </>
  );
});

export default PopupContent;
