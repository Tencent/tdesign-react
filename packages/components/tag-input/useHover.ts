import { useState, MouseEvent } from 'react';
import { TdTagInputProps } from './type';

export interface UseHoverParams {
  readonly: boolean;
  disabled: boolean;
  onMouseenter: (context: { e: MouseEvent<HTMLDivElement> }) => void;
  onMouseleave: (context: { e: MouseEvent<HTMLDivElement> }) => void;
}

export default function useHover(props: TdTagInputProps) {
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
