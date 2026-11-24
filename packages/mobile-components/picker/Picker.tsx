import React, { FC, useMemo, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { isBoolean, isString, isFunction, get as lodashGet } from 'lodash-es';
import { KeysType } from '../common';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import parseTNode from '../_util/parseTNode';
import useDefault from '../_util/useDefault';
import { NativeProps } from '../_util/withNativeProps';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { pickerDefaultProps } from './defaultProps';
import { TdPickerProps, PickerColumnItem, PickerValue, PickerColumn, PickerWheelConfig } from './type';
import { DEFAULT_WHEEL_CONFIG } from './constants';

import PickerItem, { type PickerItemExposeRef, type PickerItemProps } from './PickerItem';
import { getPickerColumns } from './utils';
import PickerContext from './picker-context';

export interface PickerProps extends TdPickerProps, NativeProps {
  children?: ReactNode;
}

function getDefaultText(prop: unknown, defaultText: string): string {
  if (isString(prop)) return prop;
  if (isBoolean(prop)) return defaultText;
  return;
}

const getIndexFromColumns = (column: PickerColumn, value: PickerValue, keys?: KeysType) => {
  // 0 和 '' 都是合法选项值，只有 undefined / null 才回退到第一项
  if (value === undefined || value === null) return 0;
  const index = column?.findIndex((item: PickerColumnItem) => lodashGet(item, keys?.value ?? 'value') === value);
  return index > -1 ? index : 0;
};

const Picker: FC<PickerProps> = (props) => {
  const {
    columns,
    onPick,
    keys,
    value,
    defaultValue,
    title,
    header,
    footer,
    onCancel,
    onConfirm,
    onChange,
    cancelBtn,
    confirmBtn,
    option,
    renderLabel,
    swipeDuration,
    wheelConfig,
  } = useDefaultProps(props, pickerDefaultProps);
  const pickerClass = usePrefixClass('picker');

  const [locale, t] = useLocaleReceiver('picker');

  const [pickerValue = [], setPickerValue] = useDefault(value, defaultValue, onChange);
  const confirmButtonText = useMemo(
    () => getDefaultText(confirmBtn, t(locale.confirm) as string),
    [confirmBtn, t, locale.confirm],
  );
  const cancelButtonText = useMemo(
    () => getDefaultText(cancelBtn, t(locale.cancel) as string),
    [cancelBtn, t, locale.cancel],
  );
  const [curValueArray, setCurValueArray] = useState(value?.map((item) => item) ?? []);
  const pickerItemInstanceArray = useRef<PickerItemExposeRef[]>([]);

  const mergedWheelConfig = useMemo(() => {
    const userConfig: Partial<PickerWheelConfig> = wheelConfig || {};
    const merged: Required<PickerWheelConfig> = { ...DEFAULT_WHEEL_CONFIG, ...userConfig };
    if (swipeDuration !== undefined) {
      merged.inertiaDuration = Number(swipeDuration);
    }
    return merged;
  }, [wheelConfig, swipeDuration]);

  const realColumns = useMemo(() => {
    if (isFunction(columns)) {
      const columnsArray = columns(curValueArray);
      return getPickerColumns(columnsArray);
    }
    return getPickerColumns(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, JSON.stringify(curValueArray)]);

  const curIndexArray = useRef(
    realColumns.map((item: PickerColumn, index: number) => getIndexFromColumns(item, pickerValue[index], keys)),
  );

  const setPickerItemRef = (instance: PickerItemExposeRef, idx: number) => {
    pickerItemInstanceArray.current[idx] = instance;
  };

  const handleConfirm = useCallback(
    (e: any) => {
      const target = realColumns.map((item, idx) => item[curIndexArray.current[idx]]);
      const label = target.map((item) => lodashGet(item, keys?.label ?? 'label'));
      const value = target.map((item) => lodashGet(item, keys?.value ?? 'value'));
      setPickerValue(value, e);
      onChange?.(value, { columns: realColumns, e } as any);
      onConfirm?.(value, { index: curIndexArray.current, e, label } as any);
    },
    [realColumns, keys, onChange, onConfirm, setPickerValue],
  );

  const handleCancel = useCallback(
    (e: any) => {
      pickerItemInstanceArray.current.forEach((item, idx) => {
        item?.setIndex(curIndexArray.current[idx]);
      });
      onCancel?.({ e });
    },
    [onCancel, curIndexArray],
  );

  const handlePick = useCallback(
    (context: { value: PickerValue; index: number }, idx: number) => {
      const { index, value: column } = context;
      const newCurValueArray = [...curValueArray];
      newCurValueArray[idx] = lodashGet(realColumns?.[idx][index], keys?.value ?? 'value');

      curIndexArray.current[column] = index;
      setCurValueArray(newCurValueArray);
      onPick?.(newCurValueArray, { index, column: idx });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(curValueArray), realColumns, keys, onPick],
  );

  useEffect(() => {
    setCurValueArray(pickerValue.map((item) => item) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pickerValue)]);

  useEffect(() => {
    realColumns.forEach((col: PickerColumn, idx: number) => {
      const index = col.findIndex((item) => lodashGet(item, keys?.value ?? 'value') === curValueArray[idx]);
      const newIndex = index > -1 ? index : 0;
      curIndexArray.current[idx] = newIndex;
      pickerItemInstanceArray.current[idx]?.setIndex(curIndexArray.current[idx]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realColumns, JSON.stringify(curValueArray), keys]);

  return (
    <PickerContext.Provider value={{ keys, value, onChange }}>
      <div className={pickerClass}>
        <div className={`${pickerClass}__toolbar`}>
          {cancelButtonText ? (
            <div className={`${pickerClass}__cancel`} onClick={handleCancel}>
              {cancelButtonText}
            </div>
          ) : null}

          <div className={`${pickerClass}__title`}>{title}</div>

          {confirmButtonText ? (
            <div className={`${pickerClass}__confirm`} onClick={handleConfirm}>
              {confirmButtonText}
            </div>
          ) : null}
        </div>
        {parseTNode(header)}
        <div className={`${pickerClass}__main`}>
          {realColumns.map((item, idx) => (
            <div key={idx} className={`${pickerClass}-item__group`}>
              <PickerItem
                ref={(instance) => {
                  setPickerItemRef(instance, idx);
                }}
                options={item}
                value={pickerValue[idx]}
                option={option as PickerItemProps['option']}
                renderLabel={renderLabel}
                onPick={(context) => handlePick(context, idx)}
                wheelConfig={mergedWheelConfig}
              />
            </div>
          ))}

          <div className={`${pickerClass}__mask ${pickerClass}__mask--top`} />
          <div className={`${pickerClass}__mask ${pickerClass}__mask--bottom`} />
          <div className={`${pickerClass}__indicator`} />
        </div>
        {parseTNode(footer)}
      </div>
    </PickerContext.Provider>
  );
};

Picker.displayName = 'Picker';

export default Picker;
