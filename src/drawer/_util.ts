export enum SizeType {
  LARGE = 'large',
  MIDDLE = 'middle',
  SMALL = 'small',
}

export enum Size {
  LARGE = '760px',
  MIDDLE = '500px',
  SMALL = '300px',
}
/**
 * 根据 size 获取 style.width 或者 style.height
 * @param size 参考 DrawerProps['size']
 */
export function getWidthOrHeightBySize(size: number | string) {
  if (size === SizeType.SMALL) {
    return Size.SMALL;
  }
  if (size === SizeType.MIDDLE) {
    return Size.MIDDLE;
  }
  if (size === SizeType.LARGE) {
    return Size.LARGE;
  }

  if (typeof size === 'number') {
    // 虽然 NaN Infinity -Infinity 都是 number 类型，这里暂时不做校验。
    // TODO 后面可以单独使用 isNumber util 来判断。
    return `${size}px`;
  }

  return size;
}
