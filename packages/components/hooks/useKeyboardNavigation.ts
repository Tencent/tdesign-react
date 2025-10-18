import { useCallback, useEffect, useState } from 'react';

interface KeyboardNavigationProps {
  options: any[];
  initialIndex: number;
  onSelect: (option: any, e: React.KeyboardEvent) => void;
}

const useKeyboardNavigation = ({ options, initialIndex, onSelect }: KeyboardNavigationProps) => {
  const [hoverIndex, setHoverIndex] = useState(initialIndex);

  useEffect(() => {
    setHoverIndex(initialIndex);
  }, [initialIndex]);

  const findNextEnabledIndex = useCallback(
    (startIndex: number, direction: 1 | -1) => {
      if (!options || options.length === 0) return -1;
      const len = options.length;
      let i = startIndex;
      for (let step = 0; step < len; step += 1) {
        i = direction === 1 ? (i + 1) % len : (i - 1 + len) % len;
        const opt = options[i];
        if (!opt?.disabled) return i;
      }
      return startIndex;
    },
    [options],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (options.length === 0) return;

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
          if (hoverIndex >= 0 && hoverIndex < options.length) {
            const current = options[hoverIndex];
            onSelect(current, e);
          }
          break;

        default:
          break;
      }
    },
    [options, hoverIndex, onSelect, findNextEnabledIndex],
  );

  return {
    hoverIndex,
    handleKeyDown,
  };
};

export default useKeyboardNavigation;
