import React from 'react';
import { Link, NoticeBar } from 'tdesign-mobile-react';
import { CloseIcon } from 'tdesign-icons-react';

export default function Customization() {
  return (
    <NoticeBar
      visible
      content="提示文字描述提示文字描述提示文字描述提示文字描述提示文字描述提示文字描述"
      operation={
        <Link className="custom-link" theme="primary">
          详情
        </Link>
      }
      suffixIcon={<CloseIcon />}
    />
  );
}
