import React, { useState } from 'react';
import { ChatAttachments, TdAttachmentItem } from '@tdesign-react/aigc';
import { Space } from 'tdesign-react';

const filesList: TdAttachmentItem[] = [
  {
    name: 'excel-file.xlsx',
    size: 111111,
  },
  {
    name: 'word-file.docx',
    size: 222222,
  },
  {
    name: 'image-file.png',
    size: 333333,
    url: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  {
    name: 'pdf-file.pdf',
    size: 444444,
  },
  {
    name: 'ppt-file.pptx',
    size: 555555,
  },
  {
    name: 'video-file.mp4',
    size: 666666,
  },
  {
    name: 'audio-file.mp3',
    size: 777777,
  },
  {
    name: 'zip-file.zip',
    size: 888888,
  },
  {
    name: 'markdown-file.md',
    size: 999999,
    description: 'Custom description',
  },
  {
    name: 'word-markdown-file.doc',
    size: 99899,
    status: 'progress',
    percent: 50,
  },
];

const ChatAttachmentExample = () => {
  const [list, setlist] = useState<TdAttachmentItem[]>(filesList);

  const onRemove = (item) => {
    console.log('remove', item);
    setlist(list.filter((a) => a.name !== item.detail.name));
  };

  return (
    <Space style={{ width: '680px' }}>
      <ChatAttachments items={list} overflow="scrollX" onRemove={onRemove} imageViewer={true}></ChatAttachments>
    </Space>
  );
};

export default ChatAttachmentExample;
