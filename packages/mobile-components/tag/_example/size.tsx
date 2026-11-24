import React from 'react';
import { Tag } from 'tdesign-mobile-react';

const SizeDemo = () => (
  <>
    <div className="tag-container">
      <div>
        <div className="tag-block">
          <Tag size="extra-large" variant="light">
            加大尺寸
          </Tag>
          <Tag size="large" variant="light">
            大尺寸
          </Tag>
          <Tag size="medium" variant="light">
            中尺寸
          </Tag>
          <Tag size="small" variant="light">
            小尺寸
          </Tag>
        </div>
        <div className="tag-block tag-block1">
          <Tag size="extra-large" variant="light" closable>
            加大尺寸
          </Tag>
          <Tag size="large" variant="light" closable>
            大尺寸
          </Tag>
          <Tag size="medium" variant="light" closable>
            中尺寸
          </Tag>
          <Tag size="small" variant="light" closable>
            小尺寸
          </Tag>
        </div>
      </div>
    </div>
  </>
);

export default SizeDemo;
