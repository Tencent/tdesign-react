import React, { useState, useEffect } from 'react';
import { List } from 'tdesign-react';

const { ListItem, ListItemMeta } = List;

export default function BasicList() {
  const [listData,setListData] = useState([]);
  const [isLoading, setIsLoading] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 5;

  const dataSource = [];
  const total = 30;
  for (let i = 0; i < total; i++) {
    dataSource.push({ id: i, content: '列表内容列表内容列表内容', icon: 'https://tdesign.gtimg.com/list-icon.png', title: '列表主内容' });
  }

  const height = 300;

  const style = {
    height: `${height}px`,
    overflow: 'auto',
  };

   // 模拟请求
   const fetchData = async (pageInfo) => {
    if (isLoading) return;
    setIsLoading(true)
    try {
      setTimeout(() => {
        const { pageNum, pageSize } = pageInfo;
        const newDataSource = dataSource.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        setListData(listData.concat(newDataSource));
        setPageNum(pageNum);
        setIsLoading(false)
      }, 300);
    } catch (err) {
      setListData([]);
    }
  }

  const handleScroll = ({ scrollBottom }) => {
    if (!scrollBottom  && listData.length < total) {
      fetchData({ pageNum: pageNum + 1, pageSize });
    }

  };

  useEffect(() => {
    fetchData({ pageNum, pageSize });
  }, []);

  return (
    <List asyncLoading={isLoading ? 'loading': ''} size="small" style={style} onScroll={handleScroll}>
        {
          listData.map(item => <ListItem key={item.id}>
            <ListItemMeta image={item.icon} title={item.title} description={item.content} />
          </ListItem>)
        }
    </List>
  );
}
