import React from 'react';
import { Avatar } from 'tdesign-mobile-react';
import { UserIcon } from 'tdesign-icons-react';

export default function SizeAvatar() {
  return (
    <div className="tdesign-demo-avatar">
      <div className="avatar-demo">
        <Avatar
          className="avatar-example--large"
          shape="circle"
          size="large"
          image="https://tdesign.gtimg.com/mobile/demos/avatar1.png"
          alt="实例图片"
        />
        <Avatar className="avatar-example--large external-class-content" shape="circle" size="large">
          A
        </Avatar>
        <Avatar className="avatar-example--large" shape="circle" size="large" icon={<UserIcon />} />
      </div>
      <div className="avatar-demo">
        <Avatar
          className="avatar-example--medium"
          shape="circle"
          size="medium"
          image="https://tdesign.gtimg.com/mobile/demos/avatar1.png"
          alt="实例图片"
        />
        <Avatar className="avatar-example--medium external-class-content" shape="circle" size="medium">
          A
        </Avatar>
        <Avatar className="avatar-example--medium" shape="circle" size="medium" icon={<UserIcon />} />
      </div>
      <div className="avatar-demo">
        <Avatar
          className="avatar-example--small"
          shape="circle"
          size="small"
          image="https://tdesign.gtimg.com/mobile/demos/avatar1.png"
          alt="实例图片"
        />
        <Avatar className="avatar-example--small external-class-content" shape="circle" size="small">
          A
        </Avatar>
        <Avatar className="avatar-example--small" shape="circle" size="small" icon={<UserIcon />} />
      </div>
    </div>
  );
}
