import useConfig from './useConfig';

export default function useGlobalIcon(tdIcon: Object) {
  const { icon: globalIcon } = useConfig();

  const resultIcon = {};

  Object.keys(tdIcon).forEach((key) => {
    resultIcon[key] = globalIcon[key] || tdIcon[key];
  });

  return resultIcon;
}
