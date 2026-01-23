import {
  startOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getDay,
  getDaysInMonth,
  getDate,
  getMonth,
  getYear,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
  parseISO,
  getWeek,
  addMinutes,
  endOfDay,
  startOfDay,
} from 'date-fns'

import type {
  CalendarDay,
  CalendarWeek,
  CalendarMonthView,
  WeekStartDay,
  CalendarEvent,
  EventsByDate,
  CalendarWeekView,
} from '@/types/calendar'

// Number of weeks to display in month view (6 weeks = 42 days)
const WEEKS_IN_MONTH_VIEW = 6

export function getMonthStartDay(date: Date): number {
  return getDay(startOfMonth(date))
}

export function getMonthDays(date: Date): number {
  return getDaysInMonth(date)
}

export function generateDailyTimeSlots(date: Date, intervalMinutes: number = 30): { start: Date, end: Date }[] {
  const timeSlots: { start: Date, end: Date }[] = []
  const startDate = startOfDay(date)
  const endDate = endOfDay(date)
  for (let time = startDate; time < endDate; time = addMinutes(time, intervalMinutes)) {
    timeSlots.push({
      start: time,
      end: addMinutes(time, intervalMinutes),
    })
  }
  return timeSlots as { start: Date, end: Date }[]
}

export function generateWeekView(currentDate: Date): CalendarWeekView {
  // Get an array of CalendarDay objects for the current week
  const days = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate)
  })

  return {
    week: getWeek(currentDate),
    year: getYear(currentDate),
    days: days.map((date) => ({
      date,
      day: getDate(date),
      month: getMonth(date),
      year: getYear(date),
      week: getWeek(date),
      weekDay: format(date, 'EEEE'),
      isCurrentMonth: getMonth(date) === getMonth(currentDate) && getYear(date) === getYear(currentDate),
      isPrevMonth: getMonth(date) < getMonth(currentDate),
      isNextMonth: getMonth(date) > getMonth(currentDate),
      isToday: isToday(date)
    }))
  }
}

export function generateMonthView(
  month: number,
  year: number,
  weekStartDay: WeekStartDay = 0
): CalendarMonthView {
  const currentDate = new Date(year, month, 1)
  const monthStart = startOfMonth(currentDate)

  // Get the start of the calendar grid (may include days from previous month)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: weekStartDay })

  // Get the end of the calendar grid (may include days from next month)
  // We need exactly 6 weeks (42 days) for consistent grid layout
  const calendarEnd = endOfWeek(
    addWeeks(calendarStart, WEEKS_IN_MONTH_VIEW - 1),
    { weekStartsOn: weekStartDay }
  )

  // Generate all days in the calendar view
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Convert to CalendarDay objects and group into weeks
  const weeks: CalendarWeek[] = []
  let currentWeek: CalendarDay[] = []

  for (const date of allDays) {
    const dayMonth = getMonth(date)
    const dayYear = getYear(date)

    const calendarDay: CalendarDay = {
      date: date,
      day: getDate(date),
      month: dayMonth,
      year: dayYear,
      week: getWeek(date),
      weekDay: format(date, 'EEEE'),
      isCurrentMonth: dayMonth === month && dayYear === year,
      isPrevMonth: dayYear < year || (dayYear === year && dayMonth < month),
      isNextMonth: dayYear > year || (dayYear === year && dayMonth > month),
      isToday: isToday(date),
    }

    currentWeek.push(calendarDay)

    // When we have 7 days, push the week and start a new one
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  return {
    month,
    year,
    weeks,
  }
}

export function navigateDate(
  currentDate: Date,
  direction: 'prev' | 'next',
  unit: 'month' | 'week' | 'day'
): Date {
  const navigators = {
    month: { prev: subMonths, next: addMonths },
    week: { prev: subWeeks, next: addWeeks },
    day: { prev: subDays, next: addDays },
  }

  return navigators[unit][direction](currentDate, 1)
}

export function getEventsForDay(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter((event) => {
    // Check if the event starts on this day
    if (isSameDay(event.startDate, date)) {
      return true
    }

    // Check if this day falls within a multi-day event
    if (event.startDate <= date && event.endDate >= date) {
      return true
    }

    return false
  })
}

export function groupEventsByDate(events: CalendarEvent[]): EventsByDate {
  const grouped: EventsByDate = {}

  for (const event of events) {
    // Get all days the event spans
    const days = eachDayOfInterval({
      start: event.startDate,
      end: event.endDate,
    })

    for (const day of days) {
      const key = format(day, 'yyyy-MM-dd')
      if (!grouped[key]) {
        grouped[key] = []
      }
      // Avoid duplicates
      if (!grouped[key].find((e) => e.id === event.id)) {
        grouped[key].push(event)
      }
    }
  }

  return grouped
}

export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function parseDateKey(key: string): Date {
  return parseISO(key)
}

export function formatDate(date: Date, formatStr: string): string {
  return format(date, formatStr)
}

export function getWeekdayNames(
  weekStartDay: WeekStartDay = 0,
  formatType: 'long' | 'short' | 'narrow' = 'long'
): string[] {
  const baseDate = new Date(2024, 0, 7) // A Sunday
  const weekStart = startOfWeek(baseDate, { weekStartsOn: weekStartDay })

  const formatMap = {
    long: 'EEEE',
    short: 'EEE',
    narrow: 'EEEEE',
  }

  return eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  }).map((day) => format(day, formatMap[formatType]))
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return getMonth(date1) === getMonth(date2) && getYear(date1) === getYear(date2)
}
