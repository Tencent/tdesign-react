export const useColor = (
  color: string | string[],
  defaultCheckColor: string = null,
  defaultUnCheckColor: string = null,
): string[] => {
  const tmpColor = color instanceof Array ? color : [color];
  const [checkColor = defaultCheckColor, unCheckColor = defaultUnCheckColor] = tmpColor;
  return [checkColor, unCheckColor];
};

export default useColor;
