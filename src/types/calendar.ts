// Calendar Provider Types
export type CalendarProvider = 'local' | 'google' | 'apple' | 'outlook'

// Recurrence rule for repeating events
export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number // e.g., every 2 weeks
  endDate?: Date
  count?: number // number of occurrences
  daysOfWeek?: number[] // 0-6 for weekly recurrence
  dayOfMonth?: number // for monthly recurrence
}

// Reminder configuration
export interface Reminder {
  id: string
  minutesBefore: number
  method: 'notification' | 'email'
}

// Calendar event type - designed for third-party integration
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  allDay: boolean
  provider: CalendarProvider
  providerId?: string // External calendar's event ID for sync
  calendarId: string
  color?: string
  location?: string
  recurrence?: RecurrenceRule
  reminders?: Reminder[]
  attendees?: EventAttendee[]
  isRecurringInstance?: boolean
  recurringEventId?: string // Parent event ID for recurring instances
  status?: 'confirmed' | 'tentative' | 'cancelled'
  createdAt?: Date
  updatedAt?: Date
}

// Event attendee for meeting invites
export interface EventAttendee {
  email: string
  name?: string
  responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction'
  isOrganizer?: boolean
}

// Calendar source/account configuration
export interface CalendarSource {
  id: string
  name: string
  provider: CalendarProvider
  color: string
  enabled: boolean
  accountEmail?: string // For third-party accounts
  lastSynced?: Date
  syncError?: string
}

// Individual day cell in calendar view
export interface CalendarDay {
  date: Date // Full date for easy event matching
  day: number
  month: number
  year: number
  isCurrentMonth: boolean
  isPrevMonth: boolean
  isNextMonth: boolean
  isToday: boolean
}

// Week row in month view
export type CalendarWeek = CalendarDay[]

// Week view data structure
export interface CalendarWeekView {
  week: number
  year: number
  days: CalendarDay[]
}

// Month view data structure
export interface CalendarMonthView {
  month: number
  year: number
  weeks: CalendarWeek[]
}

// Calendar view type
export type CalendarViewType = 'month' | 'week'

// Week start day (0 = Sunday, 1 = Monday)
export type WeekStartDay = 0 | 1

// Sync status for calendar sources
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'success'

// Helper type for events grouped by date (ISO date string key)
export type EventsByDate = Record<string, CalendarEvent[]>

// Helper function type for getting events for a specific day
export type GetEventsForDay = (date: Date, events: CalendarEvent[]) => CalendarEvent[]
