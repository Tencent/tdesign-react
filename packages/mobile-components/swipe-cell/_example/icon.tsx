import React from 'react';
import { SwipeCell, Cell, Toast } from 'tdesign-mobile-react';
import { EditIcon, DeleteIcon } from 'tdesign-icons-react';

// 站点 DemoBlock 的等价实现，避免通过相对路径引用 site 组件
const DemoBlock = ({
  summary,
  style,
  children,
}: {
  summary?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => (
  <div className="tdesign-mobile-demo-block tdesign-mobile-demo-block_subtitle" style={style}>
    {summary && (
      <div className="tdesign-mobile-demo-block__header">
        <p className="tdesign-mobile-demo-block__summary tdesign-mobile-demo-block_subtitle">{summary}</p>
      </div>
    )}
    <div className="tdesign-mobile-demo-block__slot">{children}</div>
  </div>
);

export default function Demo() {
  const handleClick = (message = 'click') => {
    Toast({
      message,
    });
  };

  const editIcon = <EditIcon />;
  const delIcon = <DeleteIcon />;

  const handleEdit = () => handleClick('编辑');
  const handleDelete = () => handleClick('删除');

  const right = [
    { text: '编辑', icon: editIcon, className: 'btn edit-btn', onClick: handleEdit },
    { text: '删除', icon: delIcon, className: 'btn delete-btn', onClick: handleDelete },
  ];

  const vertical = right.map((item) => ({
    ...item,
    className: `${item.className} vertical`,
  }));

  const pureIcon = [
    { icon: editIcon, text: '', className: 'btn edit-btn', onClick: handleEdit },
    { icon: delIcon, text: '', className: 'btn delete-btn', onClick: handleDelete },
  ];

  return (
    <>
      <DemoBlock summary="带图标的滑动操作">
        <SwipeCell right={right} content={<Cell title="图标加文字横排" note="辅助信息" />} opened />
      </DemoBlock>
      <DemoBlock style={{ marginTop: '10px' }}>
        <SwipeCell right={pureIcon} content={<Cell title="纯图标" note="辅助信息" />} opened />
      </DemoBlock>
      <DemoBlock style={{ marginTop: '10px' }}>
        <SwipeCell
          right={vertical}
          content={<Cell title="图标加文字竖排" note="辅助信息" description="一段很长很长的内容文字" />}
          opened
        />
      </DemoBlock>
    </>
  );
}
