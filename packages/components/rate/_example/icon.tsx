import React from 'react';
import { HeartFilledIcon, LogoGithubIcon, StarIcon } from 'tdesign-icons-react';
import { Rate, Space } from 'tdesign-react';

export default function BasicRate() {
  return (
    <Space direction="vertical">
      <Rate defaultValue={1} icon={<StarIcon />} />
      <Rate defaultValue={2} icon={<LogoGithubIcon />} />
      <Rate defaultValue={2.5} allowHalf icon={<HeartFilledIcon />} color={'var(--td-error-color-7)'} />
    </Space>
  );
}
