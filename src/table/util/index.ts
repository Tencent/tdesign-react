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

function percentPxToNumber(a: string) {
  if (typeof a === 'undefined') return 0;
  if (/%/.test(a)) return Number(a.replace('%', '')) * 0.01;
  return Number(a.replace('px', ''));
}
export const getStyleHeight = (height: number | string) => (isNaN(Number(height)) ? height : `${Number(height)}px`);
export const calHeight = (height: number | string) =>
  isNaN(Number(height)) ? percentPxToNumber(height as string) : Number(height);
