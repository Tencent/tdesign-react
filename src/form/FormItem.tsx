import React, { forwardRef, ReactNode, useState, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdFormItemProps, ValueType } from '../_type/components/form';
import { CheckCircleFilledIcon, ClearCircleFilledIcon, ErrorCircleFilledIcon } from '../icon';
import { validate as validateModal } from './formModel';
import { useFormContext } from './FormContext';
import { Result } from './form';

const enum VALIDATE_STATUS {
  TO_BE_VALIDATED = 'not',
  SUCCESS = 'success',
  FAIL = 'fail',
}

const FormItem: React.FC<TdFormItemProps> = forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const { children, label, name, help, statusIcon: statusIconFromProp, rules: rulesFromProp, initialData = '' } = props;
  const {
    colon,
    requiredMark,
    layout,
    labelAlign,
    labelWidth,
    showErrorMessage,
    resetType,
    rules: rulesFromContext,
    statusIcon: statusIconFromContext,
  } = useFormContext();

  const [errorList, setErrorList] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState(VALIDATE_STATUS.TO_BE_VALIDATED);
  const [resetValidating, setResetValidating] = useState(false);
  const [needResetField, setNeedResetField] = useState(false);
  const [formValue, setFormValue] = useState(initialData);

  const formItemClass = classNames(
    `${classPrefix}-form__item`,
    `${classPrefix}-row`,
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
  const errorClasses = () => {
    if (!showErrorMessage) return '';
    if (verifyStatus === VALIDATE_STATUS.SUCCESS) return `${classPrefix}-is-success`;
    if (!errorList.length) return;
    const type = errorList[0].type || 'error';
    return type === 'error' ? `${classPrefix}-is-error` : `${classPrefix}-is-warning`;
  };

  const contentClasses = classNames(`${classPrefix}-form__controls`, `${classPrefix}-col`, errorClasses());

  const renderTipsInfo = () => {
    if (help) {
      return <span className={`${classPrefix}-input__extra`}>{help}</span>;
    }
    if (!showErrorMessage) return;
  };

  const renderSuffixIcon = () => {
    if (React.isValidElement(statusIconFromProp)) {
      return statusIconFromProp;
    }
    if (React.isValidElement(statusIconFromContext)) {
      return statusIconFromContext;
    }
    const getDefaultIcon = () => {
      const iconMap = {
        success: <CheckCircleFilledIcon />,
        error: <ClearCircleFilledIcon />,
        warning: <ErrorCircleFilledIcon />,
      };
      const resultIcon = (iconSlot: ReactNode) => {
        <span className={`${classPrefix}-form__status`}>{iconSlot}</span>;
      };
      if (verifyStatus === VALIDATE_STATUS.SUCCESS) {
        return resultIcon(iconMap[verifyStatus]);
      }
      if (errorList && errorList[0]) {
        const type = errorList[0].type || 'error';
        return resultIcon(iconMap[type]);
      }
      return null;
    };
    if (statusIconFromContext === true) {
      return getDefaultIcon();
    }
    return null;
  };

  const innerRules = (rulesFromContext && rulesFromContext[name]) || rulesFromProp || [];

  function validate(): Promise<Result> {
    setResetValidating(true);
    return new Promise((resolve) => {
      validateModal(formValue, innerRules).then((r) => {
        setErrorList(r);
        const nextVerifyStatus = errorList.length ? VALIDATE_STATUS.FAIL : VALIDATE_STATUS.SUCCESS;
        setVerifyStatus(nextVerifyStatus);
        debugger;
        resolve({ [name]: r.length === 0 ? true : r });
        if (needResetField) {
          resetHandler();
        }
        setResetValidating(false);
      });
    });
  }

  function getEmptyValue(): ValueType {
    const type = Object.prototype.toString.call(initialData);
    let emptyValue: ValueType = '';
    if (type === '[object Array]') {
      emptyValue = [];
    }
    if (type === '[object Object]') {
      emptyValue = {};
    }
    return emptyValue;
  }

  function resetField() {
    if (!name) return;
    if (resetType === 'empty') {
      setFormValue(getEmptyValue());
    }
    if (resetType === 'initial') {
      setFormValue(initialData);
    }

    Promise.resolve(() => {
      if (resetValidating) {
        setNeedResetField(true);
      } else {
        resetHandler();
      }
    });
  }

  function resetHandler() {
    setNeedResetField(false);
    setErrorList([]);
    setVerifyStatus(VALIDATE_STATUS.TO_BE_VALIDATED);
  }

  // 暴露 ref 实例方法
  useImperativeHandle(ref, (): any => ({ formValue, validate, resetField }));

  return (
    <div className={formItemClass} ref={ref}>
      <div className={formItemLabelClass} style={labelProps}>
        <label htmlFor={props?.for}>{label}</label>
      </div>
      <div className={contentClasses}>
        <div className={`${classPrefix}-form__controls--content`}>
          {React.Children.map(children, (child) => {
            let onChangeFromProps = () => ({});
            if (React.isValidElement(child)) {
              if (typeof child.props.onChange === 'function') {
                onChangeFromProps = child.props.onChange;
              }
              return React.cloneElement(child, {
                ...child.props,
                value: formValue,
                onChange: (value) => {
                  onChangeFromProps.call(null, value);
                  setFormValue(value);
                },
              });
            }
            return child;
          })}
          {renderSuffixIcon()}
        </div>
        {renderTipsInfo()}
      </div>
    </div>
  );
});

export default FormItem;
