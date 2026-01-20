import moment from 'moment'
import { generateMonthViewWithPadding } from '@/utils/calendar';
import { useCalendarStore } from '@/store/calendar';
import { useEffect } from 'react';

function CalendarMonthView() {
  const { weekStartDay, calendarMonthView, currentMonth, currentYear, setCalendarMonthView } = useCalendarStore()

  useEffect(() => {
    setCalendarMonthView(generateMonthViewWithPadding(currentMonth, currentYear))
  }, [currentMonth, currentYear])

  return (
    <div className='flex-1 h-0 w-full bg-transparent rounded-lg overflow-hidden py-3 px-4 flex flex-col'>
      {/* Calendar weekday header */}
      <div className='text-center flex justify-between text-lg gap-0'>
        <div className='flex-1 pb-2'>{weekStartDay === 'sunday' ? 'Sunday' : 'Monday'}</div>
        <div className='flex-1 pb-2'>{weekStartDay === 'sunday' ? 'Monday' : 'Sunday'}</div>
        <div className='flex-1 pb-2'>{weekStartDay === 'sunday' ? 'Tuesday' : 'Monday'}</div>
        <div className='flex-1 pb-2'>{weekStartDay === 'sunday' ? 'Wednesday' : 'Tuesday'}</div>
        <div className='flex-1 pb-2'>{weekStartDay === 'sunday' ? 'Thursday' : 'Wednesday'}</div>
        <div className='flex-1 pb-2'>{weekStartDay === 'sunday' ? 'Friday' : 'Thursday'}</div>
        <div className='flex-1 pb-2'>{weekStartDay === 'sunday' ? 'Saturday' : 'Friday'}</div>
      </div>
      <div className='flex-1 grid grid-cols-7 auto-rows-fr'>
        {calendarMonthView.days.map((day, index) => (
          <div
            key={`${day.isPrevMonth ? 'prev' : day.isNextMonth ? 'next' : 'current'}-${index}`}
            className={`border border-white/10 text-center hover:bg-white/30 ${day.isCurrentMonth ? 'bg-transparent' : 'bg-white/10'}`}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarMonthView