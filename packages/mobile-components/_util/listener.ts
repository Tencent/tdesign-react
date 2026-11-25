import { canUseDOM } from './dom';

export const on = ((): any => {
  if (canUseDOM() && document.addEventListener) {
    return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
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
  if (canUseDOM() && document.removeEventListener) {
    return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  }
  return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {
    if (element && event) {
      (element as any).detachEvent(`on${event}`, handler);
    }
  };
})();
