import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Button theme="default" variant="base">填充按钮</Button>
        <Button theme="default" variant="outline">描边按钮</Button>
        <Button theme="default" variant="dashed">虚框按钮</Button>
        <Button theme="default" variant="text">文字按钮</Button>
        <Button loading theme="default">加载中</Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button theme="primary" variant="base">
          填充按钮
        </Button>
        <Button theme="primary" variant="outline">
          描边按钮
        </Button>
        <Button theme="primary" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="primary" variant="text">
          文字按钮
        </Button>
        <Button loading theme="primary">
          加载中
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button theme="success" variant="base">
          填充按钮
        </Button>
        <Button theme="success" variant="outline">
          描边按钮
        </Button>
        <Button theme="success" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="success" variant="text">
          文字按钮
        </Button>
        <Button loading theme="success">
          加载中
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button theme="warning" variant="base">
          填充按钮
        </Button>
        <Button theme="warning" variant="outline">
          描边按钮
        </Button>
        <Button theme="warning" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="warning" variant="text">
          文字按钮
        </Button>
        <Button loading theme="warning">
          加载中
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button theme="danger" variant="base">
          填充按钮
        </Button>
        <Button theme="danger" variant="outline">
          描边按钮
        </Button>
        <Button theme="danger" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="danger" variant="text">
          文字按钮
        </Button>
        <Button loading theme="danger">
          加载中
        </Button>
      </div>
    </div>
  );
}
