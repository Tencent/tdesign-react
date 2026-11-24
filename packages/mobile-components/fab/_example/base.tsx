import React from 'react';
import { AddIcon } from 'tdesign-icons-react';
import { Fab } from 'tdesign-mobile-react';

export default function () {
  const onClick = (e) => {
    console.log('click Fab', e);
  };
  return (
    <>
      <Fab icon={<AddIcon size={24} />} onClick={onClick} />
    </>
  );
}
