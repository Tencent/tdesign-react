import React, { RefObject } from 'react';

export interface SwiperItemReference {
  divRef: RefObject<HTMLDivElement>;
  updateTranslateStyle: (style: string) => void;
  updateClassNameSuffix: (extraClassName: string) => void;
}

interface SwiperContextProps {
  addChild?: (ref: SwiperItemReference) => void;
  removeChild?: (divRef: RefObject<HTMLDivElement>) => void;
  forceContainerHeight?: (height: number | string) => void;
}

const SwiperContext = React.createContext<SwiperContextProps>({});

export default SwiperContext;
