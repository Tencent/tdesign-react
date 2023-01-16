import React, { useState } from 'react';
import { render, fireEvent, mockTimeout } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Dialog from '../index';
import { DialogPlugin } from '../plugin';

function DialogDemo(props) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const onConfirm = () => {
    setVisible(false);
  };

  return (
    <>
      <div onClick={handleClick}>Open Dialog Modal</div>
      <Dialog
        header="Basic Modal"
        visible={visible}
        confirmOnEnter
        destroyOnClose
        onClose={handleClose}
        onConfirm={onConfirm}
        {...props}
      >
        <p>This is a dialog</p>
      </Dialog>
    </>
  );
}

describe('Dialog组件测试', () => {
  const user = userEvent.setup();

  test('BasicDialog', () => {
    const { getByText } = render(<DialogDemo mode="modal" draggable={false} />);
    expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument();
    fireEvent.click(getByText('Open Dialog Modal'));
    expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
  });

  test('CloseDialog', async () => {
    const { getByText } = render(<DialogDemo mode="modal" draggable={false} />);
    fireEvent.click(getByText('Open Dialog Modal'));
    expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
    fireEvent.click(document.querySelector('.t-dialog__close'));
    await mockTimeout(() => expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument(), 400);
  });

  test('EscCloseDialog', async () => {
    const { getByText } = render(<DialogDemo mode="modal" draggable={false} />);
    fireEvent.click(getByText('Open Dialog Modal'));
    expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await mockTimeout(() => expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument(), 400);
  });

  test('EnterConfirm', async () => {
    const { getByText } = render(<DialogDemo mode="modal" draggable={false} />);
    fireEvent.click(getByText('Open Dialog Modal'));
    expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
    await user.keyboard('{Enter}');
    await mockTimeout(() => expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument(), 400);
  });

  test('DraggableDialog', () => {
    const { getByText } = render(<DialogDemo mode="modeless" draggable={true} />);
    fireEvent.click(getByText('Open Dialog Modal'));
    expect(document.querySelector('.t-dialog__modeless')).toBeInTheDocument();
    fireEvent.mouseDown(document.querySelector('.t-dialog'));
    fireEvent.mouseMove(document.querySelector('.t-dialog'));
    expect(document.querySelector('.t-dialog')).toHaveStyle({ cursor: 'move', position: 'absolute' });
    fireEvent.mouseUp(document.querySelector('.t-dialog'));
    userEvent.keyboard('{esc}');
    expect(document.querySelector('.t-dialog')).toHaveStyle({ left: '0px', top: '0px' });
  });

  test('DialogPlugin', async () => {
    const showDialog = () => {
      const myDialog = DialogPlugin({
        header: 'Dialog-Plugin',
        body: '函数调用Dialog方式一',
        onConfirm: () => {
          myDialog.hide();
        },
        onClose: () => {
          myDialog.hide();
        },
      });
    };
    const onConfirm = () => {
      const confirmDia = DialogPlugin.confirm({
        header: 'Dialog-Confirm-Plugin',
        body: '函数调用Dialog方式二',
        confirmBtn: 'ok',
        cancelBtn: 'cancel',
        onConfirm: () => {
          confirmDia.hide();
        },
        onClose: () => {
          confirmDia.hide();
        },
      });
    };
    const onAlert = () => {
      const alertDia = DialogPlugin.alert({
        header: 'Dialog-Alert-Plugin',
        body: '函数调用Dialog方式三',
        confirmBtn: {
          content: 'Got it!',
          variant: 'base',
          theme: 'danger',
        },
        onConfirm: () => {
          alertDia.hide();
        },
        onClose: () => {
          alertDia.hide();
        },
      });
    };
    const handleDialogNode = () => {
      const dialogNode = DialogPlugin({
        header: 'Dialog-Plugin',
        body: 'HandleDialogNode',
      });
      dialogNode.update({
        header: 'Updated-Dialog-Plugin',
        cancelBtn: null,
        confirmBtn: {
          content: 'GET IT!',
          variant: 'base',
          theme: 'danger',
          id: 'test',
        },
        onConfirm: () => {
          dialogNode.hide();
          dialogNode.destroy();
        },
        onClose: () => {
          dialogNode.hide();
        },
      });
    };

    const { getByText } = render(
      <>
        <div onClick={showDialog}>Show Dialog</div>
        <div onClick={onConfirm}>Confirm Dialog</div>
        <div onClick={onAlert}>Alert Dialog</div>
        <div onClick={handleDialogNode}>Handle Dialog</div>
      </>,
    );
    fireEvent.click(getByText('Show Dialog'));
    expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await mockTimeout(() => expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument(), 400);
    fireEvent.click(getByText('Confirm Dialog'));
    expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await mockTimeout(() => expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument(), 400);
    fireEvent.click(getByText('Alert Dialog'));
    expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await mockTimeout(() => expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument(), 400);
    fireEvent.click(getByText('Handle Dialog'));
    expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
    await mockTimeout(() => true, 100);
    fireEvent.click(document.querySelector('#test'));
    await mockTimeout(() => expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument(), 400);
  });
});
