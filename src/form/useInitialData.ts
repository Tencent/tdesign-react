import React from 'react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';

// 兼容特殊数据结构和受控 key
import Tree from '../tree/Tree';
import Upload from '../upload/upload';
import CheckTag from '../tag/CheckTag';
import Checkbox from '../checkbox/Checkbox';
import TagInput from '../tag-input/TagInput';
import RangeInput from '../range-input/RangeInput';
import Transfer from '../transfer/Transfer';
import CheckboxGroup from '../checkbox/CheckboxGroup';
import DateRangePicker from '../date-picker/DateRangePicker';
import TimeRangePicker from '../time-picker/TimeRangePicker';

import { FormItemProps } from './FormItem';
import { TdFormListProps, TdFormProps } from './type';

// FormItem 子组件受控 key
export const ctrlKeyMap = new Map();
ctrlKeyMap.set(Checkbox, 'checked');
ctrlKeyMap.set(CheckTag, 'checked');
ctrlKeyMap.set(Upload, 'files');

// FormItem 默认数据类型
export const initialDataMap = new Map();
[Tree, Upload, Transfer, TagInput, RangeInput, CheckboxGroup, DateRangePicker, TimeRangePicker].forEach((component) => {
  initialDataMap.set(component, []);
});
[Checkbox].forEach((component) => {
  initialDataMap.set(component, false);
});

// 整理初始值 优先级：Form.initialData < FormList.initialData < FormItem.initialData
export function getDefaultInitialData({
  name,
  formListName,
  children,
  initialData,
  FormContextInitialData,
  FormListInitialData,
}: {
  name: FormItemProps['name'];
  formListName: TdFormListProps['name'];
  children: FormItemProps['children'];
  initialData: FormItemProps['initialData'];
  FormContextInitialData: TdFormProps['initialData'];
  FormListInitialData: TdFormListProps['initialData'];
}) {
  let defaultInitialData;
  if (FormContextInitialData) {
    if (typeof name === 'string') defaultInitialData = get(FormContextInitialData, name);
    if (Array.isArray(name)) {
      const nameList = formListName ? [formListName, name].flat() : name;
      defaultInitialData = get(FormContextInitialData, nameList);
    }
  }
  if (FormListInitialData.length) {
    defaultInitialData = get(FormListInitialData, name);
  }
  if (typeof initialData !== 'undefined') defaultInitialData = initialData;

  if (!isFunction(children)) {
    React.Children.forEach(children, (child) => {
      if (child && React.isValidElement(child) && typeof defaultInitialData === 'undefined') {
        // @ts-ignore
        const isMultiple = child?.props?.multiple;
        defaultInitialData = isMultiple ? [] : initialDataMap.get(child.type);
      }
    });
  }

  return defaultInitialData;
}
