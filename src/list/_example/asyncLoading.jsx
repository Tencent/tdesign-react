import React, { useState } from 'react';
import { List, Radio } from 'tdesign-react';

const { ListItem } = List;

export default function BasicList() {

  const [asyncLoading, setAsyncLoading] = useState('');

  const listData = [
    { id: 1, content: '列表内容列表内容列表内容' },
    { id: 2, content: '列表内容列表内容列表内容' },
    { id: 3, content: '列表内容列表内容列表内容' },
    { id: 4, content: '列表内容列表内容列表内容' },
  ];
  const handleAsyncLoading = (val) => {
    if (val === 'loading-custom') {
      setAsyncLoading(<div style={{ textAlign: 'center', marginTop: 12, }}> 没有更多数据了 </div>);
    } else {
      setAsyncLoading(val);
    }
  };

  const onLoadMore = (e) => {
    console.log(e);
    handleAsyncLoading('loading')
  }

  return (
    <>
      <Radio.Group size='large' onChange={(value) => handleAsyncLoading(value)}>
        <Radio.Button value='load-more'>加载更多</Radio.Button>
        <Radio.Button value='loading'>加载中</Radio.Button>
        <Radio.Button value='loading-custom'>自定义加载更多</Radio.Button>
        <Radio.Button value=''>加载完成</Radio.Button>
      </Radio.Group>
      <div style={{ marginBottom: '16px' }}></div>
      <List asyncLoading={asyncLoading} onLoadMore={({ e }) => onLoadMore(e)}>
        {listData.map((item) => (
          <ListItem key={item.id}>{item.content}</ListItem>
        ))}
      </List>
    </>
  );
}
