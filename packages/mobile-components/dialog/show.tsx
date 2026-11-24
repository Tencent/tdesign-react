import React, { createRef, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { renderToBody } from '../_util/renderToBody';
import Dialog, { DialogProps } from './Dialog';
import { DialogInstance } from './type';

export type DialogShowProps = Omit<DialogProps, 'visible'>;

export function show(props: DialogShowProps): DialogInstance {
  const ref = createRef<DialogInstance>();
  let destroy = () => {
    console.error('empty destroy function');
  };
  const Wrapper = forwardRef<DialogInstance>((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<DialogShowProps>(props);

    useEffect(() => {
      setVisible(true);
    }, []);

    const closeHandle = useCallback(
      (context) => {
        options.onClose?.(context);
        setVisible(false);
      },
      [options],
    );

    const confirmHandle = useCallback(
      async (context) => {
        await options.onConfirm?.(context);
        setVisible(false);
      },
      [options],
    );

    const onClosedHandle = useCallback(() => {
      options.onClosed?.();
      destroy();
    }, [options]);

    useImperativeHandle(ref, () => ({
      hide: () => {
        setVisible(false);
      },
      show: () => {
        setVisible(true);
      },
      update: (opts) => {
        setOptions(opts);
      },
      destroy: () => {
        destroy();
      },
    }));

    return (
      <Dialog
        {...options}
        visible={visible}
        onClose={closeHandle}
        onConfirm={confirmHandle}
        onClosed={onClosedHandle}
      />
    );
  });

  destroy = renderToBody(<Wrapper ref={ref} />);

  return {
    hide: () => ref.current?.hide(),
    show: () => ref.current?.show(),
    update: (opts: DialogShowProps) => ref.current?.update(opts),
    destroy: () => ref.current?.destroy(),
  };
}

export default show;
