import React, { useState, useEffect, useRef } from 'react';
import { Cell, List, PullDownRefresh } from 'tdesign-mobile-react';

export default function ListDemo() {
  const [loading, setLoading] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const listData = useRef<string[]>([]);

  const MAX_DATA_LEN = 60;

  const loadData = (isRefresh) => {
    const ONCE_LOAD_NUM = 20;
    return new Promise(() => {
      setTimeout(() => {
        const temp: string[] = [];
        for (let i = 0; i < ONCE_LOAD_NUM; i++) {
          if (isRefresh) {
            temp.push(`${i + 1}`);
          } else {
            temp.push(`${listData.current.length + 1 + i}`);
          }
        }

        if (isRefresh) {
          listData.current = temp;
        } else {
          listData.current = [...listData.current, ...temp];
        }
        setLoading('');
        setRefreshing(false);
      }, 1000);
    });
  };

  const onLoadData = (isRefresh?) => {
    if ((listData.current.length >= MAX_DATA_LEN && !isRefresh) || loading) {
      return;
    }
    setLoading('loading');
    loadData(isRefresh);
  };

  const onScroll = (scrollBottom) => {
    if (scrollBottom < 50) {
      onLoadData();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    onLoadData(true);
  };

  useEffect(() => {
    onLoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PullDownRefresh value={refreshing} onChange={(val) => setRefreshing(val)} onRefresh={onRefresh}>
      <List asyncLoading={loading} onScroll={onScroll}>
        {listData.current.map((item) => (
          <Cell key={item} align="middle">
            <span className="cell">{item}</span>
          </Cell>
        ))}
      </List>
    </PullDownRefresh>
  );
}
