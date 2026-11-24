import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getElmCssPropValue,
  getRelativePosition,
  getScrollParent,
  getTargetElm,
  isFixed,
  scrollToElm,
  scrollToParentVisibleArea,
} from '../utils/dom';
import {
  addClass,
  elementInViewport,
  getWindowScroll,
  getWindowSize,
  hasClass,
  preventDefault,
  removeClass,
  stopPropagation,
} from '../utils/shared';

describe('shared utils', () => {
  describe('addClass', () => {
    it('should add class to element', () => {
      const element = document.createElement('div');
      addClass(element, 'test-class');
      expect(element.className).toBe('test-class');
    });

    it('should add multiple classes', () => {
      const element = document.createElement('div');
      addClass(element, 'class1 class2');
      expect(element.className).toBe('class1 class2');
    });

    it('should not add duplicate classes', () => {
      const element = document.createElement('div');
      element.className = 'existing';
      addClass(element, 'existing new');
      expect(element.className).toBe('existing new');
    });

    it('should handle null element', () => {
      expect(() => addClass(null, 'test')).not.toThrow();
    });

    it('should skip empty class names with classList', () => {
      const element = document.createElement('div');
      addClass(element, 'class1  class2');
      expect(element.classList.contains('class1')).toBe(true);
      expect(element.classList.contains('class2')).toBe(true);
      expect(element.classList.length).toBe(2);
    });

    it('should handle leading/trailing spaces', () => {
      const element = document.createElement('div');
      addClass(element, ' class1 class2 ');
      expect(element.classList.contains('class1')).toBe(true);
      expect(element.classList.contains('class2')).toBe(true);
    });
  });

  describe('removeClass', () => {
    it('should remove class from element', () => {
      const element = document.createElement('div');
      element.className = 'test-class other';
      removeClass(element, 'test-class');
      expect(element.className).toBe('other');
    });

    it('should remove multiple classes', () => {
      const element = document.createElement('div');
      element.className = 'class1 class2 class3';
      removeClass(element, 'class1 class3');
      expect(element.className).toBe('class2');
    });

    it('should handle null element', () => {
      expect(() => removeClass(null, 'test')).not.toThrow();
    });

    it('should skip empty class names with classList', () => {
      const element = document.createElement('div');
      element.className = 'class1 class2 class3';
      removeClass(element, 'class1  class3');
      expect(element.classList.contains('class1')).toBe(false);
      expect(element.classList.contains('class2')).toBe(true);
      expect(element.classList.contains('class3')).toBe(false);
    });

    it('should handle leading/trailing spaces', () => {
      const element = document.createElement('div');
      element.className = 'class1 class2 class3';
      removeClass(element, ' class1 class3 ');
      expect(element.classList.contains('class1')).toBe(false);
      expect(element.classList.contains('class2')).toBe(true);
      expect(element.classList.contains('class3')).toBe(false);
    });
  });

  describe('hasClass', () => {
    it('should return true if element has class', () => {
      const element = document.createElement('div');
      element.className = 'test-class other';
      expect(hasClass(element, 'test-class')).toBe(true);
    });

    it('should return false if element does not have class', () => {
      const element = document.createElement('div');
      element.className = 'other-class';
      expect(hasClass(element, 'test-class')).toBe(false);
    });

    it('should return false for null element', () => {
      expect(hasClass(null, 'test')).toBe(false);
    });

    it('should throw error if class contains space', () => {
      const element = document.createElement('div');
      expect(() => hasClass(element, 'test class')).toThrow('className should not contain space.');
    });
  });

  describe('elementInViewport', () => {
    it('should return true if element is in viewport', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 10,
        left: 10,
        bottom: 50,
        right: 50,
      });
      expect(elementInViewport(element)).toBe(true);
      document.body.removeChild(element);
    });

    it('should return false if element is not in viewport', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: -100,
        left: 10,
        bottom: -50,
        right: 50,
      });
      expect(elementInViewport(element)).toBe(false);
      document.body.removeChild(element);
    });

    it('should check against parent element', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      parent.appendChild(child);
      document.body.appendChild(parent);

      parent.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0,
        left: 0,
        bottom: 100,
        right: 100,
      });
      child.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 10,
        left: 10,
        bottom: 50,
        right: 50,
      });

      expect(elementInViewport(child, parent)).toBe(true);
      document.body.removeChild(parent);
    });
  });

  describe('getWindowScroll', () => {
    it('should return window scroll position', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      Object.defineProperty(window, 'pageXOffset', { value: 50, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 100, writable: true });
      Object.defineProperty(document.documentElement, 'scrollLeft', { value: 50, writable: true });
      Object.defineProperty(document.body, 'scrollTop', { value: 100, writable: true });
      Object.defineProperty(document.body, 'scrollLeft', { value: 50, writable: true });

      const result = getWindowScroll();
      expect(result).toEqual({ scrollTop: 100, scrollLeft: 50 });
    });
  });

  describe('getWindowSize', () => {
    it('should return window size', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

      const result = getWindowSize();
      expect(result).toEqual({ width: 1024, height: 768 });
    });

    it('should fallback to document element', () => {
      Object.defineProperty(window, 'innerWidth', { value: undefined, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: undefined, writable: true });
      Object.defineProperty(document.documentElement, 'clientWidth', { value: 800, writable: true });
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 600, writable: true });

      const result = getWindowSize();
      expect(result).toEqual({ width: 800, height: 600 });
    });
  });

  describe('stopPropagation', () => {
    it('should call stopPropagation on event', () => {
      const event = { stopPropagation: vi.fn() } as any;
      stopPropagation(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('preventDefault', () => {
    it('should call preventDefault on cancellable event', () => {
      const event = { preventDefault: vi.fn(), cancelable: true, stopPropagation: vi.fn() } as any;
      preventDefault(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not call preventDefault on non-cancellable event', () => {
      const event = { preventDefault: vi.fn(), cancelable: false, stopPropagation: vi.fn() } as any;
      preventDefault(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should call stopPropagation when isStopPropagation is true', () => {
      const event = { preventDefault: vi.fn(), cancelable: true, stopPropagation: vi.fn() } as any;
      preventDefault(event, true);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('getSSRAttach', () => {
    it('should return body in test-snap environment', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test-snap';

      // Dynamic import to force re-evaluation with new env
      const module = await import('../utils/shared');
      const result = module.getSSRAttach();
      expect(result).toBe('body');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('trim function', () => {
    it('should handle empty class names in removeClass', () => {
      const element = document.createElement('div');
      element.className = 'class1  class2';
      removeClass(element, 'class1');
      expect(element.className.trim()).toBe('class2');
    });
  });

  describe('hasClass edge cases', () => {
    it('should return false when element has no className', () => {
      const element = document.createElement('div');
      expect(hasClass(element, 'test')).toBe(false);
    });

    it('should return false when cls is empty', () => {
      const element = document.createElement('div');
      element.className = 'test';
      expect(hasClass(element, '')).toBe(false);
    });
  });

  describe('addClass without classList support', () => {
    it('should add class when classList is not available', () => {
      const element = document.createElement('div');
      const originalClassList = element.classList;
      Object.defineProperty(element, 'classList', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      addClass(element, 'test-class');
      expect(element.className).toContain('test-class');
      Object.defineProperty(element, 'classList', {
        value: originalClassList,
        writable: true,
        configurable: true,
      });
    });

    it('should skip empty class names without classList', () => {
      const element = document.createElement('div');
      const originalClassList = element.classList;
      Object.defineProperty(element, 'classList', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      addClass(element, 'class1  class2');
      expect(element.className).toContain('class1');
      expect(element.className).toContain('class2');
      Object.defineProperty(element, 'classList', {
        value: originalClassList,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('removeClass without classList support', () => {
    it('should remove class when classList is not available', () => {
      const element = document.createElement('div');
      element.className = 'test-class other';
      const originalClassList = element.classList;
      Object.defineProperty(element, 'classList', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      removeClass(element, 'test-class');
      expect(element.className).not.toContain('test-class');
      Object.defineProperty(element, 'classList', {
        value: originalClassList,
        writable: true,
        configurable: true,
      });
    });

    it('should skip empty class names without classList', () => {
      const element = document.createElement('div');
      element.className = 'test-class other';
      const originalClassList = element.classList;
      Object.defineProperty(element, 'classList', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      removeClass(element, 'test-class  other');
      expect(element.className.trim()).toBe('');
      Object.defineProperty(element, 'classList', {
        value: originalClassList,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('hasClass without classList support', () => {
    it('should check class when classList is not available', () => {
      const element = document.createElement('div');
      element.className = 'test-class other';
      const originalClassList = element.classList;
      Object.defineProperty(element, 'classList', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      expect(hasClass(element, 'test-class')).toBe(true);
      Object.defineProperty(element, 'classList', {
        value: originalClassList,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('preventDefault edge cases', () => {
    it('should handle event without cancelable property', () => {
      const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as any;
      preventDefault(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});

describe('dom utils', () => {
  beforeEach(() => {
    // Mock getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      value: vi.fn().mockReturnValue({
        getPropertyValue: vi.fn().mockReturnValue('static'),
        position: 'static',
        overflow: 'visible',
        overflowX: 'visible',
        overflowY: 'visible',
      }),
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getElmCssPropValue', () => {
    it('should return css property value', () => {
      const element = document.createElement('div');
      const value = getElmCssPropValue(element, 'position');
      expect(value).toBe('static');
    });

    it('should return empty string when defaultView is not available', () => {
      const originalDefaultView = document.defaultView;
      Object.defineProperty(document, 'defaultView', {
        value: null,
        writable: true,
        configurable: true,
      });
      const element = document.createElement('div');
      const value = getElmCssPropValue(element, 'position');
      expect(value).toBe('');
      Object.defineProperty(document, 'defaultView', {
        value: originalDefaultView,
        writable: true,
        configurable: true,
      });
    });

    it('should return value without toLowerCase when propValue has no toLowerCase method', () => {
      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          getPropertyValue: vi.fn().mockReturnValue(123),
        }),
        writable: true,
      });
      const element = document.createElement('div');
      const value = getElmCssPropValue(element, 'z-index');
      expect(value).toBe(123);
    });
  });

  describe('isFixed', () => {
    it('should return false for element with no parent', () => {
      const element = document.createElement('html');
      expect(isFixed(element)).toBe(false);
    });

    it('should return false when parent is HTML', () => {
      const element = document.createElement('div');
      const html = document.documentElement;
      html.appendChild(element);
      expect(isFixed(element)).toBe(false);
      html.removeChild(element);
    });

    it('should return true for fixed position element', () => {
      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          getPropertyValue: vi.fn().mockReturnValue('fixed'),
        }),
        writable: true,
      });
      const parent = document.createElement('div');
      const element = document.createElement('div');
      parent.appendChild(element);
      document.body.appendChild(parent);
      expect(isFixed(element)).toBe(true);
      document.body.removeChild(parent);
    });

    it('should recursively check parent elements', () => {
      const grandparent = document.createElement('div');
      const parent = document.createElement('div');
      const element = document.createElement('div');
      grandparent.appendChild(parent);
      parent.appendChild(element);
      document.body.appendChild(grandparent);

      let callCount = 0;
      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockImplementation(() => {
          callCount += 1;
          return {
            getPropertyValue: vi.fn().mockReturnValue(callCount === 2 ? 'fixed' : 'static'),
          };
        }),
        writable: true,
      });

      expect(isFixed(element)).toBe(true);
      document.body.removeChild(grandparent);
    });
  });

  describe('getRelativePosition', () => {
    it('should return position relative to body', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        left: 50,
      });
      document.body.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0,
        left: 0,
      });

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      Object.defineProperty(window, 'pageXOffset', { value: 50, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 100, writable: true });
      Object.defineProperty(document.documentElement, 'scrollLeft', { value: 50, writable: true });

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          getPropertyValue: vi.fn().mockReturnValue('static'),
        }),
        writable: true,
      });

      const pos = getRelativePosition(element);
      expect(pos).toEqual({ top: 200, left: 100 });
      document.body.removeChild(element);
    });

    it('should return position relative to custom parent with relative position', () => {
      const parent = document.createElement('div');
      const element = document.createElement('div');
      parent.appendChild(element);
      document.body.appendChild(parent);

      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 150,
        left: 100,
      });
      parent.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 50,
        left: 50,
      });

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          getPropertyValue: vi.fn().mockReturnValue('relative'),
        }),
        writable: true,
      });

      const pos = getRelativePosition(element, parent);
      expect(pos).toEqual({ top: 100, left: 50 });
      document.body.removeChild(parent);
    });

    it('should return position relative to custom parent with sticky position', () => {
      const parent = document.createElement('div');
      const element = document.createElement('div');
      parent.appendChild(element);
      document.body.appendChild(parent);

      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 150,
        left: 100,
      });
      parent.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 50,
        left: 50,
      });

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          getPropertyValue: vi.fn().mockReturnValue('sticky'),
        }),
        writable: true,
      });

      const pos = getRelativePosition(element, parent);
      expect(pos).toEqual({ top: 100, left: 50 });
      document.body.removeChild(parent);
    });

    it('should return fixed position for fixed elements', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        left: 50,
      });

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          getPropertyValue: vi.fn().mockReturnValue('fixed'),
        }),
        writable: true,
      });

      const pos = getRelativePosition(element);
      expect(pos).toEqual({ top: 100, left: 50 });
      document.body.removeChild(element);
    });

    it('should add scroll offset for non-fixed elements', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        left: 50,
      });
      document.body.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0,
        left: 0,
      });

      Object.defineProperty(window, 'pageYOffset', { value: 200, writable: true });
      Object.defineProperty(window, 'pageXOffset', { value: 100, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 200, writable: true });
      Object.defineProperty(document.documentElement, 'scrollLeft', { value: 100, writable: true });

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          getPropertyValue: vi.fn().mockReturnValue('static'),
        }),
        writable: true,
      });

      const pos = getRelativePosition(element);
      expect(pos).toEqual({ top: 300, left: 150 });
      document.body.removeChild(element);
    });
  });

  describe('getTargetElm', () => {
    it('should return element by string selector', () => {
      const element = document.createElement('div');
      element.id = 'test-element';
      document.body.appendChild(element);

      const result = getTargetElm('#test-element');
      expect(result).toBe(element);
      document.body.removeChild(element);
    });

    it('should return element from function', () => {
      const element = document.createElement('div');
      element.id = 'test-element-fn';
      document.body.appendChild(element);

      const result = getTargetElm(() => document.getElementById('test-element-fn'));
      expect(result).toBe(element);
      document.body.removeChild(element);
    });

    it('should throw error for invalid element type', () => {
      expect(() => getTargetElm(123 as any)).toThrow('elm should be string or function');
    });

    it('should return document.body when element not found in test environment', () => {
      const result = getTargetElm('#non-existent-element');
      expect(result).toBe(document.body);
    });

    it('should return document.body when elm is null or undefined', () => {
      const result = getTargetElm(null as any);
      expect(result).toBe(document.body);
    });

    it('should throw error when element not found in non-test environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      expect(() => getTargetElm('#non-existent')).toThrow('There is no element with given.');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('getScrollParent', () => {
    it('should return document.body for fixed position element', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          position: 'fixed',
          overflow: 'visible',
          overflowX: 'visible',
          overflowY: 'visible',
        }),
        writable: true,
      });

      const result = getScrollParent(element);
      expect(result).toBe(document.body);
      document.body.removeChild(element);
    });

    it('should find scrollable parent with overflow auto', () => {
      const scrollParent = document.createElement('div');
      const element = document.createElement('div');
      scrollParent.appendChild(element);
      document.body.appendChild(scrollParent);

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockImplementation((el) => {
          if (el === scrollParent) {
            return {
              position: 'relative',
              overflow: 'auto',
              overflowX: 'visible',
              overflowY: 'visible',
            };
          }
          return {
            position: 'static',
            overflow: 'visible',
            overflowX: 'visible',
            overflowY: 'visible',
          };
        }),
        writable: true,
      });

      const result = getScrollParent(element);
      expect(result).toBe(scrollParent);
      document.body.removeChild(scrollParent);
    });

    it('should find scrollable parent with overflow scroll', () => {
      const scrollParent = document.createElement('div');
      const element = document.createElement('div');
      scrollParent.appendChild(element);
      document.body.appendChild(scrollParent);

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockImplementation((el) => {
          if (el === scrollParent) {
            return {
              position: 'relative',
              overflow: 'visible',
              overflowX: 'scroll',
              overflowY: 'visible',
            };
          }
          return {
            position: 'static',
            overflow: 'visible',
            overflowX: 'visible',
            overflowY: 'visible',
          };
        }),
        writable: true,
      });

      const result = getScrollParent(element);
      expect(result).toBe(scrollParent);
      document.body.removeChild(scrollParent);
    });

    it('should skip static parent for absolute positioned element', () => {
      const staticParent = document.createElement('div');
      const scrollParent = document.createElement('div');
      const element = document.createElement('div');
      scrollParent.appendChild(element);
      staticParent.appendChild(scrollParent);
      document.body.appendChild(staticParent);

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockImplementation((el) => {
          if (el === element) {
            return {
              position: 'absolute',
              overflow: 'visible',
              overflowX: 'visible',
              overflowY: 'visible',
            };
          }
          if (el === scrollParent) {
            return {
              position: 'static',
              overflow: 'visible',
              overflowX: 'visible',
              overflowY: 'visible',
            };
          }
          if (el === staticParent) {
            return {
              position: 'relative',
              overflow: 'auto',
              overflowX: 'visible',
              overflowY: 'visible',
            };
          }
          return {
            position: 'static',
            overflow: 'visible',
            overflowX: 'visible',
            overflowY: 'visible',
          };
        }),
        writable: true,
      });

      const result = getScrollParent(element);
      expect(result).toBe(staticParent);
      document.body.removeChild(staticParent);
    });

    it('should return document.body when no scrollable parent found', () => {
      const parent = document.createElement('div');
      const element = document.createElement('div');
      parent.appendChild(element);
      document.body.appendChild(parent);

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          position: 'static',
          overflow: 'visible',
          overflowX: 'visible',
          overflowY: 'visible',
        }),
        writable: true,
      });

      const result = getScrollParent(element);
      expect(result).toBe(document.body);
      document.body.removeChild(parent);
    });
  });

  describe('scrollToParentVisibleArea', () => {
    it('should return early if parent is document.body', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockReturnValue({
          position: 'static',
          overflow: 'visible',
          overflowX: 'visible',
          overflowY: 'visible',
        }),
        writable: true,
      });

      scrollToParentVisibleArea(element);
      // Should not throw and complete successfully
      expect(true).toBe(true);
      document.body.removeChild(element);
    });

    it('should return early if element is already in viewport', () => {
      const parent = document.createElement('div');
      const element = document.createElement('div');
      parent.appendChild(element);
      document.body.appendChild(parent);

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockImplementation((el) => {
          if (el === parent) {
            return {
              position: 'relative',
              overflow: 'auto',
              overflowX: 'visible',
              overflowY: 'visible',
            };
          }
          return {
            position: 'static',
            overflow: 'visible',
            overflowX: 'visible',
            overflowY: 'visible',
          };
        }),
        writable: true,
      });

      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 10,
        left: 10,
        bottom: 50,
        right: 50,
      });
      parent.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0,
        left: 0,
        bottom: 100,
        right: 100,
      });

      const originalScrollTop = parent.scrollTop;
      scrollToParentVisibleArea(element);
      expect(parent.scrollTop).toBe(originalScrollTop);
      document.body.removeChild(parent);
    });

    it('should scroll parent when element is not in viewport', () => {
      const parent = document.createElement('div');
      const element = document.createElement('div');
      parent.appendChild(element);
      document.body.appendChild(parent);

      Object.defineProperty(window, 'getComputedStyle', {
        value: vi.fn().mockImplementation((el) => {
          if (el === parent) {
            return {
              position: 'relative',
              overflow: 'auto',
              overflowX: 'visible',
              overflowY: 'visible',
            };
          }
          return {
            position: 'static',
            overflow: 'visible',
            overflowX: 'visible',
            overflowY: 'visible',
          };
        }),
        writable: true,
      });

      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 150,
        left: 10,
        bottom: 200,
        right: 50,
      });
      parent.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0,
        left: 0,
        bottom: 100,
        right: 100,
      });

      Object.defineProperty(element, 'offsetTop', { value: 150, writable: true });
      Object.defineProperty(parent, 'offsetTop', { value: 0, writable: true });

      scrollToParentVisibleArea(element);
      expect(parent.scrollTop).toBe(150);
      document.body.removeChild(parent);
    });
  });

  describe('scrollToElm', () => {
    it('should not scroll if element is already in viewport', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        left: 50,
        bottom: 150,
        right: 100,
        height: 50,
      });

      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

      const scrollToSpy = vi.spyOn(window, 'scrollTo');
      scrollToElm(element);
      expect(scrollToSpy).not.toHaveBeenCalled();
      document.body.removeChild(element);
    });

    it('should scroll to center element when not in viewport', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: -100,
        left: 50,
        bottom: -50,
        right: 100,
        height: 50,
      });

      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

      const scrollToSpy = vi.fn();
      window.scrollTo = scrollToSpy;

      scrollToElm(element);
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: -100 - (768 / 2 - 50 / 2),
        behavior: 'smooth',
      });
      document.body.removeChild(element);
    });
  });
});
