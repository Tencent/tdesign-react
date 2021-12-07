import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import React from 'react';
import { TNode } from '../common';

export const getDefaultValue = <T>(value: T | T[], defaultValue?: T): T[] => {
  if (isEmpty(value)) {
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue, defaultValue];
  }

  if (Array.isArray(value)) return value;

  return [defaultValue, defaultValue];
};

export const getJSX = (value: string | TNode) => {
  if (isString(value)) return value;

  if (isFunction(value)) return value();

  if (React.isValidElement(value)) return value;

  return value;
};
