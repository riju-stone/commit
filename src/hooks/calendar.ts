import { useCalendarStore } from "@/store/calendarStore"
import { CalendarMonthView, CalendarEvent, CalendarWeekView } from "@/types/calendar"
import { useMemo } from "react"
import { getMonth, getYear } from "date-fns"
import { generateDailyTimeSlots, generateMonthView, generateTimelineDays, generateWeekView, getWeekdayNames } from "@/utils/calendar"

/**
 * Hook to get the current month view data
 */
export function useMonthViewData(): CalendarMonthView {
  const currentDate = useCalendarStore((state) => state.currentDate)
  const weekStartDay = useCalendarStore((state) => state.weekStartDay)

  return useMemo(
    () => generateMonthView(getMonth(currentDate), getYear(currentDate), weekStartDay),
    [currentDate, weekStartDay]
  )
}

/**
 * Hook to get weekday names based on current week start setting
 */
export function useWeekdayNames(formatType: 'long' | 'short' | 'narrow' = 'long'): string[] {
  const weekStartDay = useCalendarStore((state) => state.weekStartDay)
  return useMemo(() => getWeekdayNames(weekStartDay, formatType),
    [weekStartDay, formatType])
}

export function useWeekViewData(): CalendarWeekView {
  const currentDate = useCalendarStore((state) => state.currentDate)

  return useMemo(
    () => generateWeekView(currentDate),
    [currentDate]
  )
}

export function useDailyTimeSlots(intervalMinutes: number = 120): { start: Date, end: Date }[] {
  const currentDate = useCalendarStore((state) => state.currentDate)
  return useMemo(() => generateDailyTimeSlots(currentDate, intervalMinutes), [currentDate])
}

export function useTimelineDays(startDate: Date, days: number): Record<string, Date[]> {
  return useMemo(() => generateTimelineDays(startDate, days), [startDate, days])
}

/**
 * Hook to get events as an array (filtered by enabled sources)
 */
export function useVisibleEvents(): CalendarEvent[] {
  const events = useCalendarStore((state) => state.events)
  const calendarSources = useCalendarStore((state) => state.calendarSources)

  return useMemo(() => {
    const enabledSourceIds = new Set(
      calendarSources.filter((s) => s.enabled).map((s) => s.id)
    )
    return Object.values(events).filter((event) =>
      enabledSourceIds.has(event.calendarId)
    )
  }, [events, calendarSources])
}

/**
 * Hook to get current month and year (convenience)
 */
export function useCurrentMonthYear(): { month: number; year: number } {
  const currentDate = useCalendarStore((state) => state.currentDate)

  return useMemo(
    () => ({
      month: getMonth(currentDate),
      year: getYear(currentDate),
    }),
    [currentDate]
  )
}
