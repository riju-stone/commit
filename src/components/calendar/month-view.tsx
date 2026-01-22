
import { useMonthViewData, useWeekdayNames } from '@/hooks/calendar'
import { isToday } from '@/utils/calendar'

function CalendarMonthView() {

  const monthViewData = useMonthViewData()
  const weekdays = useWeekdayNames('long')

  return (
    <div className='flex-1 h-0 w-full bg-transparent rounded-lg overflow-hidden flex flex-col border-2 border-white/20'>
      {/* Calendar weekday header */}
      <div className='text-center flex text-lg border-b-2 border-white/20'>
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`flex-1 p-1 ${index < weekdays.length - 1 ? 'border-r-2 border-white/20' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar month view */}
      <div className='flex-1 flex flex-col'>
        {monthViewData.weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            className='flex-1 flex border-b-2 border-white/20 last:border-b-0'
          >
            {week.map((day) => {
              const isDayToday = isToday(day.date)

              return (
                <div
                  key={day.date.toISOString()}
                  className={`
                    flex-1 text-right py-2 px-3 cursor-pointer
                    border-r-2 border-white/20 last:border-r-0
                    flex-col items-center justify-center
                    transition-colors duration-150
                    hover:bg-white/20
                    ${day.isCurrentMonth ? 'bg-transparent' : 'bg-white/10 text-white/50'}
                    ${isDayToday ? 'bg-white/60 text-black font-bold' : 'bg-transparent'}
                  `}
                >
                  <span className={isDayToday ? 'text-black' : ''}>
                    {day.day}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarMonthView
