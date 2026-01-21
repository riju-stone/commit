import moment from "moment";
import type { CalendarMonthView as CalendarMonthViewType } from "@/store/calendar";

const CALENDAR_MONTH_DAYS = 42;

export function getMonthStartDay(date: moment.Moment) {
  return moment(date).startOf('month').day()
}

export function getMonthDays(date: moment.Moment) {
  return moment(date).daysInMonth();
}

export function generateMonthViewWithPadding(month: number, year: number): CalendarMonthViewType {
  const date = moment([year, month]);
  const currMonthStartDay = getMonthStartDay(date);
  const currMonthDays = getMonthDays(date);
  const prevMonthDays = getMonthDays(moment(date).subtract(1, 'month'));
  const monthViewWithPadding = [];
  const viewData: CalendarMonthViewType['viewData'] = {};

  if (currMonthStartDay !== 0) {
    for (let i = 0; i < currMonthStartDay; i++) {
      let dayNumber = prevMonthDays - currMonthStartDay + i + 1;
      monthViewWithPadding.push({
        day: dayNumber,
        isToday: false,
        isPrevMonth: true,
        isCurrentMonth: false,
        isNextMonth: false
      });
    }
  }

  for (let i = 0; i < currMonthDays; i++) {
    monthViewWithPadding.push({
      day: i + 1,
      isPrevMonth: false,
      isCurrentMonth: true,
      isNextMonth: false
    });
  }

  let nextMonthDay = 1;
  while (monthViewWithPadding.length < CALENDAR_MONTH_DAYS) {
    monthViewWithPadding.push({
      day: nextMonthDay,
      isToday: false,
      isPrevMonth: false,
      isCurrentMonth: false,
      isNextMonth: true
    });
    nextMonthDay++;
  }

  // Take the monthViewWithPadding and convert it to the viewData format
  for (let i = 0; i < monthViewWithPadding.length; i++) {
    const weekNumber = Math.floor(i / 7);
    if (!viewData[weekNumber]) {
      viewData[weekNumber] = [];
    }
    viewData[weekNumber].push(monthViewWithPadding[i]);
  }

  return {
    day: moment().date(),
    month: moment().month(),
    year: moment().year(),
    viewData: viewData,
  };
}