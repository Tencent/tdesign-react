import { useEffect, useState } from 'react';
import { get, isEqual } from 'lodash-es';

import noop from '../../_util/noop';
import { HOOK_MARK } from './useForm';

import type { NamePath } from '../type';
import type { InternalFormInstance } from './interface';

export default function useWatch(name: NamePath, form: InternalFormInstance) {
  const [value, setValue] = useState<any>();

  const isValidForm = form && form._init;

  useEffect(() => {
    if (!isValidForm) return;

    const { registerWatch = noop } = form.getInternalHooks?.(HOOK_MARK);

    const cancelRegister = registerWatch(() => {
      const allFieldsValue = form.getFieldsValue?.(true);
      const newValue = get(allFieldsValue, name);
      if (!isEqual(value, newValue)) {
        setValue(newValue);
      }
    });

    const allFieldsValue = form.getFieldsValue?.(true);
    const initialValue = get(allFieldsValue, name);
    setValue(initialValue);

    return cancelRegister;
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, []);

  return value;
}
