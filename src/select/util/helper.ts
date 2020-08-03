import { ReactElement } from 'react';
import types from '../util/types';

export const getLabel = (children, value) => {
  let selectedLabel = '';
  if (types.isObject(children)) {
    selectedLabel = children.props.label;
  }

  if (Array.isArray(children)) {
    children.forEach((item: ReactElement) => {
      if (types.isObject(item.props)) {
        if (item.props.value === value) {
          selectedLabel = item.props.label;
        }
      }
    });
  }
  return selectedLabel;
};

export const getValue = (children, label) => {
  let selectedValue = '';

  if (types.isObject(children)) {
    selectedValue = children.props.value;
  }

  if (Array.isArray(children)) {
    children.forEach((item: ReactElement) => {
      if (types.isObject(item.props) && !item.props.disabled) {
        if (item.props.label === label) {
          selectedValue = item.props.value;
        }
      }
    });
  }
  return selectedValue;
};

export const getHeight = (size) => {
  let height = '32px';
  if (size === 'small') {
    height = '24px';
  }
  if (size === 'large') {
    height = '48px';
  }
  return height;
};
