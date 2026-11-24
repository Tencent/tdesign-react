import React, { Fragment, useState } from 'react';
import { ArrowLeftIcon } from 'tdesign-icons-react';
import { Indexes, IndexesAnchor, CellGroup, Cell } from 'tdesign-mobile-react';

export default function IndexesDemo({ goHome }) {
  let height = 0;
  try {
    height = window.innerHeight - document.querySelector('.tdesign-demo-topnav').clientHeight;
  } catch {
    //
  }
  const children = new Array(5).fill('列表内容');
  const [curIndex, setCurIndex] = useState<number | string>('');
  const list = [
    {
      index: 0,
      children,
    },
    {
      index: 3,
      children,
    },
    {
      index: 4,
      children,
    },
    {
      index: 7,
      children,
    },
    {
      index: 8,
      children,
    },
    {
      index: 10,
      children,
    },
    {
      index: '#',
      children,
    },
  ];
  const indexList = list.map((item) => item.index);

  const change = (index: string) => {
    setCurIndex(index);
    console.log('change: ', index);
  };
  const select = (index: string) => {
    console.log(index);
  };
  return (
    <div style={{ position: 'relative', height }}>
      <ArrowLeftIcon
        className="return-indexes"
        onClick={() => {
          goHome();
        }}
      />
      <Indexes showFullIndex indexList={indexList} onChange={change} onSelect={select}>
        {list.map((item) => (
          <Fragment key={item.index}>
            <IndexesAnchor index={item.index}>
              <div className={`capsule ${item.index === curIndex ? 'capsule--active' : ''}`}>{item.index}</div>
            </IndexesAnchor>
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
