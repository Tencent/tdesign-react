import React, { useState, useRef, useEffect } from 'react';
import { Cell, List, Loading } from 'tdesign-mobile-react';

export default function ListDemo() {
  const listError = useRef<string[]>([]);
  const [loading, setLoading] = useState('');
  const [showError, setShowError] = useState(false);

  const onLoadError = () => {
    setLoading('loading');

    setTimeout(() => {
      const newVal: string[] = [...listError.current];
      for (let i = listError.current.length; i < 8; i++) {
        newVal.push(`${i}`);
      }
      listError.current = newVal;

      setShowError(true);
      setLoading('');
    }, 1000);
  };

  const onLoadMore = () => {
    setShowError(false);
    if (listError.current.length >= 60 || loading) {
      return;
    }
    setLoading('loading');

    setTimeout(() => {
      for (let i = 0; i < 15; i++) {
        listError.current.push(`${listError.current.length + 1}`);
      }
      setLoading('');
    }, 1000);
  };

  useEffect(() => {
    onLoadError();
  }, []);

  return (
    <List
      asyncLoading={loading}
      onScroll={onLoadMore}
      footer={
        showError && (
          <Loading indicator={false}>
            <div className="custom-error">
              请求失败，点击重新<span onClick={onLoadMore}>加载</span>
            </div>
          </Loading>
        )
      }
    >
      {listError.current.map((item) => (
        <Cell key={item} align="middle">
          <span className="cell">{item}</span>
        </Cell>
      ))}
    </List>
  );
}
