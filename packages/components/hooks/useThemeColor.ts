import { useState } from 'react';
import { THEME_MODE } from '@tdesign/common-js/common';
import { getCurrentPrimaryColor } from '../_util/dom';
import useMutationObservable from './useMutationObserver';

export interface ThemeColor {
  color: string;
  bgColor: string;
}

function useThemeColor(): ThemeColor {
  const [color, setColor] = useState(getCurrentPrimaryColor('--td-text-color-primary'));
  const [bgColor, setBgColor] = useState(getCurrentPrimaryColor('--td-bg-color-specialcomponent'));

  const targetElement = document?.documentElement;
  useMutationObservable(targetElement, (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        if (mutation.attributeName === THEME_MODE) {
          setColor(getCurrentPrimaryColor('--td-text-color-primary'));
          setBgColor(getCurrentPrimaryColor('--td-bg-color-specialcomponent'));
        }
      }
    }
  });

  return { color, bgColor };
}

export default useThemeColor;
