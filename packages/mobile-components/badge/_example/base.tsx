import React from 'react';
import { Badge, Button } from 'tdesign-mobile-react';
import { NotificationIcon } from 'tdesign-icons-react';

export default function BaseBadge() {
  return (
    <>
      <div className="summary">红点徽标</div>
      <div className="badge-demo">
        <Badge dot className="badge-item" content="消息" />
        <Badge dot offset={[1, -1]} className="badge-item">
          <NotificationIcon size={24} />
        </Badge>
        <Badge dot offset={[1, 1]} className="badge-item">
          <Button>按钮</Button>
        </Badge>
      </div>

      <div className="summary">数字徽标</div>
      <div className="badge-demo">
        <Badge count="8" content="消息" offset={[4, 0]} className="badge-item" />
        <Badge count="2" offset={[2, -2]} className="badge-item">
          <NotificationIcon size={24} />
        </Badge>
        <Badge count="8" offset={[2, 2]} className="badge-item">
          <Button>按钮</Button>
        </Badge>
      </div>

      <div className="summary">自定义徽标</div>
      <div className="badge-demo">
        <Badge count="NEW" offset={[0, 2]}>
          <Button icon={<NotificationIcon size={24} />} shape="square" size="large" />
        </Badge>
      </div>
    </>
  );
}
