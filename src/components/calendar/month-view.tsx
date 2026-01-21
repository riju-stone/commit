import { generateMonthViewWithPadding } from '@/utils/calendar';
import { useCalendarStore } from '@/store/calendar';
import { useEffect, useMemo } from 'react';

const WEEKDAYS_SUNDAY_START = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_MONDAY_START = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function CalendarMonthView() {
  const { weekStartDay, calendarMonthView, currentMonth, currentYear, setCalendarMonthView } = useCalendarStore()

  const weekdays = useMemo(() =>
    weekStartDay === 'sunday' ? WEEKDAYS_SUNDAY_START : WEEKDAYS_MONDAY_START,
    [weekStartDay]
  );

  useEffect(() => {
    setCalendarMonthView(generateMonthViewWithPadding(currentMonth, currentYear))
  }, [currentMonth, currentYear])

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
        {calendarMonthView.viewData && Object.keys(calendarMonthView.viewData).map((week: string) => {
          return (
            <div key={`week-${week}`} className='flex-1 flex border-b-2 border-white/20 last:border-b-0'>
              {calendarMonthView.viewData[parseInt(week)].map((day: typeof calendarMonthView.viewData[0][0]) => (
                <div
                  key={day.day}
                  className={`flex-1 text-right py-2 px-3 hover:bg-white/30 border-r-2 border-white/20 last:border-r-0 flex-col items-center justify-center
                      ${day.isCurrentMonth ? 'bg-transparent' : 'bg-white/10'}
                      ${calendarMonthView.day === day.day && calendarMonthView.month === currentMonth && calendarMonthView.year === currentYear ? 'bg-white/30' : 'bg-transparent'}
                `}>
                  {day.day}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarMonthView