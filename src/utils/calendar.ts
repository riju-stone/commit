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

/**
 * Get the day of the week the month starts on
 * @param date - The date to check
 * @returns 0-6 (0 = Sunday, 6 = Saturday)
 */
export function getMonthStartDay(date: Date): number {
  return getDay(startOfMonth(date))
}

/**
 * Get the number of days in a month
 * @param date - The date to check
 * @returns Number of days in the month
 */
export function getMonthDays(date: Date): number {
  return getDaysInMonth(date)
}

/**
 * Generate week view data with padding for previous/next week days
 * Supports configurable week start day (Sunday or Monday)
 * 
 * @param week - Week number (1-52)
 * @param year - Full year (e.g., 2024)
 * @param weekStartDay - 0 for Sunday, 1 for Monday
 * @returns CalendarWeekView with days array containing CalendarDay objects
 */
export function generateWeekView(
  week: number,
  year: number,
  weekStartDay: WeekStartDay = 0
): CalendarWeekView {
  const currentDate = new Date(year, 0, 1)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: weekStartDay })
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: weekStartDay })
  const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
  const days: CalendarDay[] = []
  for (const date of allDays) {
    days.push({ date, day: getDate(date), month: getMonth(date), year: getYear(date), isCurrentMonth: false, isPrevMonth: false, isNextMonth: false, isToday: false })
  }
  return { week, year, days }
}

/**
 * Generate month view data with padding for previous/next month days
 * Supports configurable week start day (Sunday or Monday)
 * 
 * @param month - Month index (0-11)
 * @param year - Full year (e.g., 2024)
 * @param weekStartDay - 0 for Sunday, 1 for Monday
 * @returns CalendarMonthView with weeks array containing CalendarDay objects
 */
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

/**
 * Navigate to a different month/year
 * @param currentDate - Current date
 * @param direction - 'prev' or 'next'
 * @param unit - 'month', 'week', or 'day'
 * @returns New date after navigation
 */
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

/**
 * Get events for a specific day
 * Handles all-day events and events that span multiple days
 * 
 * @param date - The date to get events for
 * @param events - Array of calendar events
 * @returns Events occurring on that day
 */
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

/**
 * Group events by date for efficient lookup
 * Uses ISO date string (YYYY-MM-DD) as key
 * 
 * @param events - Array of calendar events
 * @returns Object with ISO date keys and arrays of events
 */
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

/**
 * Get the date key for a given date (used for event lookup)
 * @param date - Date to convert
 * @returns ISO date string (YYYY-MM-DD)
 */
export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Parse a date key back to a Date object
 * @param key - ISO date string (YYYY-MM-DD)
 * @returns Date object
 */
export function parseDateKey(key: string): Date {
  return parseISO(key)
}

/**
 * Format a date for display
 * @param date - Date to format
 * @param formatStr - date-fns format string
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatStr: string): string {
  return format(date, formatStr)
}

/**
 * Get weekday names based on week start day
 * @param weekStartDay - 0 for Sunday, 1 for Monday
 * @param formatType - 'long' (Sunday), 'short' (Sun), or 'narrow' (S)
 * @returns Array of weekday names
 */
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

/**
 * Check if two dates are in the same month and year
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same month and year
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return getMonth(date1) === getMonth(date2) && getYear(date1) === getYear(date2)
}

// Re-export commonly used date-fns functions for convenience
export {
  isToday,
  isSameDay,
  format,
  getMonth,
  getYear,
  getDate,
  addMonths,
  subMonths,
}
