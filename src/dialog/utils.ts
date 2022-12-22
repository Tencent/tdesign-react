export function parseValueToPx(value) {
  if (typeof value === 'number') return `${value}px`;
  return value;
}
