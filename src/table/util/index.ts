export enum ScrollDirection {
  X = 'x',
  Y = 'y',
  UNKNOWN = 'unknown',
}

let preScrollLeft: any;
let preScrollTop: any;

export const getScrollDirection = (scrollLeft: number, scrollTop: number): ScrollDirection => {
  let direction = ScrollDirection.UNKNOWN;
  if (preScrollTop !== scrollTop) {
    direction = ScrollDirection.Y;
  } else if (preScrollLeft !== scrollLeft) {
    direction = ScrollDirection.X;
  }
  preScrollTop = scrollTop;
  preScrollLeft = scrollLeft;
  return direction;
};
