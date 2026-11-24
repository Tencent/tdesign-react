import React, { useState, Fragment } from 'react';
import { Collapse, CollapsePanel } from 'tdesign-mobile-react';

export default function () {
  const [values, setValues] = useState([0]);

  const handleChange = (value: number[]) => {
    setValues(value);
  };

  return (
    <Collapse theme="card" value={values} onChange={handleChange}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Fragment key={i}>
          <CollapsePanel value={i} header="折叠面板标题">
            <div className="content">
              此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容此处可自定义内容
            </div>
          </CollapsePanel>
        </Fragment>
      ))}
    </Collapse>
  );
}
