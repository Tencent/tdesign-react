import React from 'react';
import { Tag } from 'tdesign-mobile-react';

const ClosableDemo = () => {
  const tagRef1 = React.useRef(null);
  const tagRef2 = React.useRef(null);
  const onClickClose = (e) => {
    if (e === 1) {
      tagRef1.current.remove();
    } else {
      tagRef2.current.remove();
    }
  };
  return (
    <>
      <div className="summary">可关闭标签</div>
      <div className="tag-demo">
        <Tag ref={tagRef1} closable variant="light" onClose={() => onClickClose(1)}>
          文字标签
        </Tag>
        <Tag ref={tagRef2} closable variant="outline" onClose={() => onClickClose(2)}>
          文字标签
        </Tag>
      </div>
    </>
  );
};

export default ClosableDemo;
