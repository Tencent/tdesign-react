import React, { useState } from 'react';
import { Attachments, TdAttachmentItem } from 'tdesign-react';
import Space from '../../space/Space';

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
    uid: '6',
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
  const [list, setlist] = useState<TdAttachmentItem[]>(filesList.map((item, index) => ({ ...item, uid: index + 1 })));

  const onRemove = (item) => {
    console.log('remove', item);
    setlist(list.filter((a) => a.uid !== item.detail.uid));
  };

  return (
    <Space style={{ width: '680px' }}>
      <Attachments items={list} overflow="scrollX" onRemove={onRemove}></Attachments>
    </Space>
  );
};

export default ChatAttachmentExample;
