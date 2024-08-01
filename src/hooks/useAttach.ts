import { useMemo } from 'react';
import { AttachNode } from '../common';
import useConfig from './useConfig';

const defaultAttach = 'body';
/**
 * useAttach
 *
 * 挂载节点 优先级:
 *
 * props attach -> globalConfig.attach.component -> globalConfig.attach -> default = 'body'
 */
const useAttach = (name: string, attach: AttachNode) => {
  const globalConfig = useConfig();

  const attachVal = useMemo<AttachNode>(
    () => attach || globalConfig?.attach?.[name] || globalConfig?.attach || defaultAttach,
    [name, attach, globalConfig?.attach],
  );

  return attachVal;
};

export default useAttach;
