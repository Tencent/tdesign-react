import React, { useState } from 'react';
import { Popover, Button } from 'tdesign-mobile-react';

export default () => {
  const [visible] = useState(false);

  const handleVisibleChange = (val) => {
    console.log(val);
  };

  return (
    <div>
      <div className="popover-type-example">
        <div className="popover-type-example__summary mb-16">带箭头的弹出气泡</div>
        <div className="popover-type-example__content mb-24">
          <Popover
            placement="top"
            theme="dark"
            content="弹出气泡内容"
            closeOnClickOutside={false}
            triggerElement={
              <Button theme="primary" variant="outline" size="large">
                带箭头
              </Button>
            }
          ></Popover>
        </div>
      </div>

      <div className="popover-type-example">
        <div className="popover-type-example__summary mb-16">不带箭头的弹出气泡</div>
        <div className="popover-type-example__content mb-24">
          <Popover
            defaultVisible={visible}
            placement="top"
            theme="dark"
            showArrow={false}
            content="弹出气泡内容"
            onVisibleChange={handleVisibleChange}
            triggerElement={
              <Button theme="primary" variant="outline" size="large">
                不带箭头
              </Button>
            }
          ></Popover>
        </div>
      </div>

      <div className="popover-type-example">
        <div className="popover-type-example__summary mb-16">自定义内容弹出气泡</div>
        <div className="custom popover-type-example__content mb-24">
          <Popover
            placement="top"
            theme="dark"
            triggerElement={
              <Button theme="primary" variant="outline" size="large">
                自定义内容
              </Button>
            }
            content={
              <div className="custom__list">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="custom__item">
                    选项{i}
                  </div>
                ))}
              </div>
            }
          ></Popover>
        </div>
      </div>
    </div>
  );
};
