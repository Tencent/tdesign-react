const Distance = '32px';
export const ThemeList: string[] = ['info', 'success', 'warning', 'error', 'question', 'loading'];
export const PlacementOffset = {
  center: {
    left: '50%',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  left: {
    left: Distance,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  bottom: {
    bottom: Distance,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  right: {
    right: Distance,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  top: {
    top: Distance,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  'left-top': {
    left: Distance,
    top: Distance,
  },
  'right-top': {
    right: Distance,
    top: Distance,
  },
  'right-bottom': {
    right: Distance,
    bottom: Distance,
  },
  'left-bottom': {
    left: Distance,
    bottom: Distance,
  },
};
export const prefix = 't-message';
export const prefixWrapper = `${prefix}-list`;
