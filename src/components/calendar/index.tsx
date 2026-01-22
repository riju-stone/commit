import CalendarControls from './controls'
import CalendarMonthView from './month-view'
import { useCalendarStore } from '@/store/calendarStore'
import CalendarWeekView from './week-view'

function CalendarComponent() {
  const calendarView = useCalendarStore((state) => state.calendarView)
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-3'>
      <CalendarControls />
      {calendarView === 'month' ? <CalendarMonthView /> : <CalendarWeekView />}
    </div>
  )
}

export default CalendarComponent