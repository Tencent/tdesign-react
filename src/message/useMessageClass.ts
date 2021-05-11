import useConfig from '../_util/useConfig';

/**
 * @author kenzyyang
 * @date 2021-05-11 19:55:58
 * @desc 部分描述
 */
export function useMessageClass() {
  const { classPrefix } = useConfig();
  const tdMessagePrefix = `${classPrefix}-message`;
  const classIsGenerator = (append: string) => `${classPrefix}-is-${append}`;
  const tdMessageClassGenerator = (append: string) => `${classPrefix}-${append}`;

  return {
    tdMessagePrefix,
    classIsGenerator,
    tdMessageClassGenerator,
  };
}
