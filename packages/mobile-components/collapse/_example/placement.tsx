import React from 'react';
import { Collapse, CollapsePanel } from 'tdesign-mobile-react';

export default function () {
  return (
    <Collapse>
      <CollapsePanel value="0" placement="top" header="折叠面板标题">
        <div className="content">
          此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容可自定义内容
        </div>
      </CollapsePanel>
    </Collapse>
  );
}
