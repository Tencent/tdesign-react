import React, { useEffect } from 'react';
import { get, isEmpty, unset } from 'lodash-es';

import { useFormContext, useFormListContext } from '../FormContext';
import type { FormItemProps } from '../FormItem';

export const CTRL_KEY_MAP = new Map<string, string>();
CTRL_KEY_MAP.set('Checkbox', 'checked');
CTRL_KEY_MAP.set('CheckTag', 'checked');
CTRL_KEY_MAP.set('Upload', 'files');

const ARRAY_DEFAULT_COMPONENTS = [
  'Tree',
  'Upload',
  'Transfer',
  'TagInput',
  'RangeInput',
  'CheckboxGroup',
  'DateRangePicker',
  'TimeRangePicker',
];
const BOOLEAN_DEFAULT_COMPONENTS = ['Checkbox'];

export const initialDataMap = new Map<string, any>();

ARRAY_DEFAULT_COMPONENTS.forEach((componentName) => {
  initialDataMap.set(componentName, []);
});
BOOLEAN_DEFAULT_COMPONENTS.forEach((componentName) => {
  initialDataMap.set(componentName, false);
});

export default function useFormItemInitialData(name: FormItemProps['name']) {
  let hadReadFloatingFormData = false;

  const { floatingFormDataRef, initialData: formContextInitialData } = useFormContext();

  const { name: formListName, initialData: formListInitialData } = useFormListContext();

  // 组件渲染后删除对应游离值
  useEffect(() => {
    if (hadReadFloatingFormData) {
      const nameList = formListName ? [formListName, name].flat() : name;
      unset(floatingFormDataRef.current, nameList);
    }
  }, [hadReadFloatingFormData, floatingFormDataRef, formListName, name]);

  // 整理初始值 优先级：Form.initialData < FormList.initialData < FormItem.initialData < floatFormData
  function getDefaultInitialData({
    children,
    initialData,
  }: {
    children: FormItemProps['children'];
    initialData: FormItemProps['initialData'];
  }) {
    if (name && floatingFormDataRef?.current && !isEmpty(floatingFormDataRef.current)) {
      const nameList = formListName ? [formListName, name].flat() : name;
      const defaultInitialData = get(floatingFormDataRef.current, nameList);
      if (typeof defaultInitialData !== 'undefined') {
        hadReadFloatingFormData = true;
        return defaultInitialData;
      }
    }

    if (typeof initialData !== 'undefined') {
      return initialData;
    }

    if (name && formListInitialData.length) {
      const defaultInitialData = get(formListInitialData, name);
      if (typeof defaultInitialData !== 'undefined') return defaultInitialData;
    }

    if (name && formContextInitialData) {
      const defaultInitialData = get(formContextInitialData, name);
      if (typeof defaultInitialData !== 'undefined') return defaultInitialData;
    }

    if (typeof children !== 'function') {
      const childList = React.Children.toArray(children);
      const lastChild = childList[childList.length - 1];
      if (lastChild && React.isValidElement(lastChild)) {
        const isMultiple = lastChild?.props?.multiple;
        // @ts-ignore
        const componentName = lastChild.type.displayName;
        return isMultiple ? [] : initialDataMap.get(componentName);
      }
    }
  }

  return {
    getDefaultInitialData,
  };
}
