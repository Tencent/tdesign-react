import { useCallback, useRef } from 'react';
import { LastFormItemController } from '@tdesign/common-js/form/last-form-item';

import useLayoutEffect from '../../hooks/useLayoutEffect';

import type { RefObject } from 'react';
import type { TdFormProps } from '../type';

export default function useLastFormItem(
  formRef: RefObject<HTMLFormElement>,
  layout: TdFormProps['layout'],
  classPrefix: string,
) {
  const controllerRef = useRef<LastFormItemController | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = new LastFormItemController({
      classPrefix,
      disabled: layout === 'inline',
    });
  }
  const controller = controllerRef.current;

  const registerFormItem = useCallback((node: HTMLElement) => controller.register(node), [controller]);

  useLayoutEffect(() => {
    controller.update({ classPrefix, disabled: layout === 'inline' });
    controller.bind(formRef.current);
    return () => controller.unbind();
  }, [classPrefix, controller, formRef, layout]);

  useLayoutEffect(() => () => controller.destroy(), [controller]);

  return registerFormItem;
}
