import React, { useEffect, useRef, useState } from 'react';
import { List, Space, Button } from 'tdesign-react';
import type { ListRef } from '../List';

const { ListItem, ListItemMeta } = List;

const imageUrl = 'https://tdesign.gtimg.com/site/avatar.jpg';

const VirtualScroll = () => {
  const [data, setData] = useState([]); // 存储列表数据
  const listRef = useRef<ListRef>(null);
  const handleScroll = () => {
    // scroll 属性需要设置 rowHeight 参数
    listRef.current?.scrollTo({
      // list 不存在嵌套，key 与 index 相同
      index: 30,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const list = [];
    for (let i = 0; i < 3000; i++) {
      list.push({ content: `第${i + 1}个列表内容的描述性文字` });
    }
    setData(list);
  }, []);

  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <List
        ref={listRef}
        style={{ height: '300px' }}
        scroll={{ type: 'virtual', rowHeight: 80, bufferSize: 10, threshold: 10 }}
      >
        {data.map((item, index) => (
          <ListItem key={index}>
            <ListItemMeta image={imageUrl} title="列表标题" description={item.content} />
          </ListItem>
        ))}
      </List>
      <Space>
        <Button onClick={handleScroll}>滚动到指定节点</Button>
      </Space>
    </Space>
  );
};

export default VirtualScroll;
