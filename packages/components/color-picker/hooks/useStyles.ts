import { CSSProperties, useEffect, useState } from 'react';
import type { Color } from '@tdesign/common-js/color-picker/color';

export interface TdColorSliderStyleParams {
  color: Color;
  value: Number;
  maxValue: Number;
  type: 'hue' | 'alpha';
}

const useStyles = (params: TdColorSliderStyleParams, panelRectRef) => {
  const { color, value, maxValue, type } = params;
  const [styles, setStyles] = useState<CSSProperties>({ left: '', color: '' });

  useEffect(() => {
    const { width } = panelRectRef.current;
    if (!width) return;

    const left = Math.round((Number(value) / Number(maxValue)) * 100);

    let thumbColor = '';
    if (type === 'hue') {
      thumbColor = `hsl(${color.hue}, 100%, 50%)`;
    } else if (type === 'alpha') {
      thumbColor = color.rgba;
    }

    setStyles({
      left: `${left}%`,
      color: thumbColor,
    });
    // eslint-disable-next-line
  }, [color.hue, color.rgba, value]);

  return {
    styles,
  };
};

export default useStyles;
