import { create } from "zustand";
import { navigateDate } from "@/utils/calendar";
import type { CalendarViewType, WeekStartDay, CalendarEvent, CalendarSource, SyncStatus } from "@/types/calendar";

interface CalendarState {
  // Single source of truth for current view date
  currentDate: Date;

  // View configuration
  calendarView: CalendarViewType;
  weekStartDay: WeekStartDay;

  // Display preferences
  showWeekNumbers: boolean;
  showYear: boolean;
  showDayNames: boolean;

  // Selected date (for day view or event creation)
  selectedDate: Date | null;

  // Event management (prepared for third-party integration)
  events: Record<string, CalendarEvent>;
  calendarSources: CalendarSource[];

  // Sync status for each calendar source
  syncStatus: Record<string, SyncStatus>;
}

interface CalendarActions {
  // Navigation actions
  navigateToDate: (date: Date) => void;
  navigateToMonth: (month: number, year: number) => void;
  navigateRelative: (direction: "prev" | "next", unit?: "month" | "week" | "day") => void;
  goToToday: () => void;

  // View configuration
  setCalendarView: (view: CalendarViewType) => void;
  setWeekStartDay: (day: WeekStartDay) => void;

  // Display preferences
  setShowWeekNumbers: (show: boolean) => void;
  setShowYear: (show: boolean) => void;
  setShowDayNames: (show: boolean) => void;

  // Selection
  // setSelectedDate: (date: Date | null) => void

  // Event management
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setEvents: (events: CalendarEvent[]) => void;

  // Calendar sources management
  addCalendarSource: (source: CalendarSource) => void;
  updateCalendarSource: (id: string, updates: Partial<CalendarSource>) => void;
  removeCalendarSource: (id: string) => void;
  toggleCalendarSource: (id: string) => void;

  // Sync status
  setSyncStatus: (sourceId: string, status: SyncStatus) => void;
}

const today = new Date();

const initialState: CalendarState = {
  currentDate: today,
  calendarView: "month",
  weekStartDay: 0, // Sunday
  showWeekNumbers: false,
  showYear: true,
  showDayNames: true,
  selectedDate: null,
  events: {},
  calendarSources: [
    // Default local calendar
    {
      id: "local-default",
      name: "My Calendar",
      provider: "local",
      color: "#3b82f6", // Blue
      enabled: true,
    },
  ],
  syncStatus: {},
};

export const useCalendarStore = create<CalendarState & CalendarActions>((set, get) => ({
  ...initialState,

  navigateToDate: (date: Date) => {
    set({ currentDate: date });
  },

  navigateToMonth: (month: number, year: number) => {
    set({ currentDate: new Date(year, month, 1) });
  },

  navigateRelative: (direction: "prev" | "next", unit?: "month" | "week" | "day") => {
    const { currentDate, calendarView } = get();
    // Use the current view's unit if not specified
    const navigationUnit = unit || (calendarView === "month" ? "month" : calendarView);
    const newDate = navigateDate(currentDate, direction, navigationUnit);
    set({ currentDate: newDate });
  },

  goToToday: () => {
    set({ currentDate: new Date() });
  },

  setCalendarView: (view: CalendarViewType) => {
    set({ calendarView: view });
  },

  setWeekStartDay: (day: WeekStartDay) => {
    set({ weekStartDay: day });
  },

  setShowWeekNumbers: (show: boolean) => {
    set({ showWeekNumbers: show });
  },

  setShowYear: (show: boolean) => {
    set({ showYear: show });
  },

  setShowDayNames: (show: boolean) => {
    set({ showDayNames: show });
  },

  addEvent: (event: CalendarEvent) => {
    set((state) => ({
      events: {
        ...state.events,
        [event.id]: event,
      },
    }));
  },

  updateEvent: (id: string, updates: Partial<CalendarEvent>) => {
    set((state) => {
      const existingEvent = state.events[id];
      if (!existingEvent) return state;

      return {
        events: {
          ...state.events,
          [id]: {
            ...existingEvent,
            ...updates,
            updatedAt: new Date(),
          },
        },
      };
    });
  },

  deleteEvent: (id: string) => {
    set((state) => {
      const { [id]: deleted, ...remaining } = state.events;
      return { events: remaining };
    });
  },

  setEvents: (events: CalendarEvent[]) => {
    const eventsRecord: Record<string, CalendarEvent> = {};
    for (const event of events) {
      eventsRecord[event.id] = event;
    }
    set({ events: eventsRecord });
  },

  addCalendarSource: (source: CalendarSource) => {
    set((state) => ({
      calendarSources: [...state.calendarSources, source],
    }));
  },

  updateCalendarSource: (id: string, updates: Partial<CalendarSource>) => {
    set((state) => ({
      calendarSources: state.calendarSources.map((source) => (source.id === id ? { ...source, ...updates } : source)),
    }));
  },

  removeCalendarSource: (id: string) => {
    set((state) => ({
      calendarSources: state.calendarSources.filter((source) => source.id !== id),
      // Also remove events from this source
      events: Object.fromEntries(Object.entries(state.events).filter(([_, event]) => event.calendarId !== id)),
    }));
  },

  toggleCalendarSource: (id: string) => {
    set((state) => ({
      calendarSources: state.calendarSources.map((source) =>
        source.id === id ? { ...source, enabled: !source.enabled } : source,
      ),
    }));
  },

  setSyncStatus: (sourceId: string, status: SyncStatus) => {
    set((state) => ({
      syncStatus: {
        ...state.syncStatus,
        [sourceId]: status,
      },
    }));
  },
}));
