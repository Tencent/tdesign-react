import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import parseTNode from '../_util/parseTNode';
import useDefault from '../_util/useDefault';
import useIsomorphicLayoutEffect from '../hooks/useLayoutEffect';
import { TdSegmentedProps, SegmentedItem } from './type';
import { segmentedDefaultProps } from './defaultProps';
import withNativeProps, { NativeProps } from '../_util/withNativeProps';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';

export interface SegmentedProps extends TdSegmentedProps, NativeProps {}

const Segmented: React.FC<SegmentedProps> = (originProps) => {
  const props = useDefaultProps<SegmentedProps>(originProps, segmentedDefaultProps);
  const { block, disabled, options, value, defaultValue, onChange } = props;

  const segmentedClass = usePrefixClass('segmented');

  const [innerValue, setInnerValue] = useDefault(value, defaultValue, undefined);
  const [thumbStyle, setThumbStyle] = useState<React.CSSProperties>({});

  const groupRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const segmentItems: SegmentedItem[] = useMemo(() => {
    if (!options?.length) return [];
    return (options as (string | number | SegmentedItem)[]).map((option) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return { value: option, label: String(option) };
      }
      return { ...option, label: option.label ?? String(option.value) };
    });
  }, [options]);

  const activeIndex = useMemo(() => {
    if (innerValue == null) return -1;
    return segmentItems.findIndex((item) => item.value === innerValue);
  }, [innerValue, segmentItems]);

  const updateThumb = useCallback(() => {
    if (activeIndex < 0) {
      setThumbStyle({});
      return;
    }
    const groupEl = groupRef.current;
    const itemEl = itemRefs.current[activeIndex];
    if (!groupEl || !itemEl) return;

    const groupRect = groupEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    setThumbStyle({
      width: `${itemRect.width}px`,
      transform: `translateX(${itemRect.left - groupRect.left}px)`,
    });
  }, [activeIndex]);

  useIsomorphicLayoutEffect(() => {
    updateThumb();
  }, [updateThumb]);

  useEffect(() => {
    const groupEl = groupRef.current;
    if (!groupEl || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => updateThumb());
    ro.observe(groupEl);
    return () => ro.disconnect();
  }, [updateThumb]);

  const handleSelect = useCallback(
    (index: number) => {
      const item = segmentItems[index];
      if (disabled || !item || item.disabled) return;
      if (index === activeIndex) return;
      setInnerValue(item.value);
      onChange?.({ value: item.value, selectedOption: item });
    },
    [segmentItems, disabled, activeIndex, setInnerValue, onChange],
  );

  return withNativeProps(
    props,
    <div className={classNames(segmentedClass, { [`${segmentedClass}--block`]: block })}>
      <div className={`${segmentedClass}__group`} ref={groupRef}>
        <div className={`${segmentedClass}__thumb`} style={thumbStyle} />

        {segmentItems.map((item, index) => (
          <div
            key={item.value}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={classNames(`${segmentedClass}__item`, `${segmentedClass}-item-${index}`, {
              [`${segmentedClass}__item--active`]: index === activeIndex,
              [`${segmentedClass}__item--disabled`]: disabled || item.disabled,
            })}
            onClick={() => handleSelect(index)}
          >
            <div className={`${segmentedClass}__item-inner`}>
              {item.icon && <span className={`${segmentedClass}__item-icon`}>{parseTNode(item.icon)}</span>}
              {item.label && <span className={`${segmentedClass}__item-label`}>{parseTNode(item.label)}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>,
  );
};

Segmented.displayName = 'Segmented';

export default Segmented;
