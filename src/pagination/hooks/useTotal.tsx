import React from 'react';
import useConfig from '../../_util/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

export default function useTotal(props) {
  const [locale, t] = useLocaleReceiver('pagination');

  const { classPrefix } = useConfig();
  const name = `${classPrefix}-pagination`;

  const { totalContent, pageSize, current, total } = props;

  // 渲染total相关逻辑
  const renderTotalContent = () => {
    if (typeof totalContent === 'boolean') {
      return totalContent ? t(locale.total, { total }) : null;
    }
    if (typeof totalContent === 'string') return totalContent;
    if (typeof totalContent === 'function') {
      const start = (current - 1) * pageSize;
      const end = Math.min(total, start + pageSize);
      return totalContent(total, [start + 1, end]);
    }
  };

  const totalContrl = totalContent && <div className={`${name}__total`}>{renderTotalContent()}</div>;

  return { totalContrl };
}
