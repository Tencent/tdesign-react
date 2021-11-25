import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';
import useConfig from '../_util/useConfig';
import { CheckContext, CheckContextValue } from '../common/Check';
import { CheckboxOptionObj, TdCheckboxGroupProps } from '../_type/components/checkbox';
import { StyledProps } from '../_type';
import useDefault from '../_util/useDefault';
import Checkbox from './Checkbox';

export interface CheckboxGroupProps extends TdCheckboxGroupProps, StyledProps {
  children?: React.ReactNode;
}

/**
 * 多选选项组，里面可以嵌套 <Checkbox />
 */
export function CheckboxGroup(props: CheckboxGroupProps) {
  const { classPrefix } = useConfig();
  const { value, defaultValue, onChange, disabled, className, style, children, max, options = [] } = props;

  // 去掉所有 checkAll 之后的 options
  const optionsWithoutCheckAll = options.filter((t) => typeof t !== 'object' || !t.checkAll);
  const optionsWithoutCheckAllValues = [];
  optionsWithoutCheckAll.forEach((v) => {
    switch (typeof v) {
      case 'number' || 'string':
        optionsWithoutCheckAllValues.push(v);
        break;
      case 'object': {
        const vs = v as CheckboxOptionObj;
        optionsWithoutCheckAllValues.push(vs.value);
        break;
      }
      default:
        break;
    }
  });

  const [internalValue, setInternalValue] = useDefault(value, defaultValue, onChange);
  const [localMax, setLocalMax] = useState(max);

  const checkedSet = useMemo(() => {
    if (!Array.isArray(internalValue)) return new Set([]);
    return new Set([].concat(internalValue));
  }, [internalValue]);

  const indeterminate = useMemo(() => {
    const list = Array.from(checkedSet);
    return list.length !== 0 && list.length !== optionsWithoutCheckAll.length;
  }, [checkedSet, optionsWithoutCheckAll]);

  const checkAllChecked = useMemo(() => {
    const list = Array.from(checkedSet);
    return list.length === optionsWithoutCheckAll.length;
  }, [checkedSet, optionsWithoutCheckAll]);

  useEffect(() => {
    if (!isNumber(max)) return;
    if (max < checkedSet.size) {
      console.warn('[TDesign] max should be less than the length of value, change is invalid');
    } else {
      setLocalMax(max);
    }
  }, [max, checkedSet]);

  const context: CheckContextValue = {
    inject: (checkProps) => {
      // 如果已经受控，则不注入
      if (typeof checkProps.checked !== 'undefined') {
        return checkProps;
      }

      const { value: checkValue } = checkProps;

      return {
        ...checkProps,
        checked: checkedSet.has(checkValue),
        disabled: checkProps.disabled || disabled || (checkedSet.size >= localMax && !checkedSet.has(checkValue)),
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }
          if (checked) {
            if (checkedSet.size >= localMax && isNumber(max)) return;
            checkedSet.add(checkValue);
          } else {
            checkedSet.delete(checkValue);
          }
          setInternalValue(Array.from(checkedSet), { e });
        },
      };
    },
  };

  // options 和 children 的抉择,在未明确说明时，暂时以 options 优先
  const useOptions = Array.isArray(options) && options.length !== 0;

  return (
    <div className={classNames(`${classPrefix}-checkbox-group`, className)} style={style}>
      <CheckContext.Provider value={context}>
        {useOptions
          ? options.map((v) => {
              const type = typeof v;
              switch (type) {
                case 'number' || 'string': {
                  const vs = v as number | string;
                  return (
                    <Checkbox key={vs} label={vs} value={vs}>
                      {v}
                    </Checkbox>
                  );
                }
                case 'object': {
                  const vs = v as CheckboxOptionObj;
                  //
                  // 逻辑分层，将 checkAll 和常规按钮分开
                  let onChange: (checked: boolean, context: { e: ChangeEvent<HTMLInputElement> }) => void;
                  if (vs.checkAll) {
                    onChange = (checked, { e }) => {
                      if (checked) {
                        setInternalValue(optionsWithoutCheckAllValues, { e });
                      } else {
                        setInternalValue([], { e });
                      }
                    };
                  }

                  return vs.checkAll ? (
                    <Checkbox
                      key={vs.value}
                      {...v}
                      checkAll={true}
                      checked={checkAllChecked}
                      indeterminate={indeterminate}
                      onChange={onChange}
                      disabled={vs.disabled || disabled}
                    />
                  ) : (
                    <Checkbox key={vs.value} {...v} disabled={vs.disabled || disabled} />
                  );
                }
                default:
                  return null;
              }
            })
          : children}
      </CheckContext.Provider>
    </div>
  );
}
