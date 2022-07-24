import { useMemo } from 'react';
import log from '../_common/js/log';

const DefaultAlign = {
  vertical: ['left', 'right'],
  horizontal: ['top', 'bottom'],
};

export const useAlign = (align = 'left', layout = 'vertical') =>
  useMemo(() => {
    let renderAlign = 'left';
    if (layout === 'vertical') {
      const index = DefaultAlign.horizontal.indexOf(align);
      const isError = index !== -1;
      isError && log.warn('Timeline', 'If layout is vertical, align should be "left","alternate" or "right" ');
      renderAlign = isError ? DefaultAlign.vertical[index] : align;
    } else {
      const index = DefaultAlign.vertical.indexOf(align);
      const isError = index !== -1;
      isError && log.warn('Timeline', 'If layout is horizontal, align should be "top","alternate" or "bottom" ');
      renderAlign = isError ? DefaultAlign.horizontal[index] : align;
    }
    return renderAlign;
  }, [align, layout]);
