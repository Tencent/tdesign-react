/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { isFunction } from 'lodash-es';

import { TypographyEllipsis } from '../type';
import Tooltip from '../../tooltip';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

export default function useEllipsis(ellipsis: boolean | TypographyEllipsis) {
  const [local, t] = useLocaleReceiver('typography');
  const expandText = t(local.expandText);
  const collapseText = t(local.collapseText);

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
            suffix: ({ expanded }) =>
              typeof ellipsis?.suffix === 'function'
                ? ellipsis?.suffix({ expanded })
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
    let moreOrLess: React.ReactNode;
    if (isFunction(formattedEllipsis.suffix)) moreOrLess = formattedEllipsis.suffix?.({ expanded: !isClamped });
    else moreOrLess = formattedEllipsis.suffix;

    if (formattedEllipsis?.tooltipProps && !!moreOrLess) {
      return <Tooltip {...formattedEllipsis?.tooltipProps}>{moreOrLess}</Tooltip>;
    }
    return moreOrLess;
  };

  const getEllipsisPrefix = () => {
    let moreOrLess: React.ReactNode;
    if (isFunction(formattedEllipsis.suffix)) moreOrLess = formattedEllipsis.suffix?.({ expanded: !isClamped });
    else moreOrLess = formattedEllipsis.suffix;

    if (formattedEllipsis?.tooltipProps && !moreOrLess) {
      return <Tooltip {...formattedEllipsis?.tooltipProps}>...</Tooltip>;
    }
    return '...';
  };

  const ellipsisProps = {
    lines: formattedEllipsis.row,
    ellipsisPrefix: getEllipsisPrefix(),
    more: getEllipsisSuffix(),
    less: getEllipsisSuffix(),
    onToggleExpand: handleExpand,
    expandable: formattedEllipsis.expandable,
    collapsible: formattedEllipsis.collapsible,
  };

  return { ellipsisProps };
}
