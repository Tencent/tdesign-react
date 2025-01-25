const toLowercaseSeparator = (key: string) => key.replace(/([A-Z])/g, '-$1').toLowerCase();

// style对象转字符串
export const getStyleStr = (style: React.CSSProperties): string =>
  Object.keys(style)
    .map((key: keyof React.CSSProperties) => `${toLowercaseSeparator(key)}: ${style[key]};`)
    .join(' ');
