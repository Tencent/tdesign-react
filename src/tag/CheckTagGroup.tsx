import React from 'react';
import useControlled from '../hooks/useControlled';
import { StyledProps } from '../common';
import { checkTagGroupDefaultProps } from './defaultProps';
import { CheckTagGroupValue, TdCheckTagGroupProps, TdCheckTagProps } from './type';
import useConfig from '../hooks/useConfig';
import CheckTag from './CheckTag';
import useDefaultProps from '../hooks/useDefaultProps';

export interface CheckTagGroupProps extends TdCheckTagGroupProps, StyledProps {}

const CheckTagGroup: React.FC<CheckTagGroupProps> = (originalProps) => {
  const props = useDefaultProps<CheckTagGroupProps>(originalProps, checkTagGroupDefaultProps);
  const { options, onChange } = props;
  const { classPrefix } = useConfig();
  const componentName = `${classPrefix}-check-tag-group`;

  const [innerValue, setInnerValue] = useControlled(props, 'value', onChange);

  const onCheckTagChange: TdCheckTagProps['onChange'] = (checked, ctx) => {
    const { value } = ctx;
    if (checked) {
      if (props.multiple) {
        setInnerValue(innerValue.concat(value), { e: ctx.e, type: 'check', value });
      } else {
        setInnerValue([value], { e: ctx.e, type: 'check', value });
      }
    } else {
      let newValue: CheckTagGroupValue = [];
      if (props.multiple) {
        newValue = innerValue.filter((t) => t !== value);
      }
      setInnerValue(newValue, { e: ctx.e, type: 'uncheck', value });
    }
  };

  return (
    <div className={componentName}>
      {options?.map((option) => (
        <CheckTag
          key={option.value}
          value={option.value}
          data-value={option.value}
          checkedProps={props.checkedProps}
          uncheckedProps={props.uncheckedProps}
          checked={innerValue.includes(option.value)}
          onChange={onCheckTagChange}
          disabled={option.disabled}
          size={option.size}
        >
          {option.content ?? option.children ?? option.label}
        </CheckTag>
      ))}
    </div>
  );
};

CheckTagGroup.displayName = 'CheckTagGroup';

export default CheckTagGroup;
