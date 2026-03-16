import { useCallback } from 'react';
import useConfig from '../../hooks/useConfig';

export default function usePrefixClass() {
  const { classPrefix } = useConfig();

  return useCallback(
    (...args: (string | undefined | (string | undefined)[])[]) => {
      let className = '';
      args.forEach((item, index) => {
        if (item && index > 0) className = className.concat(' ');
        if (item instanceof Array) {
          const [block, ...rest] = item;
          if (!block) return;
          className = className.concat(classPrefix, '-', block);
          const [element, ...modifiers] = rest;
          if (element) className = className.concat('__', element);
          modifiers.forEach((modifier) => {
            if (modifier) className = className.concat('--', modifier);
          });
        } else if (typeof item === 'string') {
          className = className.concat(classPrefix, '-', item);
        }
      });
      return className;
    },
    [classPrefix],
  );
}
