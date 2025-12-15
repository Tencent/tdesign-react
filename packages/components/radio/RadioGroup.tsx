import React, { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import observe from '@tdesign/common-js/utils/observe';
import { CheckContext, type CheckContextValue } from '../common/Check';
import useCommonClassName from '../hooks/useCommonClassName';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import useMutationObserver from '../hooks/useMutationObserver';
import Radio from './Radio';
import { radioGroupDefaultProps } from './defaultProps';
import useKeyboard from './useKeyboard';

import type { StyledProps } from '../common';
import type { TdRadioGroupProps } from './type';

/**
 * RadioGroup 组件所接收的属性
 */
export interface RadioGroupProps extends TdRadioGroupProps, StyledProps {
  children?: ReactNode;
}

/**
 * 单选选项组，里面可以嵌套 <Radio />
 */
const RadioGroup: React.FC<RadioGroupProps> = (originalProps) => {
  const { classPrefix } = useConfig();

  const props = useDefaultProps<RadioGroupProps>(originalProps, radioGroupDefaultProps);
  const { disabled, readonly, children, onChange, size, variant, options = [], className, style, theme } = props;

  const [internalValue, setInternalValue] = useControlled(props, 'value', onChange);
  const [barStyle, setBarStyle] = useState<Partial<CSSProperties> | null>(null);

  const radioGroupRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>(null);

  useKeyboard(radioGroupRef, setInternalValue);

  const checkedRadioCls = `.${classPrefix}-radio-button.${classPrefix}-is-checked`;
  const { SIZE: sizeMap } = useCommonClassName();

  const context: CheckContextValue = {
    inject: (checkProps) => {
      // 如果已经受控，则不注入
      if (typeof checkProps.checked !== 'undefined') {
        return checkProps;
      }

      const { value: checkValue } = checkProps;

      return {
        ...checkProps,
        name: props.name,
        // 有一个允许取消，就可以取消选中
        allowUncheck: checkProps.allowUncheck || props.allowUncheck,
        checked: internalValue === checkProps.value,
        disabled: checkProps.disabled || disabled,
        readonly: checkProps.readonly || readonly,
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }
          setInternalValue(checked ? checkValue : undefined, { e, name: props.name });
        },
      };
    },
  };

  const calcBarStyle = () => {
    if (!variant.includes('filled')) return;

    const checkedRadio = radioGroupRef.current.querySelector?.(checkedRadioCls) as HTMLElement;
    if (!checkedRadio) {
      setBarStyle(null);
      return;
    }

    const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = checkedRadio;
    setBarStyle({
      width: `${offsetWidth}px`,
      height: `${offsetHeight}px`,
      left: `${offsetLeft}px`,
      top: `${offsetTop}px`,
    });
  };

  // 针对子元素更新的场景，包括 value 变化等
  // 只监听 class 属性变化，避免 bg-block 元素或子组件（如 Badge）导致无限循环
  useMutationObserver(
    radioGroupRef.current,
    (mutations) => {
      const hasRelevantChange = mutations.some((mutation) => {
        const target = mutation.target as HTMLElement;
        // 只关注 radio-button 元素的 class 变化（checked 状态变化）
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          return target.classList?.contains(`${classPrefix}-radio-button`);
        }
        return false;
      });

      if (hasRelevantChange) {
        calcBarStyle();
      }
    },
    {
      config: {
        attributes: true,
        attributeFilter: ['class'],
        childList: false,
        characterData: false,
        subtree: true,
      },
    },
  );

  useEffect(() => {
    calcBarStyle();
    if (!radioGroupRef.current) return;

    // 针对父元素初始化时隐藏导致无法正确计算尺寸的问题
    const observer = observe(radioGroupRef.current, null, calcBarStyle, 0);
    observerRef.current = observer;

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderBlock = () => {
    if (!variant.includes('filled') || !barStyle) {
      return null;
    }
    return <div style={barStyle} className={`${classPrefix}-radio-group__bg-block`}></div>;
  };

  const renderOptions = () => {
    const Comp = theme === 'button' ? Radio.Button : Radio;
    return options.map((item, index) => {
      let label: ReactNode;
      let value: string | number | boolean;
      let disabled: boolean | undefined;
      if (typeof item === 'string' || typeof item === 'number') {
        label = item;
        value = item;
      } else {
        label = item.label;
        value = item.value;
        disabled = item.disabled;
      }
      return (
        <Comp value={value} key={index} disabled={disabled}>
          {label}
        </Comp>
      );
    });
  };

  return (
    <CheckContext.Provider value={context}>
      <div
        ref={radioGroupRef}
        style={style}
        className={classNames(`${classPrefix}-radio-group`, sizeMap[size], className, {
          [`${classPrefix}-radio-group__outline`]: variant === 'outline',
          [`${classPrefix}-radio-group--filled`]: variant.includes('filled'),
          [`${classPrefix}-radio-group--primary-filled`]: variant === 'primary-filled',
        })}
      >
        {children || renderOptions()}
        {renderBlock()}
      </div>
    </CheckContext.Provider>
  );
};

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
