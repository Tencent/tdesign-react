import React from 'react';
import isString from 'lodash/isString';
import classNames from 'classnames';
import { TdPrimaryTableProps } from '../type';
import Loading from '../../loading';
import useClassName from './useClassName';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

export default function useAsyncLoading(props: TdPrimaryTableProps) {
  const [local] = useLocaleReceiver('table');
  const { isLoadingClass, isLoadMoreClass, asyncLoadingClass } = useClassName();

  const classes = [
    asyncLoadingClass,
    {
      [isLoadingClass]: props.asyncLoading === 'loading',
      [isLoadMoreClass]: props.asyncLoading === 'load-more',
    },
  ];

  function onLoadClick() {
    if (typeof props.asyncLoading !== 'string') return;
    const status = props.asyncLoading === 'loading' ? 'loading' : 'load-more';
    props.onAsyncLoadingClick?.({ status });
  }

  function renderAsyncLoading() {
    const asyncLoadingNode = props.asyncLoading;
    if (isString(asyncLoadingNode)) {
      const { asyncLoading } = props;
      const loadingText = {
        'load-more': local.loadingMoreText,
        loading: local.loadingText,
      }[String(asyncLoading)];
      return (
        <div className={classNames(classes)} onClick={onLoadClick}>
          {<Loading loading={true} size="small" text={loadingText} indicator={asyncLoading === 'loading'} />}
        </div>
      );
    }
    if (asyncLoadingNode) {
      return (
        <div className={classNames(classes)} onClick={onLoadClick}>
          {asyncLoadingNode}
        </div>
      );
    }
    return null;
  }
  return {
    renderAsyncLoading,
  };
}
