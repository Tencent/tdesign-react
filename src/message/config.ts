// 全局默认配置，zIndex 为 5000，默认关闭时间 3000ms
import { AttachNode } from 'tdesign-react/common';
import { MessagePlacementList } from 'tdesign-react';

/**
 * @name: globalConfig
 * @description: message 组件全局的默认配置
 * */
export const globalConfig = {
  zIndex: 5000,
  placement: 'top' as MessagePlacementList,
  attach: 'body' as AttachNode,
  offset: [0, 0] as Array<string | number>,
  duration: 3000,
  top: 32,
};

/**
 * @name: setGlobalConfig
 * @description: 设置全局配置
 * */
export const setGlobalConfig = (
  placement: MessagePlacementList,
  attach: AttachNode,
  offset: Array<string | number>,
  zIndex: number,
) => {
  globalConfig.placement = placement;
  globalConfig.attach = attach;
  globalConfig.offset = offset;
  globalConfig.zIndex = zIndex;
};
