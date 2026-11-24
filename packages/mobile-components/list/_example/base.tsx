import React, { useEffect, useState, useRef } from 'react';
import { Cell, List } from 'tdesign-mobile-react';

interface ListItem {
  id: number;
  content: string;
  icon: string;
  title: string;
}

export default function ListDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 20;
  const stateRef = useRef([]);
  const pageRef = useRef(1);
  const dataSource: ListItem[] = [];
  const total = 100;
  for (let i = 0; i < total; i++) {
    dataSource.push({
      id: i,
      content: '列表内容列表内容列表内容',
      icon: 'https://tdesign.gtimg.com/site/images/list-icon.png',
      title: '列表主内容',
    });
  }

  // 模拟请求
  const fetchData = async (pageInfo) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      setTimeout(() => {
        const { pageNum, pageSize } = pageInfo;
        const newDataSource = dataSource.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        const newListData = stateRef.current.concat(newDataSource);
        pageRef.current = pageNum;
        stateRef.current = newListData;
        setIsLoading(false);
      }, 0);
    } catch {
      stateRef.current = [];
    }
  };

  const onScroll = (scrollBottom) => {
    if (!scrollBottom && stateRef.current.length < total) {
      fetchData({ pageNum: pageRef.current + 1, pageSize });
    }
  };

  useEffect(() => {
    fetchData({ pageNum: pageRef.current, pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <List asyncLoading={isLoading} onScroll={onScroll}>
      {stateRef.current.map((item) => (
        <Cell key={item.id} align="middle">
          <span className="cell">{item.id}</span>
        </Cell>
      ))}
    </List>
  );
}
