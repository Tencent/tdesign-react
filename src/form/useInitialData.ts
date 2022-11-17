import React from 'react';

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

// 整理初始值 优先级：Form.initialData < FormItem.initialData
export function getDefaultInitialData({ name, formListName, children, initialData, initialDataFromContext }) {
  let defaultInitialData;
  if (initialDataFromContext) {
    if (typeof name === 'string') defaultInitialData = initialDataFromContext[name];
    if (Array.isArray(name)) {
      const nameList = formListName ? [formListName, ...name] : name;

      // 创建唯一临时变量 symbol
      const symbol = Symbol('initialData');
      let fieldValue = null;

      for (let i = 0; i < nameList.length; i++) {
        const item = nameList[i];
        if (Reflect.has(fieldValue || initialDataFromContext, item)) {
          fieldValue = Reflect.get(fieldValue || initialDataFromContext, item);
        } else {
          // 当反射无法获取到值则重置为 symbol
          fieldValue = symbol;
          break;
        }
      }

      // 说明设置了值
      if (fieldValue !== symbol) {
        defaultInitialData = fieldValue;
      }
    }
  }
  if (typeof initialData !== 'undefined') defaultInitialData = initialData;
  React.Children.forEach(children, (child) => {
    if (child && React.isValidElement(child) && typeof defaultInitialData === 'undefined') {
      defaultInitialData = initialDataMap.get(child.type);
    }
  });
  return defaultInitialData;
}
