import { create } from 'zustand'
import moment from 'moment'
import { generateMonthViewWithPadding, getMonthStartDay } from '@/utils/calendar'

interface CalendarState {
  currentMonth: number
  currentYear: number
  calendarMonthView: {
    month: number
    year: number
    startDayName: string
    days: { day: number, isPrevMonth?: boolean, isCurrentMonth?: boolean, isNextMonth?: boolean }[]
  }
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
  setCalendarMonthView: (monthView: { month: number, year: number, startDayName: string, days: { day: number, isPrevMonth?: boolean, isCurrentMonth?: boolean, isNextMonth?: boolean }[] }) => void
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
  calendarMonthView: {
    month: moment().month(),
    year: moment().year(),
    startDayName: moment().startOf('month').format('ddd'),
    days: generateMonthViewWithPadding(moment().month(), moment().year()).days,
  } as { month: number, year: number, startDayName: string, days: { day: number, isPrevMonth?: boolean, isCurrentMonth?: boolean, isNextMonth?: boolean }[] },
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
  setCalendarMonthView: (monthView: { month: number, year: number, startDayName: string, days: { day: number, isPrevMonth?: boolean, isCurrentMonth?: boolean, isNextMonth?: boolean }[] }) => set({ calendarMonthView: monthView }),
  setCurrentMonthStartDay: (startDay: number) => set({ currentMonthStartDay: startDay }),
  setCalendarView: (view: 'month' | 'week' | 'day') => set({ calendarView: view }),
  setWeekStartDay: (day: 'sunday' | 'monday') => set({ weekStartDay: day }),
  setShowWeekNumbers: (show: boolean) => set({ showWeekNumbers: show }),
  setShowYear: (show: boolean) => set({ showYear: show }),
  setShowDayNames: (show: boolean) => set({ showDayNames: show }),
}))