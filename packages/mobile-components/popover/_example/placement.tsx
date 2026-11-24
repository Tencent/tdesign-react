import React from 'react';
import { Popover, Button } from 'tdesign-mobile-react';

export default () => (
  <div>
    <div className="popover-placement-example">
      <div className="popover-placement-example__summary mb-16">顶部弹出气泡</div>
      <div className="popover-placement-example__content row mb-24">
        <div className="popover-placement-example__content__item">
          <Popover
            placement="top-left"
            theme="dark"
            content="弹出气泡内容"
            triggerElement={
              <Button className="button-width--small" theme="primary" variant="outline" size="large">
                顶部左
              </Button>
            }
          />
        </div>
        <div className="popover-placement-example__content__item">
          <Popover
            placement="top"
            theme="dark"
            content="弹出气泡内容"
            triggerElement={
              <Button className="button-width--small" theme="primary" variant="outline" size="large">
                顶部中
              </Button>
            }
          />
        </div>
        <div className="popover-placement-example__content__item">
          <Popover
            placement="top-right"
            theme="dark"
            content="弹出气泡内容"
            triggerElement={
              <Button className="button-width--small" theme="primary" variant="outline" size="large">
                顶部右
              </Button>
            }
          />
        </div>
      </div>
    </div>

    <div className="popover-placement-example">
      <div className="popover-placement-example__summary mb-16">底部弹出气泡</div>
      <div className="popover-placement-example__content row mb-24">
        <div className="popover-placement-example__content__item">
          <Popover
            placement="bottom-left"
            theme="dark"
            content="弹出气泡内容"
            triggerElement={
              <Button className="button-width--small" theme="primary" variant="outline" size="large">
                底部左
              </Button>
            }
          />
        </div>
        <div className="popover-placement-example__content__item">
          <Popover
            placement="bottom"
            theme="dark"
            content="弹出气泡内容"
            triggerElement={
              <Button className="button-width--small" theme="primary" variant="outline" size="large">
                底部中
              </Button>
            }
          />
        </div>
        <div className="popover-placement-example__content__item">
          <Popover
            placement="bottom-right"
            theme="dark"
            content="弹出气泡内容"
            triggerElement={
              <Button className="button-width--small" theme="primary" variant="outline" size="large">
                底部右
              </Button>
            }
          />
        </div>
      </div>
    </div>

    <div className="popover-placement-example">
      <div className="popover-placement-example__summary mb-16">右侧弹出气泡</div>
      <div className="popover-placement-example__content column mb-24">
        <div className="popover-placement-example__content__item">
          <Popover
            placement="right-top"
            theme="dark"
            content="气泡内容"
            triggerElement={
              <Button className="button-with--large" theme="primary" variant="outline" size="large">
                右侧上
              </Button>
            }
          />
        </div>
        <div className="popover-placement-example__content__item">
          <Popover
            placement="right"
            theme="dark"
            content="气泡内容"
            triggerElement={
              <Button className="button-with--large" theme="primary" variant="outline" size="large">
                右侧中
              </Button>
            }
          />
        </div>
        <div className="popover-placement-example__content__item">
          <Popover
            placement="right-bottom"
            theme="dark"
            content="气泡内容"
            triggerElement={
              <Button className="button-with--large" theme="primary" variant="outline" size="large">
                右侧下
              </Button>
            }
          />
        </div>
      </div>
    </div>

    <div className="popover-placement-example">
      <div className="popover-placement-example__summary mb-16">左侧弹出气泡</div>
      <div className="popover-placement-example__content column flex-end mb-24">
        <div className="popover-placement-example__content__item">
          <Popover
            placement="left-top"
            theme="dark"
            content="气泡内容"
            triggerElement={
              <Button className="button-with--large" theme="primary" variant="outline" size="large">
                左侧上
              </Button>
            }
          />
        </div>
        <div className="popover-placement-example__content__item">
          <Popover
            placement="left"
            theme="dark"
            content="气泡内容"
            triggerElement={
              <Button className="button-with--large" theme="primary" variant="outline" size="large">
                左侧中
              </Button>
            }
          />
        </div>
        <div className="popover-placement-example__content__item">
          <Popover
            placement="left-bottom"
            theme="dark"
            content="气泡内容"
            triggerElement={
              <Button className="button-with--large" theme="primary" variant="outline" size="large">
                左侧下
              </Button>
            }
          />
        </div>
      </div>
    </div>
  </div>
);
