import React from 'react';
import { Rate, Space } from 'tdesign-react';
import { StarIcon, LogoGithubIcon, HeartFilledIcon } from 'tdesign-icons-react';

export default function BasicRate() {
  return (
    <Space direction="vertical">
      <Rate defaultValue={1} icon={<StarIcon />} />
      <Rate defaultValue={2} icon={<LogoGithubIcon />} />
      <Rate defaultValue={2.5} allowHalf icon={<HeartFilledIcon />} color={'var(--td-error-color-7)'} />
    </Space>
  )
}
