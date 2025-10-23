import { useEffect } from 'react';
import { CHECKED_CODE_REG } from '@tdesign/common-js/common';
import { off, on } from '../_util/listener';

/** 键盘操作 */
export default function useKeyboard(
  radioGroupRef: React.MutableRefObject<HTMLDivElement>,
  setInnerValue: (value: any, context: { e: React.ChangeEvent<any> }) => void,
) {
  const checkRadioInGroup = (e: React.KeyboardEvent) => {
    if (CHECKED_CODE_REG.test(e.key) || CHECKED_CODE_REG.test(e.code)) {
      const inputNode = (e.target as HTMLElement).querySelector('input');
      if (!inputNode) return;
      const data = inputNode.dataset || {};
      if (inputNode.checked && data.allowUncheck) {
        setInnerValue(undefined, { e });
      } else {
        // Number
        let value: number | string | boolean = !isNaN(Number(data.value)) ? Number(data.value) : data.value;
        // Boolean
        value = (typeof value === 'string' && { true: true, false: false }[value]) || value;
        // String
        value = typeof value === 'string' && value[0] === "'" ? value.replace(/'/g, '') : value;
        setInnerValue(value, { e });
      }
    }
  };

  useEffect(() => {
    on(radioGroupRef.current, 'keydown', checkRadioInGroup);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      off(radioGroupRef.current, 'keydown', checkRadioInGroup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
