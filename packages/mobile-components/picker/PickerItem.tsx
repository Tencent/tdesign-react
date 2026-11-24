import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { get as lodashGet } from 'lodash-es';
import cls from 'classnames';
import { KeysType, StyledProps } from '../common';
import { PickerColumnItem, PickerValue, PickerWheelConfig } from './type';
import { DEFAULT_WHEEL_CONFIG } from './constants';
import Picker from './picker.class';
import { usePrefixClass } from '../hooks/useClass';

export interface PickerItemProps extends StyledProps {
  options?: PickerColumnItem[];
  value?: PickerValue;
  option?: (option: PickerColumnItem, index: number) => React.ReactNode;
  renderLabel?: (item: PickerColumnItem, index: number) => React.ReactNode;
  onPick?: (context: { value: PickerValue; index: number }) => void;
  wheelConfig?: Required<PickerWheelConfig>;
  keys?: KeysType;
}

export interface PickerItemExposeRef {
  setIndex: (index: number) => void;
  setValue: (value: PickerValue) => void;
  setOptions: () => void;
  setUpdateItems: () => void;
}

const PickerItem = forwardRef<PickerItemExposeRef, PickerItemProps>((props, ref) => {
  const { options, value, option, renderLabel, onPick, wheelConfig = DEFAULT_WHEEL_CONFIG, keys } = props;
  const renderOption = option || renderLabel;
  const classPrefix = usePrefixClass();
  const pickerItemClass = usePrefixClass('picker-item');

  const rootRef = useRef<HTMLUListElement>(null);
  const pickerRef = useRef<Picker | null>(null);

  const getIndexByValue = (val: PickerValue) => {
    let defaultIndex = 0;
    if (val !== undefined) {
      defaultIndex = options.findIndex((item) => lodashGet(item, keys?.value ?? 'value') === val);
    }
    return defaultIndex < 0 ? 0 : defaultIndex;
  };

  const updatePickerWithNextTick = (index: number) => {
    if (pickerRef.current) {
      pickerRef.current.updateItems();
      setTimeout(() => {
        pickerRef.current?.updateIndex(index, { isChange: false });
      }, 0);
    }
  };

  const setIndex = (index: number) => {
    updatePickerWithNextTick(index);
  };

  const setValue = (value: PickerValue) => {
    const index = getIndexByValue(value);
    updatePickerWithNextTick(index);
  };

  const setOptions = () => {
    pickerRef.current?.update();
  };

  const setUpdateItems = () => {
    pickerRef.current?.updateItems();
  };

  useImperativeHandle(ref, () => ({
    setIndex,
    setValue,
    setOptions,
    setUpdateItems,
  }));

  const onChange = useCallback(
    (index: number) => {
      const curItem = options[index];
      const changeValue = lodashGet(curItem, keys?.value ?? 'value');
      onPick?.({ value: changeValue, index });
    },
    [options, keys, onPick],
  );

  useEffect(() => {
    if (pickerRef.current) return;
    setTimeout(() => {
      if (rootRef.current) {
        pickerRef.current = new Picker({
          el: rootRef.current,
          defaultIndex: getIndexByValue(value) || 0,
          keys,
          defaultPickerColumns: options,
          onChange,
          wheelConfig,
          prefixCls: classPrefix,
        });
      }
    });

    return () => {
      pickerRef.current?.destroy();
      pickerRef.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pickerRef.current) return;
    pickerRef.current.onChange = onChange;
  }, [onChange]);

  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.updateOptions(options);
      pickerRef.current.updateItems();
    }
  }, [options]);

  const pickerItemCls = (option: PickerColumnItem) =>
    cls([
      `${pickerItemClass}__item`,
      {
        [`${pickerItemClass}__item--disabled`]: lodashGet(option, keys?.disabled ?? 'disabled'),
      },
    ]);

  return (
    <ul ref={rootRef} className={pickerItemClass}>
      {options.map((item, index) => (
        <li key={index} className={pickerItemCls(item)}>
          {renderOption ? renderOption(item, index) : lodashGet(item, keys?.label ?? 'label')}
        </li>
      ))}
    </ul>
  );
});

PickerItem.displayName = 'PickerItem';

export default PickerItem;
