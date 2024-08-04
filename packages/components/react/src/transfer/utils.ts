import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import React from 'react';
import { DataOption, TransferValue } from './type';
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

// 获取所有叶子节点
export const getLeafNodes = (nodes: DataOption[]): DataOption[] => {
  const resData = [];
  const map = (nodes: DataOption[]) => {
    nodes.forEach((child) => {
      if (child.children && child.children.length > 0) {
        return map(child.children);
      }
      resData.push(child);
    });
  };
  map(nodes);
  return resData;
};

// tree 过滤 checkeds 数组中的 key
export const filterCheckedTreeNodes = (nodes: DataOption[], checkeds: TransferValue[]): DataOption[] =>
  nodes
    .filter((item) => !checkeds.includes(item.value))
    .map((item) => {
      const newItem = { ...item };
      if (item.children && item.children.length > 0) {
        newItem.children = filterCheckedTreeNodes(item.children, checkeds);
      }
      return newItem;
    })
    .filter((item) => (item.children && item.children.length !== 0) || !item.children);

// 获取目的树结构
export const getTargetNodes = (sourceNodes: DataOption[], data: DataOption[]): DataOption[] => {
  const source = getLeafNodes(sourceNodes).map((item) => item.value);
  return filterCheckedTreeNodes(data, source);
};
