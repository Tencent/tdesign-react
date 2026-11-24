import React from 'react';
import { Popover, Button } from 'tdesign-mobile-react';

const PopoverExample = () => (
  <div>
    <div className="popover-theme-example">
      <div className="popover-theme-example__content">
        <Popover
          placement="top"
          theme="dark"
          content="弹出气泡内容"
          triggerElement={
            <Button className="button-width--small" theme="primary" variant="outline" size="large">
              深色
            </Button>
          }
        />
      </div>
      <div className="popover-theme-example__content">
        <Popover
          placement="top"
          theme="light"
          content="弹出气泡内容"
          triggerElement={
            <Button className="button-width--small" theme="primary" variant="outline" size="large">
              浅色
            </Button>
          }
        />
      </div>
      <div className="popover-theme-example__content">
        <Popover
          placement="top"
          theme="brand"
          content="弹出气泡内容"
          triggerElement={
            <Button className="button-width--small" theme="primary" variant="outline" size="large">
              品牌色
            </Button>
          }
        />
      </div>
    </div>

    <div className="popover-theme-example">
      <div className="popover-theme-example__content">
        <Popover
          placement="top"
          theme="success"
          content="弹出气泡内容"
          triggerElement={
            <Button className="button-width--small" theme="primary" variant="outline" size="large">
              成功色
            </Button>
          }
        />
      </div>
      <div className="popover-theme-example__content">
        <Popover
          placement="top"
          theme="warning"
          content="弹出气泡内容"
          triggerElement={
            <Button className="button-width--small" theme="primary" variant="outline" size="large">
              警告色
            </Button>
          }
        />
      </div>
      <div className="popover-theme-example__content">
        <Popover
          placement="top"
          theme="error"
          content="弹出气泡内容"
          triggerElement={
            <Button className="button-width--small" theme="primary" variant="outline" size="large">
              错误色
            </Button>
          }
        />
      </div>
    </div>
  </div>
);

export default PopoverExample;
