import React, { useState, Fragment } from 'react';
import { Collapse, CollapsePanel } from 'tdesign-mobile-react';

export default function () {
  const [values, setValues] = useState([0]);

  const handleChange = (value: number[]) => {
    setValues(value);
  };

  return (
    <Collapse value={values} onChange={handleChange} expandMutex>
      {Array.from({ length: 4 }).map((_, i) => (
        <Fragment key={i}>
          <CollapsePanel value={i} header="折叠面板标题" disabled={i === 3}>
            <div className="content">
              此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容
            </div>
          </CollapsePanel>
        </Fragment>
      ))}
    </Collapse>
  );
}
