import React from 'react';
import isFunction from 'lodash/isFunction';
import Loading from '../../loading';
import useConfig from '../../_util/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

export default function TableEmptyBody(props) {
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('table');
  const { asyncLoading, onAsyncLoadingClick } = props;
  if (!asyncLoading) return null;

  if (asyncLoading === 'loading') {
    return (
      <div
        className={`${classPrefix}-table__async-loading ${classPrefix}-is-loading`}
        onClick={() => {
          onAsyncLoadingClick({ status: 'loading' });
        }}
      >
        <Loading loading={true} size="small"></Loading>
        <span>{t(locale.loadingText)}</span>
      </div>
    );
  }

  if (asyncLoading === 'load-more') {
    return (
      <div
        className={`${classPrefix}-table__async-loading ${classPrefix}-is-load-more`}
        onClick={() => {
          onAsyncLoadingClick({ status: 'load-more' });
        }}
      >
        点击加载更多
      </div>
    );
  }

  let result: React.ReactNode = null;
  if (asyncLoading) result = asyncLoading;
  if (isFunction(asyncLoading)) result = asyncLoading();

  return <>{result}</>;
}
