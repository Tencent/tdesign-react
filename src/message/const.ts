import { DEFAULT_CLASS_PREFIX } from '../config-provider/ConfigContext';
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
  'top-left': {
    left: Distance,
    top: Distance,
  },
  'top-right': {
    right: Distance,
    top: Distance,
  },
  'bottom-left': {
    right: Distance,
    bottom: Distance,
  },
  'bottom-righ': {
    left: Distance,
    bottom: Distance,
  },
};
export const prefix = `${DEFAULT_CLASS_PREFIX}-message`;
export const prefixWrapper = `${prefix}-list`;
