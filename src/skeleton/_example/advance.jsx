import React from 'react';
import { Skeleton } from 'tdesign-react';

const style = {
  't-skeleton-demo': {
    width: '100%',
  },
  't-skeleton-demo-card': {
    margin: '16px',
    border: '1px solid #eee',
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #eee',
  },
  content: {
    padding: '16px',
  },
  't-skeleton-demo-list-li': {
    padding: '16px 0',
  },
  't-skeleton-demo-list-avatar': {
    display: 'inline-block',
    marginRight: '20px',
  },
  't-skeleton-demo-list-paragraph': {
    display: 'inline-block',
    width: '80%',
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
      <div style={style['row-col-content']}>
        <h3 style={style['row-col-content__header']}>标题</h3>
        <div style={style['row-col-content__content']}>内容</div>
      </div>
    ),
  },
];

export default function AdvanceSkeleton() {
  return (
    <div style={style['t-skeleton-demo']}>
      <div style={style['t-skeleton-demo-card']}>
        <div style={style.header}>网页（使用 rowCol）</div>
        <div style={style.content}>
          <Skeleton rowCol={rowCol}></Skeleton>
        </div>
      </div>

      <div style={style['t-skeleton-demo-card']}>
        <div style={style.header}>列表（组合使用）</div>
        <div style={style.content}>
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
