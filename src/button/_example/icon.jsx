import React from 'react';
import { Button, SearchIcon } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <>
      <Button icon={<SearchIcon />}>line</Button>
      <Button variant="outline" icon={<SearchIcon />}>
        primary
      </Button>
      <Button icon={<SearchIcon />} />
    </>
  );
}
