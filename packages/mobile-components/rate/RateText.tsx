import React from 'react';
import cx from 'classnames';

import { usePrefixClass } from '../hooks/useClass';
import { useLocaleReceiver } from '../locale/LocalReceiver';

import type { TdRateProps } from './type';

type Props = {
  texts: TdRateProps['texts'];
  value: number;
};

export const RateText = (props: Props) => {
  const [locale, t] = useLocaleReceiver('rate');

  const textClass = usePrefixClass('rate__text');

  const { value, texts } = props;

  const text = (Array.isArray(texts) ? texts[value - 1] : '') || t(locale.valueText, { value });

  return (
    <span
      className={cx(textClass, {
        [`${textClass}--active`]: value > 0,
      })}
    >
      {value ? text : t(locale.noValueText)}
    </span>
  );
};
