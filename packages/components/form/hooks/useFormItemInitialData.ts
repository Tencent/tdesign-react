import React, { useEffect } from 'react';
import { get, has, isEmpty, unset } from 'lodash-es';

import { TD_DEFAULT_VALUE_MAP } from '../const';
import { useFormContext, useFormListContext } from '../FormContext';

import type { FormItemProps } from '../FormItem';
import type { NamePath } from '../type';

export default function useFormItemInitialData(
  name: NamePath,
  fullPath: NamePath,
  initialData: FormItemProps['initialData'],
  children: FormItemProps['children'],
) {
  let hadReadFloatingFormData = false;

  const { form, floatingFormDataRef, initialData: formContextInitialData } = useFormContext();
  const { name: formListName, initialData: formListInitialData } = useFormListContext();

  // 组件渲染后删除对应游离值
  useEffect(() => {
    if (hadReadFloatingFormData) {
      const nameList = formListName ? [formListName, name].flat() : name;
      unset(floatingFormDataRef.current, nameList);
    }
  }, [hadReadFloatingFormData, floatingFormDataRef, formListName, name]);

  const defaultInitialData = getDefaultInitialData(children, initialData);

  // 优先级：floatFormData > store > FormItem.initialData > FormList.initialData > Form.initialData
  function getDefaultInitialData(children: FormItemProps['children'], initialData: FormItemProps['initialData']) {
    if (name && floatingFormDataRef?.current && !isEmpty(floatingFormDataRef.current)) {
      const nameList = formListName ? [formListName, name].flat() : name;
      const defaultInitialData = get(floatingFormDataRef.current, nameList);
      if (typeof defaultInitialData !== 'undefined') {
        // 首次渲染
        hadReadFloatingFormData = true;
        return defaultInitialData;
      }
    }

    const isFormList = formListName && Array.isArray(fullPath);

    if (typeof initialData !== 'undefined') {
      if (isFormList) {
        const storeValue = get(form.store, fullPath);
        if (typeof storeValue !== 'undefined') {
          return storeValue;
        }
      }
      return initialData;
    }

    if (isFormList) {
      const pathPrefix = fullPath.slice(0, -1);
      const pathExisted = has(form.store, pathPrefix);
      if (pathExisted) {
        // 只要路径存在，哪怕值为 undefined 也取 store 里的值
        // 兼容 add() 或者 add({}) 导致的空对象场景
        // https://github.com/Tencent/tdesign-react/issues/2329
        return get(form.store, fullPath);
      }
    }

    if (Array.isArray(name) && formListInitialData?.length) {
      let defaultInitialData;
      const [index, ...relativePath] = name;
      if (formListInitialData[index]) {
        defaultInitialData = get(formListInitialData[index], relativePath);
      }
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
        return isMultiple ? [] : TD_DEFAULT_VALUE_MAP.get(componentName);
      }
    }
  }

  return {
    defaultInitialData,
  };
}
