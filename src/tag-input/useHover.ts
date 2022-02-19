import { useState } from 'react';

export interface UseHoverParams {
  readonly: boolean;
  disabled: boolean;
  onMouseenter: (context: { e: MouseEvent }) => void;
  onMouseleave: (context: { e: MouseEvent }) => void;
}

export default function useHover(props: UseHoverParams) {
  const { readonly, disabled, onMouseenter, onMouseleave } = props;
  const [isHover, setIsHover] = useState<boolean>(false);

  const addHover = (context: Parameters<UseHoverParams['onMouseenter']>[0]) => {
    if (readonly || disabled) return;
    setIsHover(true);
    onMouseenter?.(context);
  };

  const cancelHover = (context: Parameters<UseHoverParams['onMouseleave']>[0]) => {
    if (readonly || disabled) return;
    setIsHover(false);
    onMouseleave?.(context);
  };

  return { isHover, addHover, cancelHover };
}
