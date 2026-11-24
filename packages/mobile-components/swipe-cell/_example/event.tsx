import React, { useRef } from 'react';
import { SwipeCell, Cell, Toast, SwipeCellRef } from 'tdesign-mobile-react';

const DemoBlock = ({ summary, children }: { summary?: string; children?: React.ReactNode }) => (
  <div className="tdesign-mobile-demo-block tdesign-mobile-demo-block_subtitle">
    <div className="tdesign-mobile-demo-block__header">
      <p className="tdesign-mobile-demo-block__summary tdesign-mobile-demo-block_subtitle">{summary}</p>
    </div>
    <div className="tdesign-mobile-demo-block__slot">{children}</div>
  </div>
);

export default function Demo() {
  const ref = useRef<SwipeCellRef>(null);

  const handleSureConfirm = () => {
    Toast.success({
      message: '删除成功',
    });
    ref.current?.close();
  };

  const handleEdit = () =>
    Toast({
      message: '编辑',
    });

  const handleDelete = () => {
    ref.current?.showSure(<div className="sure-delete">确认删除？</div>, handleSureConfirm);
  };

  const renderActions = () => (
    <>
      <div className="btn edit-btn" onClick={handleEdit}>
        编辑
      </div>
      <div className="btn delete-btn" onClick={handleDelete}>
        删除
      </div>
    </>
  );

  return (
    <DemoBlock summary="带二次确认的操作">
      <SwipeCell
        ref={ref}
        right={renderActions}
        left={renderActions}
        content={<Cell title="带二次确认的操作" note="辅助信息" />}
        opened
      />
    </DemoBlock>
  );
}
