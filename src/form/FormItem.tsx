import React, { forwardRef } from 'react';
import classNames from 'classnames';
// import { validate } from './formModel';
import useConfig from '../_util/useConfig';
import { useFormContext } from './FormContext';
import { TdFormItemProps } from './FormProps';

const FormItem: React.FC<TdFormItemProps> = forwardRef((props) => {
  const { classPrefix } = useConfig();
  const { children, label, name, help } = props;
  const { colon, requiredMark, layout, labelAlign, labelWidth, showErrorMessage } = useFormContext();
  const formItemClass = classNames(
    `${classPrefix}-form__item`,
    `${classPrefix}-form-row`,
    `${classPrefix}-form-item__${name}`,
  );
  const formItemLabelClass = classNames(`${classPrefix}-col`, `${classPrefix}-form__label`, {
    [`${classPrefix}-form__label--required`]: requiredMark,
    [`${classPrefix}-form__label--colon`]: colon,
    [`${classPrefix}-form__label--top`]: layout === 'inline',
    [`${classPrefix}-form__label--${labelAlign}`]: layout !== 'inline',
    [`${classPrefix}-col-12`]: labelAlign === 'top' && layout !== 'inline',
    [`${classPrefix}-col-1`]: labelAlign !== 'top' && layout !== 'inline',
  });

  const labelProps = !labelWidth ? {} : { minWidth: `${labelWidth}px` };

  const contentClasses = classNames(`${classPrefix}-form__controls`, `${classPrefix}-col`);

  const renderTipsInfo = () => {
    if (help) {
      return <span className={`${classPrefix}-input__extra`}>{help}</span>;
    }
    if (!showErrorMessage) return;
  };

  return (
    <div className={formItemClass}>
      <div className={formItemLabelClass} style={labelProps}>
        <label htmlFor={props?.for}>{label}</label>
      </div>
      <div className={contentClasses}>
        <div className={`${classPrefix}-form__controls--content`}>
          {children}
          {}
        </div>
        {renderTipsInfo()}
      </div>
    </div>
  );
});

export default FormItem;
