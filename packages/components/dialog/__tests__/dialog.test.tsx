import React, { useState } from 'react';
import { fireEvent, mockTimeout, render, vi } from '@test/utils';
import userEvent from '@testing-library/user-event';

import { ConfigContext } from '../../config-provider';
import { defaultGlobalConfig } from '../../config-provider/ConfigContext';
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
      <div onClick={handleClose}>Close Dialog Modal</div>
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

describe('Dialog', () => {
  const user = userEvent.setup();

  describe('props', () => {
    test('header[false]', async () => {
      const { container } = render(
        <Dialog header={false} visible>
          <p>This is a dialog</p>
        </Dialog>,
      );

      expect(container.querySelector('.t-dialog__header')).toBeNull();
    });

    describe('focusable', () => {
      (['confirm-button', 'cancel-button'] as const).forEach((defaultFocus) => {
        test(`defaultFocus[${defaultFocus}]`, () => {
          render(<Dialog visible focusable={{ defaultFocus, focusTriggerAfterClose: false }} />);

          const className = defaultFocus === 'confirm-button' ? 't-dialog__confirm' : 't-dialog__cancel';
          expect(document.activeElement).toHaveClass(className);
        });
      });

      test('defaultFocus[function]', () => {
        render(
          <Dialog
            visible
            focusable={{
              defaultFocus: () => document.querySelector('#custom-dialog-focus'),
              focusTriggerAfterClose: false,
            }}
          >
            <input id="custom-dialog-focus" />
          </Dialog>,
        );

        expect(document.activeElement).toHaveAttribute('id', 'custom-dialog-focus');
      });

      test('defaultFocus[null]', () => {
        const opener = document.createElement('button');
        document.body.appendChild(opener);
        opener.focus();

        render(<Dialog visible focusable={{ defaultFocus: null, focusTriggerAfterClose: false }} />);

        expect(document.activeElement).toBe(opener);
        opener.remove();
      });

      test('focusTrap', async () => {
        render(
          <>
            <button data-testid="outside-focus">Outside</button>
            <Dialog
              visible
              focusable={{
                defaultFocus: 'confirm-button',
                focusTrap: true,
                focusTriggerAfterClose: false,
              }}
            >
              <button data-testid="body-focus">Body action</button>
            </Dialog>
          </>,
        );

        expect(document.activeElement).toHaveClass('t-dialog__confirm');
        await user.tab();
        expect(document.activeElement).toHaveAttribute('data-testid', 'body-focus');

        document.querySelector<HTMLElement>('[data-testid="outside-focus"]').focus();
        expect(document.activeElement).not.toHaveAttribute('data-testid', 'outside-focus');
        expect(document.querySelector('.t-dialog')).toContainElement(document.activeElement as HTMLElement);
      });

      test('focusTriggerAfterClose', async () => {
        function FocusRestoreDemo() {
          const [visible, setVisible] = useState(false);
          return (
            <>
              <button onClick={() => setVisible(true)}>Open focus dialog</button>
              <Dialog
                visible={visible}
                focusable={{
                  defaultFocus: 'confirm-button',
                  focusTriggerAfterClose: true,
                }}
                onClose={() => setVisible(false)}
              />
            </>
          );
        }

        const { getByText } = render(<FocusRestoreDemo />);
        const opener = getByText('Open focus dialog');
        await user.click(opener);
        expect(document.activeElement).toHaveClass('t-dialog__confirm');

        fireEvent.click(document.querySelector('.t-dialog__close'));
        await mockTimeout(() => expect(document.activeElement).toBe(opener), 400);
      });
    });
  });

  describe('events', () => {
    test('onEscKeydown', async () => {
      const onEscKeydown = vi.fn();
      const { getByText } = render(<DialogDemo mode="modal" draggable={false} onEscKeydown={onEscKeydown} />);

      await fireEvent.click(getByText('Open Dialog Modal'));
      await user.keyboard('{Escape}');
      expect(onEscKeydown).toHaveBeenCalled();
    });

    test('onConfirm', async () => {
      const onConfirm = vi.fn();
      const { getByText } = render(<DialogDemo mode="modal" draggable={false} onConfirm={onConfirm} />);

      fireEvent.click(getByText('Open Dialog Modal'));
      await user.keyboard('{Enter}');
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  describe('scenarios', () => {
    test('ConfigContext applies global dialog placement and zIndex', () => {
      render(
        <ConfigContext.Provider
          value={{
            globalConfig: {
              ...defaultGlobalConfig,
              dialog: {
                ...(defaultGlobalConfig.dialog || {}),
                placement: 'center',
                zIndex: 4321,
              },
            },
          }}
        >
          <Dialog header="Global Config" body="This is a dialog" visible />
        </ConfigContext.Provider>,
      );

      expect(document.querySelector('.t-dialog--center')).toBeInTheDocument();
      expect(document.querySelector('.t-dialog--top')).not.toBeInTheDocument();
      expect(document.querySelector('.t-dialog__ctx')).toHaveStyle({
        zIndex: '4321',
      });
    });

    test('placement and zIndex override ConfigContext defaults', () => {
      render(
        <ConfigContext.Provider
          value={{
            globalConfig: {
              ...defaultGlobalConfig,
              dialog: {
                ...(defaultGlobalConfig.dialog || {}),
                placement: 'center',
                zIndex: 4321,
              },
            },
          }}
        >
          <Dialog header="Global Config" body="This is a dialog" visible placement="top" zIndex={1234} />
        </ConfigContext.Provider>,
      );

      expect(document.querySelector('.t-dialog--top')).toBeInTheDocument();
      expect(document.querySelector('.t-dialog--center')).not.toBeInTheDocument();
      expect(document.querySelector('.t-dialog__ctx')).toHaveStyle({
        zIndex: '1234',
      });
    });

    test('visible opens the modal through controlled state', () => {
      const { getByText } = render(<DialogDemo mode="modal" draggable={false} />);
      expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument();
      fireEvent.click(getByText('Open Dialog Modal'));
      expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
    });

    test('keyboard open uses the trigger center as the dialog transform origin', async () => {
      function KeyboardOpenDemo() {
        const [visible, setVisible] = useState(false);
        return (
          <>
            <button onClick={() => setVisible(true)}>Open by keyboard</button>
            <Dialog visible={visible} onClose={() => setVisible(false)} />
          </>
        );
      }

      const { getByText } = render(<KeyboardOpenDemo />);
      const trigger = getByText('Open by keyboard');
      vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
        x: 100,
        y: 200,
        left: 100,
        top: 200,
        right: 180,
        bottom: 240,
        width: 80,
        height: 40,
        toJSON: () => ({}),
      });
      trigger.focus();
      await user.keyboard('{Enter}');

      expect(document.querySelector('.t-dialog')).toHaveStyle({
        transformOrigin: '140px 220px',
      });
    });

    test('close button hides the visible modal', async () => {
      const { getByText } = render(<DialogDemo mode="modal" draggable={false} />);
      fireEvent.click(getByText('Open Dialog Modal'));
      expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();
      fireEvent.click(document.querySelector('.t-dialog__close'));
      await mockTimeout(() => expect(document.querySelector('.t-dialog__modal')).not.toBeInTheDocument(), 400);
    });

    test('onConfirm uses the latest closure', async () => {
      function ClosureDemo() {
        const [visible, setVisible] = useState(true);
        const [count, setCount] = useState(0);
        const [captured, setCaptured] = useState<number | null>(null);

        // 每次渲染都是一个新的函数引用，但源码字符串完全一致
        const onConfirm = () => {
          setCaptured(count);
          setVisible(false);
        };

        return (
          <>
            <div onClick={() => setCount((c) => c + 1)}>Increment</div>
            <div data-testid="captured">{captured}</div>
            <Dialog header="Basic Modal" visible={visible} onClose={() => setVisible(false)} onConfirm={onConfirm}>
              <p>This is a dialog</p>
            </Dialog>
          </>
        );
      }

      const { getByText, getByTestId } = render(<ClosureDemo />);
      expect(document.querySelector('.t-dialog__modal')).toBeInTheDocument();

      // 弹窗保持打开，多次改变闭包捕获的数据
      fireEvent.click(getByText('Increment'));
      fireEvent.click(getByText('Increment'));
      fireEvent.click(getByText('Increment'));

      fireEvent.click(document.querySelector('.t-dialog__confirm'));

      expect(getByTestId('captured').textContent).toBe('3');
    });

    test('draggable updates the modeless dialog position', () => {
      const { getByText } = render(<DialogDemo mode="modeless" draggable={true} />);
      fireEvent.click(getByText('Open Dialog Modal'));
      expect(document.querySelector('.t-dialog__modeless')).toBeInTheDocument();
      fireEvent.mouseDown(document.querySelector('.t-dialog'));
      fireEvent.mouseMove(document.querySelector('.t-dialog'));
      expect(document.querySelector('.t-dialog')).toHaveStyle({
        cursor: 'move',
        position: 'absolute',
      });
      fireEvent.mouseUp(document.querySelector('.t-dialog'));
      userEvent.keyboard('{esc}');
      expect(document.querySelector('.t-dialog')).toHaveStyle({
        left: '0px',
        top: '0px',
      });
    });
  });

  describe('instanceFunctions', () => {
    test('DialogPlugin.focusable', async () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();

      const pluginDialog = DialogPlugin.confirm({
        header: 'Focusable Plugin Dialog',
        focusable: {
          defaultFocus: 'confirm-button',
          focusTrap: true,
          focusTriggerAfterClose: true,
        },
      });

      await mockTimeout(() => expect(document.activeElement).toHaveClass('t-dialog__confirm'), 100);
      pluginDialog.hide();
      await mockTimeout(() => expect(document.activeElement).toBe(trigger), 500);
      trigger.remove();
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
});
