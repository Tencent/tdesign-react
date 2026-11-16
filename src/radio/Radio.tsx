import React, { createContext, forwardRef, useContext, useRef } from 'react';
import type { Ref } from 'react';
import classNames from 'classnames';
import { Check1Icon, CheckIcon } from 'tdesign-icons-react';
import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useDefault from '../_util/useDefault';
import type { TdRadioProps, TdRadioGroupProps } from './type';
import type { StyledProps } from '../common';
import RadioGroup from './RadioGroup';
import useDefaultProps from '../hooks/useDefaultProps';
import { radioDefaultProps } from './defaultProps';

export interface RadioProps extends TdRadioProps, StyledProps {
  ref?: Ref<HTMLDivElement>;
}

export type RadioInjectedProps = RadioProps & { direction?: TdRadioGroupProps['direction'] };

export interface RadioContextValue {
  inject: (props: RadioProps) => RadioInjectedProps;
}
export const RadioContext = createContext<RadioContextValue>(null);

const Radio = forwardRef((_props: RadioProps, ref: Ref<HTMLDivElement>) => {
  const radioClass = usePrefixClass('radio');
  const inputRef = useRef(null);
  const context = useContext(RadioContext);
  const props = context ? context.inject(_props) : _props;

  const {
    className,
    style,
    allowUncheck,
    block,
    checked,
    content,
    defaultChecked,
    contentDisabled,
    placement = 'left',
    disabled,
    icon,
    label,
    maxContentRow,
    maxLabelRow,
    name,
    value,
    borderless,
    onChange,
    readonly,
    children,
    direction,
  } = useDefaultProps<RadioInjectedProps>(props, radioDefaultProps);

  const [radioChecked, setRadioChecked] = useDefault(checked, defaultChecked, onChange);

  const switchRadioChecked = (area?: string) => {
    if (disabled || readonly) {
      return;
    }
    if (area === 'content' && contentDisabled) {
      return;
    }
    if (radioChecked && !allowUncheck) {
      return;
    }
    setRadioChecked(!radioChecked, { e: inputRef.current });
  };

  const renderIcon = () => {
    if (Array.isArray(icon) && icon.length > 1) {
      return parseTNode(radioChecked ? icon[0] : icon[1]);
    }
    if (icon === 'none') return null;
    if (icon !== 'circle' && icon !== 'line' && icon !== 'dot') return null;

    if (icon === 'dot') {
      return (
        <div
          className={classNames({
            [`${radioClass}__icon-dot`]: true,
            [`${radioClass}__icon-dot--checked`]: radioChecked,
            [`${radioClass}__icon-dot--disabled`]: disabled,
          })}
        >
          {radioChecked && <div className={`${radioClass}__icon-dot-inner`} />}
        </div>
      );
    }

    const shape = icon === 'line' ? 'line' : 'circle';
    const ActiveIcon = shape === 'line' ? CheckIcon : Check1Icon;
    return (
      <div
        className={classNames({
          [`${radioClass}__icon-${shape}`]: true,
          [`${radioClass}__icon-${shape}--checked`]: shape !== 'line' && radioChecked,
          [`${radioClass}__icon-${shape}--disabled`]: disabled,
        })}
      >
        {radioChecked && <ActiveIcon />}
      </div>
    );
  };

  const radioClassName = classNames(
    `${radioClass}`,
    `${radioClass}--${placement}`,
    {
      [`${radioClass}--block`]: block,
      [`${radioClass}--${direction}`]: !!direction,
    },
    className,
  );

  const titleClassName = classNames(`${radioClass}__title`, { [`${radioClass}__title--disabled`]: disabled });

  const input = (
    <input
      type="radio"
      readOnly={readonly}
      name={name}
      ref={inputRef}
      // @ts-ignore
      value={value}
      disabled={disabled}
      className={classNames(`${radioClass}__original`)}
      checked={radioChecked}
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
      onChange={(e) => {
        setRadioChecked(e.currentTarget.checked, { e });
      }}
    />
  );

  const iconClass = classNames(`${radioClass}__icon`, `${radioClass}__icon--${placement}`, {
    [`${radioClass}__icon--checked`]: radioChecked,
    [`${radioClass}__icon--disabled`]: disabled,
  });
  return (
    <div style={style} className={radioClassName} ref={ref} onClick={() => switchRadioChecked()}>
      {input}
      <div className={iconClass}>{renderIcon()}</div>
      <div
        className={`${radioClass}__content`}
        onClick={(e) => {
          e.stopPropagation();
          switchRadioChecked('content');
        }}
      >
        {(label || children) && (
          <div className={titleClassName} style={{ WebkitLineClamp: maxLabelRow }}>
            {parseTNode(label) || parseTNode(children)}
          </div>
        )}
        {content && (
          <div
            className={classNames(`${radioClass}__description`, {
              [`${radioClass}__description--disabled`]: disabled,
            })}
            style={{ WebkitLineClamp: maxContentRow }}
          >
            {parseTNode(content)}
          </div>
        )}
      </div>

      {!borderless && <div className={`${radioClass}__border ${radioClass}__border--${placement}`}></div>}
    </div>
  );
});

Radio.displayName = 'Radio';

export default forwardRefWithStatics(
  (props: RadioProps, ref: Ref<HTMLDivElement>) => <Radio ref={ref} {...props}></Radio>,
  { Group: RadioGroup },
);
