import { TCalendarValue } from './type';

export function getMonthByOffset(date: TCalendarValue, offset: number) {
  const innerDate = new Date(date);
  innerDate.setMonth(innerDate.getMonth() + offset);
  innerDate.setDate(1);
  return innerDate;
}

export function getYearByOffset(date: TCalendarValue, offset: number) {
  const innerDate = new Date(date);
  innerDate.setFullYear(innerDate.getFullYear() + offset);
  innerDate.setDate(1);
  return innerDate;
}

export const getPrevMonth = (date: TCalendarValue) => getMonthByOffset(date, -1);
export const getNextMonth = (date: TCalendarValue) => getMonthByOffset(date, 1);
export const getPrevYear = (date: TCalendarValue) => getYearByOffset(date, -1);
export const getNextYear = (date: TCalendarValue) => getYearByOffset(date, 1);
