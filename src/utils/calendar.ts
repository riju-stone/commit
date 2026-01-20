import moment from "moment";

const CALENDAR_MONTH_DAYS = 35;

export function getMonthStartDay(date: moment.Moment) {
  return moment(date).startOf('month').day()
}

export function getMonthDays(date: moment.Moment) {
  return moment(date).daysInMonth();
}

export function generateMonthViewWithPadding(month: number, year: number) {
  const date = moment([year, month]);
  const currMonthStartDay = getMonthStartDay(date);
  const startDayName = moment(date).startOf('month').format('ddd');
  const currMonthDays = getMonthDays(date);
  const prevMonthDays = getMonthDays(moment(date).subtract(1, 'month'));
  const nextMonthDays = getMonthDays(moment(date).add(1, 'month'));
  const monthViewWithPadding: { day: number, isPrevMonth?: boolean, isCurrentMonth?: boolean, isNextMonth?: boolean }[] = [];

  console.log(currMonthStartDay, startDayName, currMonthDays, prevMonthDays, nextMonthDays);

  if (currMonthStartDay !== 0) {
    for (let i = 0; i < currMonthStartDay; i++) {
      monthViewWithPadding.push({ day: prevMonthDays - currMonthStartDay + i + 1, isPrevMonth: true, isCurrentMonth: false, isNextMonth: false });
    }
  }

  for (let i = 0; i < currMonthDays; i++) {
    monthViewWithPadding.push({ day: i + 1, isPrevMonth: false, isCurrentMonth: true, isNextMonth: false });
  }

  let nextMonthDay = 1;
  while (monthViewWithPadding.length < CALENDAR_MONTH_DAYS && nextMonthDay <= nextMonthDays) {
    monthViewWithPadding.push({ day: nextMonthDay, isPrevMonth: false, isCurrentMonth: false, isNextMonth: true });
    nextMonthDay++;
  }

  const calendarData = {
    "month": month,
    "year": year,
    "startDayName": startDayName,
    "days": monthViewWithPadding,
  }

  return calendarData;
}