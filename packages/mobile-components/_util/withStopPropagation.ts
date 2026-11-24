import React, { ReactElement } from 'react';

export enum PropagationEvent {
  CLICK = 'click',
  SCROLL = 'scroll',
}

const eventToPropRecord: Record<PropagationEvent, string> = {
  [PropagationEvent.CLICK]: 'onClick',
  [PropagationEvent.SCROLL]: 'onScroll',
};

export function withStopPropagation(events: PropagationEvent[], element: ReactElement<any>) {
  const props: Record<string, any> = { ...element.props };
  if (!events.length) return element;

  for (const key of events) {
    const prop = eventToPropRecord[key];
    props[prop] = function (e: Event) {
      e.stopPropagation();
      element.props[prop]?.(e);
    };
  }
  return React.cloneElement(element, props);
}

export default withStopPropagation;
