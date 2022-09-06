import useConfig from '../hooks/useConfig';
import { MessagePlacementList } from './type';

/**
 * @author kenzyyang
 * @date 2021-05-11 19:55:58
 * @desc message 组件相关的样式生成函数
 */
export function useMessageClass() {
  const { classPrefix } = useConfig();
  // message 样式前缀
  const tdMessagePrefix = `${classPrefix}-message`;
  // message list(message 内容区的样式名)
  const tdMessageListClass = `${tdMessagePrefix}__list`;
  const tdClassIsGenerator = (append: string) => `${classPrefix}-is-${append}`;
  const tdMessageClassGenerator = (append: string) => `${tdMessagePrefix}__${append}`;
  const tdMessagePlacementClassGenerator = (placement: MessagePlacementList) =>
    `${tdMessagePrefix}-placement--${placement}`;

  return {
    tdMessagePrefix,
    tdMessageListClass,
    tdClassIsGenerator,
    tdMessageClassGenerator,
    tdMessagePlacementClassGenerator,
  };
}
