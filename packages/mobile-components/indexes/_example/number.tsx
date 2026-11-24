import React, { Fragment } from 'react';
import { ArrowLeftIcon } from 'tdesign-icons-react';
import { Indexes, IndexesAnchor, CellGroup, Cell } from 'tdesign-mobile-react';

export default function IndexesDemo({ goHome }) {
  let height = 0;
  try {
    height = window.innerHeight - document.querySelector('.tdesign-demo-topnav').clientHeight;
  } catch {
    //
  }

  const list = new Array(9).fill(null).map((_, group) => ({
    index: group + 1,
    children: new Array(group % 3 === 0 ? 3 : 2).fill(`列表内容`),
  }));
  const indexList = list.map((item) => item.index);

  return (
    <div style={{ position: 'relative', height }}>
      <ArrowLeftIcon
        className="return-indexes"
        onClick={() => {
          goHome();
        }}
      />
      <Indexes indexList={indexList}>
        {list.map((item) => (
          <Fragment key={item.index}>
            <IndexesAnchor index={item.index} />
            <CellGroup>
              {item.children.map((val, index) => (
                <Cell key={index} title={val} />
              ))}
            </CellGroup>
          </Fragment>
        ))}
      </Indexes>
    </div>
  );
}
