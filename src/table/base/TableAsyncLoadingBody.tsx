import React from 'react';
import isFunction from 'lodash/isFunction';
import Loading from '../../loading';
import useConfig from '../../_util/useConfig';

export default function TableEmptyBody(props) {
  const { classPrefix } = useConfig();
  const { asyncLoading, onAsyncLoadingClick } = props;
  if (!asyncLoading) return null;

  if (asyncLoading === 'loading') {
    return (
      <div
        className={`${classPrefix}-table--loading-async ${classPrefix}-table--loading-status-loading`}
        onClick={() => {
          onAsyncLoadingClick({ status: 'loading' });
        }}
      >
        <Loading loading={true} size="small"></Loading>
        <span>正在加载中，请稍后</span>
      </div>
    );
  }

  if (asyncLoading === 'load-more') {
    return (
      <div
        className={`${classPrefix}-table--loading-async ${classPrefix}-table--loading-status-load-more`}
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
