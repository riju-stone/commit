import CalendarControls from './controls'
import CalendarMonthView from './month-view'

function CalendarComponent() {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-3'>
      <CalendarControls />
      <CalendarMonthView />
    </div>
  )
}

export default CalendarComponent