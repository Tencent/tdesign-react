import useConfig from '../../hooks/useConfig';

const useClassNames = () => {
  const { classPrefix } = useConfig();
  const baseClassName = `${classPrefix}-color-picker`;
  return baseClassName;
};

export default useClassNames;
