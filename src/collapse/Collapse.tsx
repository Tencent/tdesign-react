import React, { forwardRef, memo, useCallback, useMemo, useRef } from 'react';
import { debounce } from 'lodash-es';
import type { StyledProps } from '../common';
import type { TdCollapseProps, CollapseValue } from './type';
import { collapseDefaultProps } from './defaultProps';
import { CollapseProvider } from './CollapseContext';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import parseTNode from '../_util/parseTNode';
import useDefault from '../_util/useDefault';

export interface CollapseProps extends TdCollapseProps, StyledProps {}

const Collapse = forwardRef<HTMLDivElement, CollapseProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, collapseDefaultProps);
  const collapseClass = usePrefixClass('collapse');

  const {
    defaultValue,
    value,
    onChange,
    disabled,
    expandIcon,
    expandMutex,
    defaultExpandAll,
    theme,
    children,
    className,
    style,
  } = props;

  const [activeValue, setActiveValue] = useDefault<CollapseValue, any[]>(value, defaultValue, onChange);
  const firstNewValRef = useRef<any[] | null>(null);
  const collectedValuesRef = useRef<(string | number)[]>([]);

  const debouncedUpdate = useMemo(
    () =>
      debounce((values: (string | number)[], args: { e: React.MouseEvent<HTMLDivElement> }) => {
        const uniqueValues = [...new Set(values)];
        setActiveValue(uniqueValues);
        onChange?.(uniqueValues, args);
        collectedValuesRef.current = [];
      }, 100),
    [onChange, setActiveValue],
  );

  const onPanelChange = useCallback(
    (panelValue: string | number, args: { e: React.MouseEvent<HTMLDivElement> }, isDefaultExpandAll: boolean) => {
      if (!Array.isArray(activeValue)) {
        return;
      }

      const isPanelActive = activeValue.includes(panelValue);

      if (isPanelActive) {
        const newActiveValues = activeValue.filter((item) => item !== panelValue);
        setActiveValue(newActiveValues);
        onChange?.(newActiveValues, args);
        return;
      }

      if (isDefaultExpandAll && expandMutex) {
        if (firstNewValRef.current === null) {
          firstNewValRef.current = [panelValue];
          setActiveValue([panelValue]);
          onChange?.([panelValue], args);
        }
        return;
      }

      if (isDefaultExpandAll && !expandMutex) {
        if (!collectedValuesRef.current.includes(panelValue)) {
          collectedValuesRef.current.push(panelValue);
        }
        const finalValues = [...activeValue, ...collectedValuesRef.current];
        debouncedUpdate(finalValues, args);
        return;
      }

      const newActiveValues = expandMutex ? [panelValue] : [...activeValue, panelValue];
      setActiveValue(newActiveValues);
      onChange?.(newActiveValues, args);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeValue, onChange, expandMutex, debouncedUpdate],
  );

  const memoProviderValues = useMemo(
    () => ({
      activeValue,
      disabled,
      expandIcon,
      onPanelChange,
      defaultExpandAll,
    }),
    [activeValue, disabled, expandIcon, onPanelChange, defaultExpandAll],
  );

  return (
    <div ref={ref} className={`${collapseClass} ${collapseClass}--${theme} ${className}`} style={style}>
      <CollapseProvider value={memoProviderValues}>{parseTNode(children)}</CollapseProvider>
    </div>
  );
});

Collapse.displayName = 'Collapse';

export default memo(Collapse);
