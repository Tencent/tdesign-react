import React, { useContext } from 'react';
import classNames from 'classnames';
import { CloseIcon as TdCloseIcon, CheckIcon as TdCheckIcon } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { TdStepItemProps } from './type';
import { StyledProps } from '../common';
import StepsContext from './StepsContext';
import { stepItemDefaultProps } from './defaultProps';

export interface StepItemProps extends TdStepItemProps, StyledProps {
  index?: number;
  children?: React.ReactNode;
}

const StepItem = (props: StepItemProps) => {
  const { index, icon, title, content, value, children, style, status } = props;

  const { current, theme, onChange, readonly } = useContext(StepsContext);
  const { classPrefix, steps: globalStepsConfig } = useConfig();
  const { CloseIcon, CheckIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
    CheckIcon: TdCheckIcon,
  });

  const canClick = status !== 'process' && !readonly;

  // 步骤条每一步展示的图标
  function renderIcon() {
    if (!icon) return null;

    const iconCls = `${classPrefix}-steps-item__icon--number`;

    if (icon && icon !== true) return <span className={iconCls}>{icon}</span>;

    if (theme !== 'default') return null;

    if (status === 'error') return <span className={iconCls}>{globalStepsConfig.errorIcon || <CloseIcon />}</span>;

    if (status === 'finish')
      return (
        <span className={iconCls}>
          <CheckIcon />
        </span>
      );

    return <span className={iconCls}>{Number(index) + 1}</span>;
  }

  function onStepClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!canClick) return;
    const currentValue = value ?? index;
    onChange(currentValue, current, { e });
  }

  return (
    <div
      style={style}
      className={classNames({
        [`${classPrefix}-steps-item`]: true,
        [`${classPrefix}-steps-item--wait`]: status === 'default',
        [`${classPrefix}-steps-item--error`]: status === 'error',
        [`${classPrefix}-steps-item--finish`]: status === 'finish',
        [`${classPrefix}-steps-item--process`]: status === 'process',
        [props.className]: !!props.className,
      })}
    >
      <div
        className={classNames(`${classPrefix}-steps-item__inner`, {
          [`${classPrefix}-steps-item--clickable`]: canClick,
        })}
        onClick={onStepClick}
      >
        <div
          className={classNames(`${classPrefix}-steps-item__icon`, {
            [`${classPrefix}-steps-item-${status}`]: status,
          })}
        >
          {renderIcon()}
        </div>
        <div className={`${classPrefix}-steps-item__content`}>
          <div className={`${classPrefix}-steps-item__title`}>{title}</div>
          <div className={`${classPrefix}-steps-item__description`}>{content}</div>
          {children ? <div className={`${classPrefix}-steps-item__extra`}>{children}</div> : null}
        </div>
      </div>
    </div>
  );
};

StepItem.displayName = 'StepItem';
StepItem.defaultProps = stepItemDefaultProps;

export default StepItem;
