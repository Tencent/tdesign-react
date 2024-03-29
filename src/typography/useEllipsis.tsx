/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';

import { TypographyEllipsis } from './type';
import Tooltip from '../tooltip';
import { useLocaleReceiver } from '../locale/LocalReceiver';

export default function useEllipsis(ellipsis: boolean | TypographyEllipsis) {
  const [local, t] = useLocaleReceiver('typography');
  const expandText = t(local.expand);
  const collapseText = t(local.collapse);

  let formattedEllipsis: TypographyEllipsis = {};
  if (ellipsis) {
    formattedEllipsis =
      ellipsis === true
        ? {
            row: 1,
            expandable: false,
            tooltipProps: null,
            suffix: () => '',
            collapsible: true,
          }
        : {
            row: ellipsis.row || 1,
            expandable: ellipsis.expandable ?? false,
            tooltipProps: ellipsis.tooltipProps || null,
            // eslint-disable-next-line no-nested-ternary
            suffix: (expanded) =>
              typeof ellipsis?.suffix === 'function'
                ? ellipsis?.suffix(expanded)
                : expanded
                ? collapseText
                : ellipsis?.expandable
                ? `${expandText}`
                : '...',
            collapsible: ellipsis?.collapsible ?? false,
          };
  }

  const [isClamped, setIsClamped] = useState(true);
  const handleExpand = (expanded: boolean) => {
    if (typeof expanded !== 'boolean') return;
    setIsClamped(!expanded);
    (ellipsis as TypographyEllipsis).onExpand?.(!expanded);
  };

  const getEllipsisSuffix = () => {
    if (formattedEllipsis?.tooltipProps) {
      return <Tooltip {...formattedEllipsis?.tooltipProps}>{formattedEllipsis.suffix?.(!isClamped)}</Tooltip>;
    }
    return formattedEllipsis.suffix?.(!isClamped);
  };

  const ellipsisProps = {
    lines: formattedEllipsis.row,
    more: getEllipsisSuffix(),
    less: getEllipsisSuffix(),
    onToggleExpand: handleExpand,
    expandable: formattedEllipsis.expandable,
    collapsible: formattedEllipsis.collapsible,
  };

  return { ellipsisProps };
}
