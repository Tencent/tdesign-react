import React from 'react';
import { render } from '@test/utils';

import { Input, InputGroup } from '..';

import type { TdInputGroupProps } from '../type';

function getInputGroupDefaultMount(props?: TdInputGroupProps) {
  return render(
    <InputGroup {...props}>
      <Input />
      <Input />
    </InputGroup>,
  );
}

describe('InputGroup', () => {
  describe('props', () => {
    test('separate', () => {
      // separate default value is
      const { container: container1 } = getInputGroupDefaultMount();
      expect(container1.querySelector(`.${'t-input-group--separate'}`)).toBeFalsy();
      // separate = true
      const { container: container2 } = getInputGroupDefaultMount({
        separate: true,
      });
      expect(container2.firstChild).toHaveClass('t-input-group--separate');
      // separate = false
      const { container: container3 } = getInputGroupDefaultMount({
        separate: false,
      });
      expect(container3.querySelector(`.${'t-input-group--separate'}`)).toBeFalsy();
    });
  });
});
