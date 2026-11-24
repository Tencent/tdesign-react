import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  cloneDeep,
  get as lodashGet,
  isArray,
  isBoolean,
  isEqual,
  isFunction,
  isNumber,
  isObject,
  isString,
  set as lodashSet,
  template as lodashTemplate,
} from 'lodash-es';
import { ChevronRightIcon } from 'tdesign-icons-react';
import { validate } from './formModel';
import { HOOK_MARK } from './hooks/useForm';

import {
  AllValidateResult,
  Data,
  FieldData,
  FormErrorMessage,
  FormInstanceFunctions,
  FormItemValidateMessage,
  FormRule,
  ValidateTriggerType,
  ValueType,
  TdFormItemProps,
  TdFormProps,
} from './type';
import { AnalysisValidateResult, ErrorListType, FormItemInstance, SuccessListType, TD_CTRL_PROP_MAP } from './const';
import { usePrefixClass } from '../hooks/useClass';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { useFormContext } from './FormContext';
import { StyledProps } from '../common';

export interface FormItemProps extends TdFormItemProps, StyledProps {
  children?: React.ReactNode | React.ReactNode[] | ((form: FormInstanceFunctions) => React.ReactElement);
}

export type FormItemValidateResult<T extends Data = Data> = { [key in keyof T]: boolean | AllValidateResult[] };

// FormItem 向子组件注入的受控属性集合
type FormControlInjectableProps = {
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (value: unknown, ...args: unknown[]) => void;
  onBlur?: (value: unknown, ...args: unknown[]) => void;
  [key: string]: unknown;
};

const FormItem = forwardRef<FormItemInstance, FormItemProps>((props, ref) => {
  const [locale, t] = useLocaleReceiver('form');
  const { form: globalFormConfig } = useConfig();
  const formClass = usePrefixClass('form');
  const formItemClass = usePrefixClass('form__item');

  // 状态管理
  const formContext = useFormContext();
  const {
    form,
    colon,
    disabled: disabledFromContext,
    readonly: readonlyFromContext,
    requiredMark: requiredMarkFromContext,
    requiredMarkPosition,
    labelAlign: labelAlignFromContext,
    labelWidth: labelWidthFromContext,
    contentAlign: contentAlignFromContext,
    showErrorMessage: showErrorMessageFromContext,
    resetType: resetTypeFromContext,
    rules: rulesFromContext,
    errorMessage,
    initialData: initialDataFromContext,
    formMapRef,
    floatingFormDataRef,
    onFormItemValueChange,
  } = formContext;

  const {
    arrow = false,
    for: htmlFor = '',
    help,
    initialData,
    label,
    labelAlign = labelAlignFromContext,
    labelWidth = labelWidthFromContext,
    contentAlign = contentAlignFromContext,
    name,
    requiredMark = requiredMarkFromContext,
    rules = [],
    shouldUpdate,
    showErrorMessage,
    className,
    style,
    children,
  } = props;

  // 计算默认初始数据：优先级 floatingFormData > FormItem.initialData > Form.initialData > store 中的值
  const defaultInitialData = useMemo(() => {
    // 先检查 floatingFormData
    if (name && floatingFormDataRef?.current) {
      const floatingValue = lodashGet(floatingFormDataRef.current, name);
      if (typeof floatingValue !== 'undefined') {
        return floatingValue;
      }
    }
    // FormItem 自身的 initialData 优先级最高
    if (typeof initialData !== 'undefined') {
      return initialData;
    }
    // Form 级别的 initialData
    if (name && initialDataFromContext) {
      const contextValue = lodashGet(initialDataFromContext, name);
      if (typeof contextValue !== 'undefined') {
        return contextValue;
      }
    }
    // store 中的已有值
    if (name) {
      return lodashGet(form?.store, name);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [errorList, setErrorList] = useState<ErrorListType[]>([]);
  const [successList, setSuccessList] = useState<SuccessListType[]>([]);
  const [resetValidating, setResetValidating] = useState(false);
  const [needResetField, setNeedResetField] = useState(false);
  const [freeShowErrorMessage, setFreeShowErrorMessage] = useState<boolean | undefined>(undefined);
  const [formValue, setFormValue] = useState(defaultInitialData);
  const [, forceUpdate] = useState({}); // 用于 shouldUpdate 强制渲染

  const formItemRef = useRef<FormItemInstance>(null); // 当前 formItem 实例
  const shouldEmitChangeRef = useRef(false); // onChange 冒泡开关
  const shouldValidate = useRef(false); // 校验开关
  const valueRef = useRef(formValue); // 当前最新值

  const snakeName = useMemo(() => {
    if (name === undefined) return '';
    return Array.isArray(name) ? name.join('.') : String(name);
  }, [name]);

  const shouldShowErrorMessage = useMemo(() => {
    if (isBoolean(freeShowErrorMessage)) return freeShowErrorMessage;
    if (isBoolean(showErrorMessage)) return showErrorMessage;
    return showErrorMessageFromContext;
  }, [freeShowErrorMessage, showErrorMessage, showErrorMessageFromContext]);

  // 计算属性
  const extraNode = useMemo(() => {
    const list = errorList;

    if (shouldShowErrorMessage && list[0]?.message) {
      return list[0].message;
    }
    if (successList.length) {
      return successList[0].message;
    }
    return null;
  }, [errorList, successList, shouldShowErrorMessage]);

  const formItemClasses = useMemo(
    () => [
      formItemClass,
      `${formItemClass}--bordered`,
      `${formClass}--${labelAlign || 'right'}`,
      `${formClass}-item__${name}`,
    ],
    [formItemClass, formClass, labelAlign, name],
  );

  const innerRules = useMemo<FormRule[]>(() => {
    if (rules?.length) return rules;
    if (!name) return [];
    const index = `${name}`.lastIndexOf('.') || -1;
    const pRuleName = `${name}`.slice(index + 1);
    return lodashGet(rulesFromContext, name) || lodashGet(rulesFromContext, pRuleName) || [];
  }, [rules, name, rulesFromContext]);

  const needRequiredMark = useMemo(
    () => requiredMark ?? innerRules.filter((rule) => rule.required).length > 0,
    [requiredMark, innerRules],
  );

  const labelClasses = classNames([
    `${formClass}__label`,
    {
      [`${formClass}__label--required`]: needRequiredMark,
      [`${formClass}__label--required-right`]: needRequiredMark && requiredMarkPosition === 'right',
      [`${formClass}__label--top`]: labelAlign === 'top' || !labelWidth,
      [`${formClass}__label--left`]: labelAlign === 'left' && labelWidth,
      [`${formClass}__label--right`]: labelAlign === 'right' && labelWidth,
    },
  ]);
  const formItemRootClasses = classNames(
    [
      ...formItemClasses,
      `${formItemClass}--bordered`,
      `${formClass}--${labelAlign || 'right'}`,
      `${formClass}-item__${name}`,
    ],
    className,
    { [`${formClass}__item-with-help`]: help },
  );
  const formItemWrapperClasses = classNames([`${formItemClass}-wrap`, `${formItemClass}--${labelAlign}`]);
  const formItemHelperClasses = classNames([`${formItemClass}-help`, `${formClass}__controls--${contentAlign}`]);
  const formItemExtraClasses = classNames([`${formItemClass}-extra`, `${formClass}__controls--${contentAlign}`]);

  const labelStyle = useMemo(() => {
    if (labelWidth && labelAlign !== 'top') {
      return isNumber(labelWidth) ? { width: `${labelWidth}px` } : { width: labelWidth };
    }
    return {};
  }, [labelWidth, labelAlign]);

  const errorClasses = useMemo(() => {
    if (!shouldShowErrorMessage) {
      return '';
    }
    if (!errorList.length) {
      return '';
    }
    const type = errorList[0]?.type || 'error';
    return type === 'error' ? `${formItemClass}--error` : `${formItemClass}--warning`;
  }, [shouldShowErrorMessage, errorList, formItemClass]);

  const contentClasses = classNames([`${formClass}__controls`]);
  const contentSlotClasses = classNames([`${formClass}__controls-content`, `${formClass}__controls--${contentAlign}`]);
  const formItemTipsClasses = classNames([`${formItemClass}-tips`, errorClasses]);

  const contentStyle = useMemo(() => {
    let style = {};
    if (labelWidth && labelAlign !== 'top') {
      if (isNumber(labelWidth)) {
        style = { marginLeft: `${labelWidth}px` };
      } else {
        style = { marginLeft: labelWidth };
      }
    }
    return style;
  }, [labelWidth, labelAlign]);

  const errorMessages = useMemo<FormErrorMessage | undefined>(
    () => errorMessage ?? globalFormConfig?.errorMessage,
    [errorMessage, globalFormConfig],
  );

  // 更新 form 表单字段（对齐桌面端 updateFormValue）
  const updateFormValue = (newVal: unknown, doValidate = true, shouldEmitChange = false) => {
    const { setPrevStore } = form?.getInternalHooks?.(HOOK_MARK) || {};
    setPrevStore?.(form?.getFieldsValue?.(true));
    shouldEmitChangeRef.current = shouldEmitChange;
    shouldValidate.current = doValidate;
    valueRef.current = newVal;
    const fieldValue = name ? lodashGet(form?.store, name) : undefined;
    if (isEqual(fieldValue, newVal)) return;
    if (name && form?.store) {
      lodashSet(form.store, name, newVal);
    }
    setFormValue(newVal);
  };

  // 方法定义
  function resetHandler() {
    setNeedResetField(false);
    setErrorList([]);
    setSuccessList([]);
  }

  function getResetValue(resetType: TdFormProps['resetType']): ValueType {
    if (resetType === 'initial') {
      return defaultInitialData;
    }
    let emptyValue: ValueType;
    if (Array.isArray(formValue)) {
      emptyValue = [];
    } else if (isObject(formValue)) {
      emptyValue = {};
    } else if (isString(formValue)) {
      emptyValue = '';
    }
    return emptyValue;
  }

  function resetField(type?: TdFormProps['resetType']) {
    if (typeof name === 'undefined') return;
    const resetType = type || resetTypeFromContext;
    const resetValue = getResetValue(resetType);
    // reset 不校验
    updateFormValue(resetValue, false);
    if (resetValidating) {
      setNeedResetField(true);
    } else {
      resetHandler();
    }
  }

  async function analysisValidateResult(trigger: ValidateTriggerType): Promise<AnalysisValidateResult> {
    // 校验值取组件自身 state，避免 reset 清空 form.store 后校验拿到 undefined
    const value = formValue;
    const result: AnalysisValidateResult = {
      successList: [],
      errorList: [],
      rules: [],
      resultList: [],
      allowSetValue: false,
    };
    result.rules = trigger === 'all' ? innerRules : innerRules.filter((item) => (item.trigger || 'change') === trigger);
    if (innerRules.length && !result.rules?.length) {
      return result;
    }
    result.allowSetValue = true;
    // 处理自定义校验规则的 context 参数
    const rulesWithContext = result.rules.map((rule) => {
      if (rule.validator) {
        return {
          ...rule,
          validator: (val: ValueType) => {
            const context = { formData: form?.store || {}, name: String(name) };
            return rule.validator!(val, context);
          },
        };
      }
      return rule;
    });
    result.resultList = await validate(value, rulesWithContext);
    result.errorList = result.resultList
      .filter((item) => item.result !== true)
      .map((item) => {
        const newItem = { ...item };
        Object.keys(newItem).forEach((key) => {
          if (!newItem.message && errorMessages?.[key as keyof FormErrorMessage]) {
            const compiled = lodashTemplate(errorMessages[key as keyof FormErrorMessage] as string);
            const labelName = isString(label) ? label : name;
            newItem.message = compiled({
              name: labelName,
              validate: newItem[key as keyof typeof newItem],
            });
          }
        });
        return newItem as ErrorListType;
      });
    // 仅有自定义校验方法才会存在 successList
    result.successList = result.resultList.filter(
      (item) => item.result === true && item.message && item.type === 'success',
    ) as SuccessListType[];
    return result;
  }

  async function validateHandler<T extends Data = Data>(
    trigger: ValidateTriggerType,
    showErrorMsg?: boolean,
  ): Promise<FormItemValidateResult<T>> {
    setResetValidating(true);
    setFreeShowErrorMessage(showErrorMsg);

    const {
      successList: innerSuccessList,
      errorList: innerErrorList,
      resultList,
      allowSetValue,
    } = await analysisValidateResult(trigger);

    if (allowSetValue) {
      setSuccessList(innerSuccessList || []);
      setErrorList(innerErrorList || []);
    }
    // 重置处理
    if (needResetField) {
      resetHandler();
    }
    setResetValidating(false);

    const result = {} as FormItemValidateResult<T>;
    if (name !== undefined) {
      (result as Record<string, boolean | AllValidateResult[]>)[snakeName] =
        innerErrorList?.length === 0 ? true : resultList;
    }
    return result;
  }

  async function validateOnly<T extends Data>(trigger: ValidateTriggerType): Promise<FormItemValidateResult<T>> {
    const { errorList: innerErrorList, resultList } = await analysisValidateResult(trigger);
    const result = {} as FormItemValidateResult<T>;
    if (name !== undefined && innerErrorList) {
      (result as Record<string, boolean | AllValidateResult[]>)[snakeName] =
        innerErrorList.length === 0 ? true : resultList;
    }
    return result;
  }

  function setValidateMessage(validateMessage: FormItemValidateMessage[]) {
    if (!validateMessage && !isArray(validateMessage)) return;
    if (validateMessage.length === 0) {
      setErrorList([]);
    }
    setErrorList(validateMessage.map((item) => ({ ...item, result: false })));
  }

  function getValidateMessage() {
    if (errorList.length === 0) return [];
    return errorList.map((item) => ({
      type: item.type || 'error',
      message: item.message,
    }));
  }

  function setField(field: Omit<FieldData, 'name'>) {
    const { value, status, validateMessage } = field;
    if (typeof value !== 'undefined') {
      // 手动设置 status 则不需要校验，交给用户判断
      updateFormValue(value, typeof status === 'undefined', true);
    }
    if (status) {
      // 可以扩展状态处理逻辑
    }
    if (validateMessage) {
      setValidateMessage([validateMessage as FormItemValidateMessage]);
    }
  }

  // blur 下触发校验
  function handleItemBlur() {
    const filterRules = innerRules.filter((item) => item.trigger === 'blur');
    if (filterRules.length) {
      validateHandler('blur');
    }
  }

  // shouldUpdate: 注册自定义更新回调
  useEffect(() => {
    if (!shouldUpdate || !form) return;

    const { getPrevStore, registerWatch } = form?.getInternalHooks?.(HOOK_MARK) || {};

    const cancelRegister = registerWatch?.(() => {
      const currStore = form?.getFieldsValue?.(true) || {};
      let updateFlag = Boolean(shouldUpdate);
      if (isFunction(shouldUpdate)) updateFlag = shouldUpdate(getPrevStore?.(), currStore);

      if (updateFlag) forceUpdate({});
    });

    return cancelRegister;
  }, [shouldUpdate, form]);

  // 注册到 formMapRef
  useEffect(() => {
    if (typeof name === 'undefined') return;
    if (!formMapRef?.current) return;

    const mapRef = formMapRef.current;

    // 注册实例
    mapRef.set(snakeName, formItemRef);

    // 初始化
    if (typeof defaultInitialData !== 'undefined' && form?.store) {
      lodashSet(form.store, name, defaultInitialData);
    }
    setFormValue(defaultInitialData);

    return () => {
      mapRef.delete(snakeName);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakeName]);

  // 合并后的 formValue 变化 useEffect（对齐桌面端）
  useEffect(() => {
    if (typeof name === 'undefined') return;

    // value 变化通知 watch 事件
    form?.getInternalHooks?.(HOOK_MARK)?.notifyWatch?.(name);

    // 控制是否需要校验
    if (!shouldValidate.current) return;

    if (shouldEmitChangeRef.current) {
      const fieldValue: Record<string, unknown> = {};
      fieldValue[snakeName] = formValue;
      onFormItemValueChange?.(fieldValue);
    }

    const filterRules = innerRules.filter((item) => (item.trigger || 'change') === 'change');
    if (filterRules.length) {
      validateHandler('change');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue, snakeName]);

  // 暴露 ref 实例方法（对齐桌面端）
  const instance: FormItemInstance = {
    name,
    value: formValue,
    initialData,
    getValue: () => cloneDeep(valueRef.current),
    setValue: (newVal: unknown) => updateFormValue(newVal, true, true),
    setField,
    validate: validateHandler,
    validateOnly,
    resetField,
    setValidateMessage,
    getValidateMessage,
    resetValidate: resetHandler,
  };
  useImperativeHandle(ref, (): FormItemInstance => instance);
  useImperativeHandle(formItemRef, (): FormItemInstance => instance);

  // 渲染函数
  const renderRightIconContent = () => {
    if (!arrow) {
      return null;
    }
    return <ChevronRightIcon className={`${formItemClass}-arrow`} />;
  };

  const renderLabelContent = (): React.ReactNode => {
    if (Number(labelWidth) === 0) {
      return '';
    }
    if (isFunction(label)) {
      return label();
    }
    return label;
  };

  const renderHelpNode = () => {
    if (!help) {
      return null;
    }

    return <div className={formItemHelperClasses}>{isFunction(help) ? help() : help}</div>;
  };

  const renderExtraNode = () => {
    if (!extraNode) {
      return null;
    }
    return <div className={formItemExtraClasses}>{extraNode}</div>;
  };

  // 支持函数渲染 children（对齐桌面端）
  if (isFunction(children))
    return (children as (form: FormInstanceFunctions) => React.ReactElement)(form as FormInstanceFunctions);

  const helpNode = renderHelpNode();
  const extraNodeContent = renderExtraNode();

  return (
    <div className={formItemRootClasses} style={style}>
      <div className={`${formItemClass}-main`}>
        <div className={formItemWrapperClasses}>
          <div className={labelClasses} style={labelStyle}>
            <label htmlFor={htmlFor}>{renderLabelContent()}</label>
            {colon && locale?.colonText && t(locale.colonText)}
          </div>
          <div className={contentClasses} style={contentStyle}>
            <div className={contentSlotClasses}>
              {React.Children.map(children, (child) => {
                if (!child) return null;

                // Fragment 或非 React Element 直接返回
                if (!React.isValidElement(child) || child.type === React.Fragment) return child;

                const element = child as React.ReactElement<FormControlInjectableProps>;
                const childProps = element.props;

                // 按子组件 displayName 查表决定受控属性名，默认 value
                const { type: childType } = element;
                const componentName =
                  typeof childType === 'string' ? childType : (childType as { displayName?: string }).displayName;
                const ctrlKey = (componentName && TD_CTRL_PROP_MAP.get(componentName)) || 'value';

                const injectedProps: FormControlInjectableProps = {
                  disabled: disabledFromContext,
                  readOnly: readonlyFromContext,
                  ...childProps,
                  [ctrlKey]: formValue,
                  onChange: (value: unknown, ...args: unknown[]) => {
                    if (readonlyFromContext) return;
                    const newValue = cloneDeep(value);
                    updateFormValue(newValue, true, true);
                    childProps.onChange?.call(null, value, ...args);
                  },
                  onBlur: (value: unknown, ...args: unknown[]) => {
                    handleItemBlur();
                    childProps.onBlur?.call(null, value, ...args);
                  },
                };

                return React.cloneElement(element, injectedProps);
              })}
            </div>
          </div>
        </div>
        {renderRightIconContent()}
      </div>
      {(helpNode || extraNodeContent) && (
        <div className={formItemTipsClasses} style={contentStyle}>
          {helpNode}
          {extraNodeContent}
        </div>
      )}
    </div>
  );
});

FormItem.displayName = 'FormItem';

export default FormItem;
