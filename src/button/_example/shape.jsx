import React from 'react';
import { Button } from 'tdesign-react';
import { CalendarIcon } from 'tdesign-icons-react';

export default function ButtonExample() {
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Button shape="rectangle" variant="base">
          填充按钮
        </Button>
        <Button shape="square" variant="base">
          <CalendarIcon />
        </Button>
        <Button shape="round" variant="base">
          填充按钮
        </Button>
        <Button shape="circle" variant="base">
          <CalendarIcon />
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button shape="rectangle" variant="outline">
          描边按钮
        </Button>
        <Button shape="square" variant="outline">
          <CalendarIcon />
        </Button>
        <Button shape="round" variant="outline">
          描边按钮
        </Button>
        <Button shape="circle" variant="outline">
          <CalendarIcon />
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button shape="rectangle" variant="dashed">
          虚框按钮
        </Button>
        <Button shape="square" variant="dashed">
          <CalendarIcon />
        </Button>
        <Button shape="round" variant="dashed">
          虚框按钮
        </Button>
        <Button shape="circle" variant="dashed">
          <CalendarIcon />
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button shape="rectangle" variant="text">
          文字按钮
        </Button>
        <Button shape="square" variant="text">
          <CalendarIcon />
        </Button>
        <Button shape="round" variant="text">
          文字按钮
        </Button>
        <Button shape="circle" variant="text">
          <CalendarIcon />
        </Button>
      </div>
    </div>
  );
}
