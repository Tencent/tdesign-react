import React from 'react';
import useConfig from '../../_util/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

export default function TableEmptyBody(props) {
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('table');
  const { empty = t(locale.empty) } = props;

  return (
    <div className={`${classPrefix}-table__empty`} style={{ borderBottom: 0 }}>
      {typeof empty === 'function' ? empty() : empty}
    </div>
  );
}
