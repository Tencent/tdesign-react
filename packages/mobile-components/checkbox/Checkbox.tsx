import React, { forwardRef, Ref, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { Check1Icon, Remove1Icon, CheckIcon, MinusIcon } from 'tdesign-icons-react';
import { TdCheckboxProps, TdCheckboxGroupProps } from './type';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import CheckboxGroup from './CheckboxGroup';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useDefault from '../_util/useDefault';
import parseTNode, { parseContentTNode } from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import { checkboxDefaultProps } from './defaultProps';

export interface CheckboxProps extends TdCheckboxProps, StyledProps {}

export type CheckboxInjectedProps = CheckboxProps & { direction?: TdCheckboxGroupProps['direction'] };

export interface CheckContextValue {
  inject: (props: CheckboxProps) => CheckboxInjectedProps;
}

export const CheckContext = React.createContext<CheckContextValue>(null);

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>((_props, ref) => {
  const context = useContext(CheckContext);
  const props = useDefaultProps<CheckboxInjectedProps>(context ? context.inject(_props) : _props, checkboxDefaultProps);
  const { classPrefix } = useConfig();
  const checkboxClass = usePrefixClass('checkbox');
  const {
    className,
    placement,
    content,
    indeterminate,
    label,
    onChange,
    checked,
    defaultChecked,
    maxLabelRow,
    maxContentRow,
    icon,
    contentDisabled,
    block,
    borderless,
    checkAll,
    disabled,
    readonly,
    direction,
  } = props;
  const [internalChecked, setInternalChecked] = useDefault(checked, defaultChecked, onChange);

  const isChecked = useMemo(() => (checkAll ? checked : internalChecked), [internalChecked, checkAll, checked]);

  const isActive = useMemo(() => isChecked || indeterminate, [isChecked, indeterminate]);

  const checkboxClassName = classNames(`${classPrefix}-checkbox`, {
    [`${checkboxClass}--${placement}`]: true,
    [`${checkboxClass}--checked`]: isChecked,
    [`${checkboxClass}--block`]: block,
    [`${checkboxClass}--${direction}`]: !!direction,
  });

  const renderIconContent = () => {
    if (Array.isArray(icon) && icon.length > 1) {
      const selectedIcon = icon[isActive ? 0 : 1];
      const iconContent =
        typeof selectedIcon === 'string' ? (
          <img className={`${checkboxClass}__icon-image`} src={selectedIcon} />
        ) : (
          selectedIcon
        );
      return parseContentTNode(iconContent, { className: `${checkboxClass}__icon-wrapper` });
    }
    if (icon !== 'circle' && icon !== true && icon !== 'rectangle' && icon !== 'line' && !Array.isArray(icon)) {
      return null;
    }

    let shape = 'circle';
    if (icon === 'rectangle') shape = 'rectangle';
    if (icon === 'line') shape = 'line';
    let ActiveIcon = indeterminate ? Remove1Icon : Check1Icon;
    if (shape === 'line') ActiveIcon = indeterminate ? MinusIcon : CheckIcon;
    return (
      <div
        className={classNames({
          [`${checkboxClass}__icon-${shape}`]: true,
          [`${checkboxClass}__icon-${shape}--checked`]: shape !== 'line' && isActive,
          [`${checkboxClass}__icon-${shape}--disabled`]: disabled,
        })}
      >
        {isActive && <ActiveIcon />}
      </div>
    );
  };

  const renderIconNode = () => (
    <div
      className={classNames({
        [`${checkboxClass}__icon`]: true,
        [`${checkboxClass}__icon--${placement}`]: true,
        [`${checkboxClass}__icon--checked`]: isActive,
        [`${checkboxClass}__icon--disabled`]: disabled,
      })}
    >
      {renderIconContent()}
    </div>
  );

  const handleClick = (e) => {
    if (contentDisabled || disabled || readonly) {
      e.preventDefault();
      return;
    }

    setInternalChecked(!internalChecked, { e });
  };

  const renderCheckBoxContent = () => (
    <div
      className={classNames({
        [`${checkboxClass}__content`]: true,
      })}
      onClick={(event) => {
        event.stopPropagation();
        handleClick(event);
      }}
    >
      <div
        className={classNames({
          [`${checkboxClass}__title`]: true,
          [`${checkboxClass}__title--checked`]: isChecked,
          [`${checkboxClass}__title--disabled`]: disabled,
        })}
        style={{ WebkitLineClamp: maxLabelRow }}
      >
        {parseTNode(label)}
      </div>
      <div
        className={classNames({
          [`${checkboxClass}__description`]: true,
          [`${checkboxClass}__description--disabled`]: disabled,
        })}
        style={{ WebkitLineClamp: maxContentRow }}
      >
        {parseTNode(content)}
      </div>
    </div>
  );

  return (
    <div ref={ref} className={classNames(checkboxClassName, className)} onClick={handleClick}>
      {icon && renderIconNode()}
      {renderCheckBoxContent()}
      {/* 下边框 */}
      {!borderless && <div className={`${checkboxClass}__border ${checkboxClass}__border--${placement}`}></div>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default forwardRefWithStatics(
  (props: CheckboxProps, ref: Ref<HTMLDivElement>) => <Checkbox ref={ref} {...props} />,
  { Group: CheckboxGroup },
);
