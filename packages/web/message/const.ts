import { MessageThemeList } from './type';

const Distance = '32px';
export const THEME_ARRAY: MessageThemeList[] = ['info', 'success', 'warning', 'error', 'question', 'loading'];
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
  'top-left': {
    left: Distance,
    top: Distance,
  },
  'top-right': {
    right: Distance,
    top: Distance,
  },
  'bottom-left': {
    left: Distance,
    bottom: Distance,
  },
  'bottom-right': {
    right: Distance,
    bottom: Distance,
  },
};
