import React from 'react';
import { Skeleton } from 'tdesign-react';

const style = {
  't-skeleton-demo': {
    width: '100%',
  },
  't-skeleton-demo-list-li': {
    padding: '16px 0',
    display: 'flex',
  },
  't-skeleton-demo-list-avatar': {
    display: 'inline-block',
    height: '56px',
    margin: '6px 16px 6px 0px',
    flexShrink: '0',
  },
  't-skeleton-demo-list-paragraph': {
    display: 'inline-block',
    width: '90%',
  },
  'row-col-content': {
    width: '100%',
    textAlign: 'center',
  },
  'row-col-content__header': {
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  'row-col-content__content': {
    padding: '10px',
    height: '200px',
  },
};

const rowCol = [
  [1, 1, 1].map(() => ({
    type: 'rect',
    content: 'image',
    width: '33%',
    height: '180px',
  })),
  [
    {
      type: 'circle',
      size: '50px',
    },
    {
      type: 'rect',
      margin: '20px 0',
      width: 'calc(100% - 170px)',
      height: '30px',
    },
    {
      type: 'rect',
      marginLeft: '20px',
      width: '80px',
      height: '30px',
      content: '确定',
    },
  ],
  1,
  1,
  { type: 'text', width: '70%', margin: '0 0 16px 0' },
  {
    type: 'rect',
    width: '100%',
    height: '300px',
    content: () => (
      <div className="row-col-content">
        <h3 className="row-col-content__header">标题</h3>
        <div className="row-col-content__content">内容</div>
      </div>
    ),
  },
];

export default function AdvanceSkeleton() {
  return (
    <div style={style['t-skeleton-demo']}>
      <div className="t-skeleton-demo-card">
        <div className="header">组合成网页效果</div>
        <div className="content">
          <Skeleton rowCol={rowCol}></Skeleton>
        </div>
      </div>

      <div className="t-skeleton-demo-card">
        <div className="header">组合成列表效果</div>
        <div className="content">
          <ul style={style['t-skeleton-demo-list']}>
            {new Array(3).fill(0).map((_, index) => (
              <li key={index} style={style['t-skeleton-demo-list-li']}>
                <Skeleton style={style['t-skeleton-demo-list-avatar']} theme={'avatar'}></Skeleton>
                <Skeleton style={style['t-skeleton-demo-list-paragraph']} theme={'paragraph'}></Skeleton>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
