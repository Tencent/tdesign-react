import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { DisableDate } from './type';

dayjs.extend(isBetween);

export function isEnabledDate({
  value,
  disableDate,
  mode,
  format,
}: {
  value: Date;
  mode: 'year' | 'month' | 'date';
  format: string;
  disableDate: DisableDate;
}): boolean {
  if (!disableDate) return true;

  let isEnabled = true;
  // 值类型为 Function 则表示返回值为 true 的日期会被禁用
  if (typeof disableDate === 'function') {
    return !disableDate(value);
  }

  // 禁用日期，示例：['A', 'B'] 表示日期 A 和日期 B 会被禁用。
  if (Array.isArray(disableDate)) {
    let isIncludes = false;
    const formatedDisabledDate = disableDate.map((item: string) => dayjs(item, format));
    formatedDisabledDate.forEach((item) => {
      if (item.isSame(dayjs(value))) {
        isIncludes = true;
      }
    });
    return !isIncludes;
  }

  // { from: 'A', to: 'B' } 表示在 A 到 B 之间的日期会被禁用。
  const { from, to, before, after } = disableDate;
  if (from && to) {
    const compareMin = dayjs(new Date(from));
    const compareMax = dayjs(new Date(to));

    return !dayjs(value).isBetween(compareMin, compareMax, mode, '[]');
  }

  const min = before ? new Date(before) : null;
  const max = after ? new Date(after) : null;

  // { before: 'A', after: 'B' } 表示在 A 之前和在 B 之后的日期都会被禁用。
  if (max && min) {
    const compareMin = dayjs(new Date(min));
    const compareMax = dayjs(new Date(max));

    isEnabled = dayjs(value).isBetween(compareMin, compareMax, mode, '[]');
  } else if (min) {
    const compareMin = dayjs(new Date(min));
    isEnabled = !dayjs(value).isBefore(compareMin, mode);
  } else if (max) {
    const compareMax = dayjs(new Date(max));
    isEnabled = !dayjs(value).isAfter(compareMax, mode);
  }
  return isEnabled;
}
