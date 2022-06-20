import React, { useState } from 'react';
import { fireEvent, render, testExamples } from '@test/utils';
import Drawer from '../index';

// 测试组件代码 Example 快照
testExamples(__dirname);

function DrawerDemo(props) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <>
      <div onClick={handleClick}>Open</div>
      <Drawer
        header={props.header || '这是标题'}
        footer={props.footer}
        visible={visible}
        onClose={handleClose}
        confirmBtn={props.confirmBtn}
        cancelBtn={props.cancelBtn}
        showOverlay={props.notShowOverlay ? false : true}
        mode={props.mode || 'overlay'}
        placement={props.placement || 'right'}
        attach={props.attach}
        destroyOnClose={props.destroyOnClose || false}
        size={props.size || 'small'}
        onCancel={props.onCancel}
      >
        <p>This is a drawer</p>
      </Drawer>
    </>
  );
}

describe('test Drawer', () => {
  test('Drawer render', () => {
    const { container, getByText } = render(<DrawerDemo />);
    expect(container.querySelector('.t-drawer--open')).not.toBeInTheDocument();
    fireEvent.click(getByText('Open'));
    expect(container.querySelector('.t-drawer--open')).toBeInTheDocument();
    expect(container.querySelector('.t-drawer__mask')).toBeInTheDocument();
    expect(container.querySelector('.t-drawer__content-wrapper--right')).toBeInTheDocument();
    expect(container.querySelector('.t-drawer__content-wrapper--top')).not.toBeInTheDocument();
  });
  test('Drawer close', () => {
    const { container, getByText } = render(<DrawerDemo />);
    fireEvent.click(getByText('Open'));
    fireEvent.click(container.querySelector('.t-drawer__close-btn'));
    expect(container.querySelector('.t-drawer--open')).not.toBeInTheDocument();
    expect(container.querySelector('.t-drawer')).toBeInTheDocument();
  });
  test('Drawer mask close', () => {
    const { container, getByText } = render(<DrawerDemo />);
    fireEvent.click(getByText('Open'));
    expect(container.querySelector('.t-drawer--open')).toBeInTheDocument();
    fireEvent.click(container.querySelector('.t-drawer--open').children[0]);
    expect(container.querySelector('.t-drawer--open')).not.toBeInTheDocument();
  });
  test('Drawer placement', () => {
    const { container, getByText } = render(<DrawerDemo placement="top" />);
    fireEvent.click(getByText('Open'));
    expect(container.querySelector('.t-drawer__content-wrapper--right')).not.toBeInTheDocument();
    expect(container.querySelector('.t-drawer__content-wrapper--top')).toBeInTheDocument();
  });
  test('Drawer size', () => {
    const { container, getByText } = render(<DrawerDemo size="50%" />);
    fireEvent.click(getByText('Open'));
    expect(container.querySelector('.t-drawer__content-wrapper--right')).toHaveStyle({ width: '50%' });
  });
  test('Drawer showOverlay', () => {
    const { container, getByText } = render(<DrawerDemo notShowOverlay />);
    fireEvent.click(getByText('Open'));
    expect(container.querySelector('.t-drawer__mask')).not.toBeInTheDocument();
  });
  test('Drawer header and footer', () => {
    const { getByText } = render(<DrawerDemo header={<div>自定义头部</div>} footer={<div>自定义底部</div>} />);
    fireEvent.click(getByText('Open'));
    expect(getByText('自定义头部').parentElement).toHaveClass('t-drawer__header');
    expect(getByText('自定义底部').parentElement).toHaveClass('t-drawer__footer');
  });
  test('Drawer cancelBtn and confirmBtn', () => {
    const { getByText } = render(<DrawerDemo cancelBtn={<div>cancelBtn</div>} confirmBtn={<div>confirmBtn</div>} />);
    fireEvent.click(getByText('Open'));
    expect(getByText('cancelBtn').parentElement.parentElement).toHaveClass('t-drawer__footer');
    expect(getByText('confirmBtn').parentElement.parentElement).toHaveClass('t-drawer__footer');
  });
  test('Drawer mode push', () => {
    const { getByText } = render(<DrawerDemo attach="body" mode="push" />);
    fireEvent.click(getByText('Open'));
    expect(document.body).toHaveStyle({
      margin: '0 0 0 -300px',
    });
  });
  test('Drawer onCancel', () => {
    const onCancelFn = jest.fn();
    const { getByText } = render(<DrawerDemo onCancel={onCancelFn} />);
    fireEvent.click(getByText('Open'));
    expect(onCancelFn).not.toBeCalled();
    fireEvent.click(getByText('取消'));
    expect(onCancelFn).toBeCalled();
  });
});
