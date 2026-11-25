import { isNumber } from 'lodash-es';

export interface nearestParams {
  items: number[]; // 一组数字
  target: number; // 指定数字
  direction?: -1 | 1; // 是否增减，-1减，1增
  threshold?: number | string; // 触发阀值，可以是百分之'50%',也可以是具体的数字
}

/**
 * 查找一组数字当中指定数字的区间，根据增减和阀值规则得到最接近的数字
 * 可用于swipe-cell、swiper、slider、pick-view等滑动释放后自动调整位置的判断
 */
export default function nearest(params: nearestParams) {
  const { target, direction } = params;
  let { items, threshold = '50%' } = params;
  items = params.items.sort((a, b) => a - b);
  const count = items.length;
  const firstitem = items[0];
  const lastItem = items[count - 1];
  if (target <= firstitem) return firstitem;
  if (target >= lastItem) return lastItem;
  const smallerIndex = items.findIndex((_, index) => target <= items[index + 1]);
  const largerIndex = smallerIndex + 1;
  const smallerItem = items[smallerIndex];
  const largerItem = items[largerIndex];
  if (smallerItem === target) return target;
  if (smallerIndex === -1) return firstitem;
  if (smallerIndex === count - 1) return lastItem;
  if (![-1, 1].includes(direction)) {
    return largerItem - target >= target - smallerItem ? smallerItem : largerItem;
  }
  if (!isNumber(threshold)) {
    threshold = (largerItem - smallerItem) * (parseFloat(threshold) / 100);
  }
  if (direction === 1) {
    return target - smallerItem >= threshold ? largerItem : smallerItem;
  }
  return largerItem - target >= threshold ? smallerItem : largerItem;
}
