import { CSSProperties, useEffect, useState } from 'react';
import type { Color } from '@tdesign/common-js/color-picker/color';

export interface TdColorSliderStyleParams {
  color: Color;
  value: Number;
  maxValue: Number;
}

const useStyles = (params: TdColorSliderStyleParams, panelRectRef) => {
  const { color, value, maxValue } = params;
  const [styles, setStyles] = useState<CSSProperties>({ left: '', color: '' });

  useEffect(() => {
    const { width } = panelRectRef.current;
    if (!width) {
      return;
    }
    const left = Math.round((Number(value) / Number(maxValue)) * 100);
    setStyles({
      left: `${left}%`,
      color: color.rgb,
    });
    // eslint-disable-next-line
  }, [color.rgb, value]);

  return {
    styles,
  };
};

export default useStyles;
