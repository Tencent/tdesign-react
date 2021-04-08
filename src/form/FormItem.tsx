import React, { forwardRef, ReactNode, useState, useImperativeHandle, useEffect } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdFormItemProps, ValueType } from '../_type/components/form';
import { CheckCircleFilledIcon, ClearCircleFilledIcon, ErrorCircleFilledIcon } from '../icon';
import Checkbox from '../checkbox';
import { CheckTag } from '../tag';
import { validate as validateModal } from './formModel';
import { useFormContext } from './FormContext';

enum VALIDATE_STATUS {
  TO_BE_VALIDATED = 'not',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export interface FormItemProps extends TdFormItemProps {}

const CHECKED_TYPE = [Checkbox, CheckTag];

const FormItem: React.FC<FormItemProps> = forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
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

  const innerRules = (rulesFromContext && rulesFromContext[name]) || rulesFromProp || [];

  const formItemClass = classNames(
    `${classPrefix}-form__item`,
    `${classPrefix}-row`,
    `${classPrefix}-form-item__${name}`,
  );
  const formItemLabelClass = classNames(`${classPrefix}-col`, `${classPrefix}-form__label`, {
    [`${classPrefix}-form__label--required`]:
      requiredMark && innerRules.filter((rule: any) => rule.required).length > 0,
    [`${classPrefix}-form__label--colon`]: colon && label,
    [`${classPrefix}-form__label--top`]: layout === 'inline',
    [`${classPrefix}-form__label--${labelAlign}`]: layout !== 'inline',
    [`${classPrefix}-col-12`]: labelAlign === 'top' && layout !== 'inline',
    [`${classPrefix}-col-1`]: labelAlign !== 'top' && layout !== 'inline',
  });

  const labelProps = labelWidth === undefined ? {} : { minWidth: `${labelWidth}px` };

  const contentClasses = classNames(`${classPrefix}-form__controls`, `${classPrefix}-col`, {
    [`${classPrefix}-is-success`]: showErrorMessage && verifyStatus === VALIDATE_STATUS.SUCCESS,
    [`${classPrefix}-is-warning`]: showErrorMessage && errorList.length && errorList[0].type === 'warning',
    [`${classPrefix}-is-error`]: showErrorMessage && errorList.length && errorList[0].type === 'error',
  });

  const renderTipsInfo = () => {
    if (!showErrorMessage) return null;
    let tipInfo = (errorList.length && errorList[0].message) || '';

    if (help) tipInfo = help;
    return <span className={`${classPrefix}-input__extra`}>{tipInfo}</span>;
  };

  const renderSuffixIcon = () => {
    if (statusIconFromProp === false) return null;

    const resultIcon = (iconSlot: ReactNode) => <span className={`${classPrefix}-form__status`}>{iconSlot}</span>;

    const getDefaultIcon = () => {
      const iconMap = {
        success: <CheckCircleFilledIcon size="25px" />,
        error: <ClearCircleFilledIcon size="25px" />,
        warning: <ErrorCircleFilledIcon size="25px" />,
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

    if (React.isValidElement(statusIconFromProp)) {
      return resultIcon(
        React.cloneElement(statusIconFromProp, { style: { color: 'unset' }, ...statusIconFromProp.props }),
      );
    }
    if (statusIconFromContext === true) {
      return getDefaultIcon();
    }
    if (React.isValidElement(statusIconFromContext)) {
      return resultIcon(statusIconFromProp);
    }

    return null;
  };

  function validate() {
    setResetValidating(true);
    return new Promise((resolve) => {
      validateModal(formValue, innerRules).then((r) => {
        setErrorList(r);
        const nextVerifyStatus = r.length ? VALIDATE_STATUS.FAIL : VALIDATE_STATUS.SUCCESS;
        setVerifyStatus(nextVerifyStatus);
        resolve({ [name]: !r.length ? true : r });
        if (needResetField) {
          resetHandler();
        }
        setResetValidating(false);
      });
    });
  }

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

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

    if (resetValidating) {
      setNeedResetField(true);
    } else {
      resetHandler();
    }
  }

  function resetHandler() {
    setNeedResetField(false);
    setErrorList([]);
    setVerifyStatus(VALIDATE_STATUS.TO_BE_VALIDATED);
  }

  // 暴露 ref 实例方法
  useImperativeHandle(ref, (): any => ({ name, value: formValue, setValue: setFormValue, validate, resetField }));

  return (
    <div className={formItemClass} ref={ref}>
      <div className={formItemLabelClass} style={labelProps}>
        <label htmlFor={props?.for}>{label}</label>
      </div>
      <div className={contentClasses}>
        <div className={`${classPrefix}-form__controls--content`}>
          {React.Children.map(children, (child) => {
            let onChangeFromProps = () => ({});
            let ctrlKey = 'value';
            if (React.isValidElement(child)) {
              if (typeof child.props.onChange === 'function') {
                onChangeFromProps = child.props.onChange;
              }
              if (typeof child.type === 'object') {
                ctrlKey = CHECKED_TYPE.includes(child.type) ? 'checked' : 'value';
              }
              return React.cloneElement(child, {
                ...child.props,
                [ctrlKey]: formValue,
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
