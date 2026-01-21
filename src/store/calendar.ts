import { create } from 'zustand'
import moment from 'moment'
import { generateMonthViewWithPadding, getMonthStartDay } from '@/utils/calendar'

export type CalendarMonthView = {
  day: number,
  month: number
  year: number
  viewData: {
    [key: number]: Array<{
      day: number,
      isPrevMonth?: boolean,
      isCurrentMonth: boolean,
      isNextMonth?: boolean
    }>
  }
}

interface CalendarState {
  currentMonth: number
  currentYear: number
  calendarMonthView: CalendarMonthView
  currentMonthStartDay: number
  calendarView: 'month' | 'week' | 'day'
  weekStartDay: 'sunday' | 'monday'
  showWeekNumbers: boolean
  showYear: boolean
  showDayNames: boolean
}

interface CalendarActions {
  setCurrentMonth: (month: number) => void
  setCurrentYear: (year: number) => void
  setCalendarMonthView: (monthView: CalendarMonthView) => void
  setCurrentMonthStartDay: (startDay: number) => void
  setCalendarView: (view: 'month' | 'week' | 'day') => void
  setWeekStartDay: (day: 'sunday' | 'monday') => void
  setShowWeekNumbers: (show: boolean) => void
  setShowYear: (show: boolean) => void
  setShowDayNames: (show: boolean) => void
}

const initialState: CalendarState = {
  currentMonth: moment().month(),
  currentYear: moment().year(),
  calendarMonthView: generateMonthViewWithPadding(moment().month(), moment().year()),
  currentMonthStartDay: getMonthStartDay(moment()),
  calendarView: 'month',
  weekStartDay: 'sunday',
  showWeekNumbers: false,
  showYear: true,
  showDayNames: true,
}

export const useCalendarStore = create<CalendarState & CalendarActions>((set) => ({
  ...initialState,
  setCurrentMonth: (month: number) => set({ currentMonth: month }),
  setCurrentYear: (year: number) => set({ currentYear: year }),
  setCalendarMonthView: (monthView: CalendarMonthView) => set({ calendarMonthView: monthView }),
  setCurrentMonthStartDay: (startDay: number) => set({ currentMonthStartDay: startDay }),
  setCalendarView: (view: 'month' | 'week' | 'day') => set({ calendarView: view }),
  setWeekStartDay: (day: 'sunday' | 'monday') => set({ weekStartDay: day }),
  setShowWeekNumbers: (show: boolean) => set({ showWeekNumbers: show }),
  setShowYear: (show: boolean) => set({ showYear: show }),
  setShowDayNames: (show: boolean) => set({ showDayNames: show }),
}))