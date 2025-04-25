import React, { useState } from 'react';
import { Filecard } from '..';
import Space from '../../space/Space';
import { TdAttachmentItem } from '@tencent/tdesign-chatbot/lib/filecard';

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
    name: 'pdf-file.pdf',
    size: 444444,
    extension: '.docx',
    description: 'Custom extension',
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

export default function Cards() {
  return (
    <Space breakLine>
      {filesList.map((file, index) => (
        <Filecard key={index} item={file} onRemove={(e) => console.log('remove', e.detail)}></Filecard>
      ))}
    </Space>
  );
}
