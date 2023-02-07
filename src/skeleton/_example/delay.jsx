import React, { useRef, useState } from 'react';
import { Skeleton, Switch } from 'tdesign-react';

const style = {
  'mb-20': {
    marginBottom: '20px',
  },
  't-skeleton-demo-paragraph': {
    lineHeight: '25px',
  },
};

const CONTENT = <div style={style['t-skeleton-demo-paragraph']}>
  <p>设置最短延迟响应时间，低于响应时间的操作不显示加载状态。</p>
</div>;

export default function BasicSkeleton() {
  const [checked, setChecked] = useState(true);
  const [content, setContent] = useState(null);
  const loadingTimeChecked = useRef(0);
  const loadingTimeUnChecked = useRef(0);

  const onChange = (value) => {
    console.log('checked：', value, '勾选：', loadingTimeChecked.current, '取消勾选：', loadingTimeUnChecked.current);
    setChecked(value);
    setContent(value ? null : CONTENT);
  };

  return (
    <div>
      <div>
        <Switch style={style['mb-20']} value={checked} onChange={onChange}></Switch>
      </div>
      <div>
        <Skeleton loading={checked} delay={1500} animation="flashed">
          {content}
        </Skeleton>
      </div>
    </div>
  );
}
