import useConfig from '../../_util/useConfig';

const useClassname = () => {
  const { classPrefix } = useConfig();
  const baseClassName = `${classPrefix}-color-picker`;
  return baseClassName;
};

export default useClassname;
