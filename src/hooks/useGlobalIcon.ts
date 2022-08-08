import useConfig from './useConfig';
import { IconConfig } from '../config-provider/type';

// 从 globalConfig 获取 icon 配置用于覆盖组件内置 icon
export default function useGlobalIcon(tdIcon: IconConfig) {
  const { icon: globalIcon } = useConfig();

  const resultIcon: IconConfig = {};

  Object.keys(tdIcon).forEach((key) => {
    resultIcon[key] = globalIcon?.[key] || tdIcon[key];
  });

  return resultIcon;
}
