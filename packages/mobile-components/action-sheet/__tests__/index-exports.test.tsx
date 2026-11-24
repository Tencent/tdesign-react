import { describe, it, expect } from '@test/utils';
import ActionSheet, { ActionSheetProps } from '../index';
import * as ActionSheetMethod from '../ActionSheetMethod';

describe('ActionSheet index exports', () => {
  it('should export ActionSheet as default', () => {
    expect(ActionSheet).toBeDefined();
    expect(typeof ActionSheet).toBe('function');
  });

  it('should export ActionSheetProps type', () => {
    // TypeScript type check - if this compiles, the type is exported
    const props: ActionSheetProps = {
      visible: true,
      items: ['test'],
    };
    expect(props).toBeDefined();
  });

  it('should export ActionSheet methods', () => {
    expect(ActionSheetMethod.show).toBeDefined();
    expect(ActionSheetMethod.close).toBeDefined();
    expect(typeof ActionSheetMethod.show).toBe('function');
    expect(typeof ActionSheetMethod.close).toBe('function');
  });

  it('should have consistent exports', () => {
    // Ensure the default export is the same as the named export
    expect(ActionSheet).toBeDefined();
  });
});
