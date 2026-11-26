import React, { useState } from 'react';
import { Button } from 'tdesign-react';
import type { DialogProps } from 'tdesign-react';
import DialogBody from '../DialogBody';
import DialogPaper from '../DialogPaper';

export default function BasicUsage() {
  const [visibleBody, setVisibleBody] = useState(false);
  const [visiblePaper, setVisiblePaper] = useState(false);
  const handleClickBody = () => {
    setVisibleBody(true);
  };

  const handleClickPaper = () => {
    setVisiblePaper(true);
  };

  const handleClose: DialogProps['onClose'] = () => {
    setVisibleBody(false);
    setVisiblePaper(false);
  };
  return (
    <>
      <Button theme="primary" onClick={handleClickBody}>
        Open Modal body
      </Button>
      <Button theme="primary" onClick={handleClickPaper}>
        Open Modal paper
      </Button>

      <DialogBody header="Basic Modal" visible={visibleBody} confirmOnEnter onClose={handleClose}>
        <p
          style={{
            height: '200vh',
          }}
        >
          This is a dialog
        </p>
      </DialogBody>
      <DialogPaper header="Basic Modal" visible={visiblePaper} confirmOnEnter onClose={handleClose}>
        <p
          style={{
            height: '200vh',
          }}
        >
          This is a dialog
        </p>
      </DialogPaper>
    </>
  );
}
