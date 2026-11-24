import React from 'react';
import { Button } from 'tdesign-mobile-react';

export default function () {
  return (
    <>
      <div className="row">
        <Button size="large" disabled theme="primary">
          填充按钮
        </Button>
        <Button size="large" disabled theme="light">
          填充按钮
        </Button>
        <Button size="large" disabled>
          填充按钮
        </Button>
      </div>
      <div className="row">
        <Button size="large" disabled theme="primary" variant="outline">
          描边按钮
        </Button>
        <Button size="large" disabled theme="primary" variant="text">
          文字按钮
        </Button>
      </div>
    </>
  );
}
