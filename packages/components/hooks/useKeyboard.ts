import { useCallback, useEffect, useState } from 'react';

interface OptionGroup<T> {
  group?: string;
  children?: T[];
}

interface KeyboardProps<T> {
  options: (T | OptionGroup<T>)[];
  initialIndex: number;
  onSelect: (option: T, e: React.KeyboardEvent) => void;
  showPopup?: boolean;
}

const isOptionGroup = <T>(option: T | OptionGroup<T>): option is OptionGroup<T> =>
  option && typeof option === 'object' && 'group' in option && 'children' in option;

const flattenOptions = <T>(options: (T | OptionGroup<T>)[]): T[] => {
  const flattened: T[] = [];
  options.forEach((option) => {
    if (isOptionGroup(option)) {
      if (option.children) {
        flattened.push(...option.children);
      }
    } else {
      flattened.push(option);
    }
  });
  return flattened;
};

const useKeyboard = <T>({ options, initialIndex, onSelect, showPopup }: KeyboardProps<T>) => {
  const [hoverIndex, setHoverIndex] = useState(initialIndex);

  const flatOptions = flattenOptions(options);

  useEffect(() => {
    console.log('useKeyboard effect:', {
      initialIndex,
      showPopup,
      optionsLength: flatOptions.length,
    });
    setHoverIndex(initialIndex);
  }, [flatOptions.length, initialIndex, showPopup]);

  const findNextEnabledIndex = useCallback(
    (startIndex: number, direction: 1 | -1) => {
      if (!flatOptions || flatOptions.length === 0) return -1;
      const len = flatOptions.length;
      let i = startIndex;
      for (let step = 0; step < len; step += 1) {
        i = direction === 1 ? (i + 1) % len : (i - 1 + len) % len;
        const opt = flatOptions[i];
        // @ts-ignore
        if (!opt?.disabled) return i;
      }
      return startIndex;
    },
    [flatOptions],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (flatOptions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHoverIndex((prev) => {
            const start = prev < 0 ? -1 : prev;
            const next = findNextEnabledIndex(start, 1);
            return next === start ? prev : next;
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setHoverIndex((prev) => {
            const start = prev < 0 ? 0 : prev;
            const next = findNextEnabledIndex(start, -1);
            return next === start ? prev : next;
          });
          break;

        case 'Enter':
          e.preventDefault();
          if (hoverIndex >= 0 && hoverIndex < flatOptions.length) {
            const current = flatOptions[hoverIndex];
            onSelect(current, e);
          }
          break;

        default:
          break;
      }
    },
    [flatOptions, hoverIndex, onSelect, findNextEnabledIndex],
  );

  return {
    hoverIndex,
    handleKeyDown,
  };
};

export default useKeyboard;
