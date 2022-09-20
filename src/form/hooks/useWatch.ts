import { useState, useEffect, useMemo, useRef } from 'react';
import type { NamePath } from '../type';
import type { InternalFormInstance } from './interface';
import { HOOK_MARK } from './useForm';

export default function useWatch(fields: NamePath, form: InternalFormInstance) {
  const [value, setValue] = useState<any>();
  const valueStr = useMemo(() => JSON.stringify(value), [value]);
  const valueStrRef = useRef(valueStr);

  // eslint-disable-next-line
  const isValidForm = form && form._init;

  useEffect(() => {
    if (!isValidForm) return;

    const { getFieldValue, getInternalHooks } = form;
    const { registerWatch } = getInternalHooks(HOOK_MARK);

    // eslint-disable-next-line
    const cancelRegister = registerWatch((store) => {
      const newValue = getFieldValue(fields);
      const nextValueStr = JSON.stringify(newValue);

      // Compare stringify in case it's nest object
      if (valueStrRef.current !== nextValueStr) {
        valueStrRef.current = nextValueStr;
        setValue(newValue);
      }
    });

    const initialValue = getFieldValue(fields);
    setValue(initialValue);

    return cancelRegister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}
