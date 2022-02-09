import { useState } from 'react';
import { TdTagInputProps } from './type';

export default function useHover(props: TdTagInputProps) {
  const { readonly, disabled, onMouseenter, onMouseleave } = props;
  const [isHover, setIsHover] = useState<boolean>(false);

  const addHover = (context: Parameters<TdTagInputProps['onMouseenter']>[0]) => {
    if (readonly || disabled) return;
    setIsHover(true);
    onMouseenter?.(context);
  };

  const cancelHover = (context: Parameters<TdTagInputProps['onMouseleave']>[0]) => {
    if (readonly || disabled) return;
    setIsHover(false);
    onMouseleave?.(context);
  };

  return { isHover, addHover, cancelHover };
}
