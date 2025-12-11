import React, { useEffect, useState } from 'react';
import { List } from 'tdesign-react';

import type { ListProps } from 'tdesign-react';

const { ListItem, ListItemMeta } = List;

export default function BasicList() {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);

  const dataSource: any = [];
  const total = 3000;
  const pageSize = 50;
  for (let i = 0; i < total; i++) {
    dataSource.push({
      id: i,
      content: '列表内容列表内容列表内容',
      icon: 'https://tdesign.gtimg.com/list-icon.png',
      title: `列表标题 ${i + 1}`,
    });
  }

  const height = 300;

  const style = {
    height: `${height}px`,
    overflow: 'auto',
  };

  // 模拟请求
  const fetchData = async (pageInfo: { pageNum: number; pageSize: number }) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      setTimeout(() => {
        const { pageNum, pageSize } = pageInfo;
        const newDataSource = dataSource.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        setListData(listData.concat(newDataSource));
        setPageNum(pageNum);
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setListData([]);
    }
  };

  const handleScroll: ListProps['onScroll'] = ({ scrollBottom }) => {
    if (!scrollBottom && listData.length < total) {
      fetchData({ pageNum: pageNum + 1, pageSize });
    }
  };

  useEffect(() => {
    fetchData({ pageNum, pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <List asyncLoading={isLoading ? 'loading' : ''} size="small" style={style} onScroll={handleScroll}>
      {listData.map((item) => (
        <ListItem key={item.id}>
          <ListItemMeta image={item.icon} title={item.title} description={item.content} />
        </ListItem>
      ))}
    </List>
  );
}
