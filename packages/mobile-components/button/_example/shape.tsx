import React from 'react';
import { Button } from 'tdesign-mobile-react';
import { AppIcon } from 'tdesign-icons-react';

export default function () {
  return (
    <>
      <div className="row section-shape">
        <Button theme="primary" size="large">
          填充按钮
        </Button>
        <Button theme="primary" size="large" shape="square" aria-label="应用" icon={<AppIcon size={24} />}></Button>
        <Button theme="primary" size="large" shape="round">
          填充按钮
        </Button>
        <Button theme="primary" size="large" shape="circle" aria-label="应用" icon={<AppIcon size={24} />}></Button>
      </div>
      <Button theme="primary" size="large" block className="rectangle-button">
        填充按钮
      </Button>
    </>
  );
}
