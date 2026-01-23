import { useDailyTimeSlots, useWeekViewData } from '@/hooks/calendar'
import { format, isToday, isWithinInterval } from 'date-fns'

function CalendarWeekView() {
  const weekViewData = useWeekViewData()
  const timeSlots = useDailyTimeSlots(90)

  const currentTimeIsInTimeSlot = (timeSlot: { start: Date, end: Date }) => {
    return isWithinInterval(new Date(), { start: timeSlot.start, end: timeSlot.end })
  }

  return <div key={`week-${weekViewData.week}`} className='flex-1 h-0 w-full bg-transparent rounded-lg overflow-hidden flex flex-col border-2 border-white/20'>
    {/* Calendar weekday header */}
    <div className='border-b-2 border-white/20 flex'>
      <div className='w-[100px] px-4 py-2 text-sm border-r-2 last:border-r-0 border-white/20'>Time</div>
      <div className='flex-1'>
        <div className='text-center flex text-lg'>
          {weekViewData.days.map((day) => (
            <div
              key={day.date.toISOString()}
              className={
                `flex-1 p-1 text-sm border-r-2 last:border-r-0 border-white/20
            ${day.isCurrentMonth ? 'bg-transparent' : 'bg-white/10 text-white/50'}
            ${day.isToday ? 'bg-white/30 text-black font-bold' : 'bg-transparent'}
            `}>{day.weekDay}</div>
          ))}
        </div>
        <div className='flex-1 flex text-center'>
          {weekViewData.days.map((day) => (
            <div
              key={day.date.toISOString()}
              className={
                `flex-1 p-1 text-lg border-r-2 last:border-r-0 border-white/20
              ${isToday(day.date) ? 'bg-white/30 text-black font-bold' : 'bg-transparent'}
              `
              }>{day.day}</div>
          ))}
        </div>
      </div>
    </div>
    {/* Calendar week view where each row is a time slot */}
    <div className='flex-1 flex flex-col overflow-y-auto overscroll-none'>
      {timeSlots.map((timeSlot) => (
        <div key={timeSlot.start.toISOString()} className='flex-1 flex border-b-2 border-white/20 last:border-b-0'>
          <div className={
            `w-[100px] px-2 py-2 text-sm border-r-2 last:border-r-0 border-white/20
            ${currentTimeIsInTimeSlot(timeSlot) ? 'bg-white/30 text-black font-bold' : 'bg-transparent'}
            `
          }>
            {format(timeSlot.start, 'hh:mm a')}
          </div>

          {weekViewData.days.map((day) => (
            <div key={`${day.date.toISOString()}-${timeSlot.start.toISOString()}-${timeSlot.end.toISOString()}`}
              className={
                `flex-1 p-1 min-h-[100px] text-sm border-r-2 last:border-r-0 border-white/20
                ${currentTimeIsInTimeSlot(timeSlot) ? 'bg-white/10 text-black font-bold' : 'bg-transparent'}
                `
              }>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
}

export default CalendarWeekView