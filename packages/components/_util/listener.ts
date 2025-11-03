import { canUseDocument } from './dom';

export const on = ((): any => {
  if (canUseDocument && document.addEventListener) {
    return (
      element: Node,
      event: string,
      handler: EventListenerOrEventListenerObject,
      options?: AddEventListenerOptions,
    ): any => {
      if (element && event && handler) {
        element.addEventListener(event, handler, options ?? false);
      }
    };
  }
  return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {
    if (element && event && handler) {
      (element as any).attachEvent(`on${event}`, handler);
    }
  };
})();

export const off = ((): any => {
  if (canUseDocument && document.removeEventListener) {
    return (
      element: Node,
      event: string,
      handler: EventListenerOrEventListenerObject,
      options?: EventListenerOptions,
    ): any => {
      if (element && event) {
        element.removeEventListener(event, handler, options ?? false);
      }
    };
  }
  return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {
    if (element && event) {
      (element as any).detachEvent(`on${event}`, handler);
    }
  };
})();
