import React from 'react';

// 兼容特殊数据结构和受控 key
import Tree from '../tree/Tree';
import Cascader from '../cascader/Cascader';
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
initialDataMap.set(Tree, []);
initialDataMap.set(Upload, []);
initialDataMap.set(Transfer, []);
initialDataMap.set(Cascader, []);
initialDataMap.set(TagInput, []);
initialDataMap.set(RangeInput, []);
initialDataMap.set(CheckboxGroup, []);
initialDataMap.set(DateRangePicker, []);
initialDataMap.set(TimeRangePicker, []);

export function getDefaultInitialData(children: React.ReactNode, initialData: any) {
  let defaultInitialData = initialData;
  React.Children.forEach(children, (child) => {
    if (!child) return;
    if (React.isValidElement(child) && typeof initialData === 'undefined') {
      defaultInitialData = initialDataMap.get(child.type);
    }
  });
  return defaultInitialData;
}
