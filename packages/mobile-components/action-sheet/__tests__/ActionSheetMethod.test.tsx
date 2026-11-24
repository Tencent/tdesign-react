import { describe, it, expect, afterEach, act } from '@test/utils';
import { show, close } from '../ActionSheetMethod';

describe('ActionSheetMethod', () => {
  afterEach(async () => {
    // 清理每次测试后可能残留的 ActionSheet
    await act(async () => {
      close();
    });
  });

  describe('module exports', () => {
    it('should export show and close functions', () => {
      expect(typeof show).toBe('function');
      expect(typeof close).toBe('function');
    });

    it('should be able to call show function', async () => {
      await act(async () => {
        expect(() => {
          show({
            items: ['Item 1', 'Item 2'],
          });
        }).not.toThrow();
      });
    });

    it('should be able to call close function', async () => {
      await act(async () => {
        expect(() => {
          close();
        }).not.toThrow();
      });
    });

    it('should handle show with empty config', async () => {
      await act(async () => {
        expect(() => {
          show({});
        }).not.toThrow();
      });
    });

    it('should handle show with various config options', async () => {
      await act(async () => {
        expect(() => {
          show({
            items: ['Test Item'],
            theme: 'grid',
            description: 'Test Description',
            visible: true,
          });
        }).not.toThrow();
      });
    });

    it('should handle multiple show calls', async () => {
      await act(async () => {
        expect(() => {
          show({ items: ['Item 1'] });
          show({ items: ['Item 2'] });
        }).not.toThrow();
      });
    });

    it('should handle show and close sequence', async () => {
      await act(async () => {
        expect(() => {
          show({ items: ['Item 1'] });
          close();
          show({ items: ['Item 2'] });
          close();
        }).not.toThrow();
      });
    });
  });
});
