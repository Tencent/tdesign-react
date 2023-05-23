import React, { useState } from 'react';
import { fireEvent, render, vi } from '@test/utils';
import Drawer, { DrawerProps } from '../index';

function DrawerDemo(props) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const drawerProps: DrawerProps = {};
  Object.keys(props).forEach((key) => {
    if (props[key] !== undefined) {
      drawerProps[key] = props[key];
    }
  });
  return (
    <>
      <div onClick={handleClick}>Open</div>
      <Drawer visible={visible} onClose={handleClose} showOverlay={!props.notShowOverlay} {...drawerProps}>
        <p>This is a drawer</p>
      </Drawer>
    </>
  );
}

describe('test Drawer', () => {
  test('Drawer render', async () => {
    const { getByText } = render(<DrawerDemo />);
    fireEvent.click(getByText('Open'));
    expect(document.querySelector('.t-drawer--open')).toBeInTheDocument();
    expect(document.querySelector('.t-drawer__mask')).toBeInTheDocument();
    expect(document.querySelector('.t-drawer__content-wrapper--right')).toBeInTheDocument();
  });
  test('Drawer close', async () => {
    const { getByText } = render(<DrawerDemo closeBtn={true} />);
    fireEvent.click(getByText('Open'));
    fireEvent.click(document.querySelector('.t-drawer__close-btn'));
    expect(document.querySelector('.t-drawer--open')).not.toBeInTheDocument();
    expect(document.querySelector('.t-drawer')).toBeInTheDocument();
  });
  test('Drawer mask close', async () => {
    const { getByText } = render(<DrawerDemo />);
    fireEvent.click(getByText('Open'));
    expect(document.querySelector('.t-drawer--open')).toBeInTheDocument();
    fireEvent.click(document.querySelector('.t-drawer--open')?.children[0]);
    expect(document.querySelector('.t-drawer--open')).not.toBeInTheDocument();
  });
  test('Drawer placement', async () => {
    const { getByText } = render(<DrawerDemo placement="top" />);
    fireEvent.click(getByText('Open'));
    expect(document.querySelector('.t-drawer__content-wrapper--right')).not.toBeInTheDocument();
    expect(document.querySelector('.t-drawer__content-wrapper--top')).toBeInTheDocument();
  });
  test('Drawer size', async () => {
    const { getByText } = render(<DrawerDemo size="50%" />);
    fireEvent.click(getByText('Open'));
    expect(document.querySelector('.t-drawer__content-wrapper--right')).toHaveStyle({ width: '50%' });
  });
  test('Drawer showOverlay', () => {
    const { getByText } = render(<DrawerDemo notShowOverlay />);
    fireEvent.click(getByText('Open'));
    expect(document.querySelector('.t-drawer__mask')).not.toBeInTheDocument();
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
    const onCancelFn = vi.fn();
    const { getByText } = render(<DrawerDemo onCancel={onCancelFn} />);
    fireEvent.click(getByText('Open'));
    expect(onCancelFn).not.toBeCalled();
    fireEvent.click(getByText('取消'));
    expect(onCancelFn).toBeCalled();
  });
});
