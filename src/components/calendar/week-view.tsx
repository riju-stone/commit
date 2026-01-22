import { useWeekdayNames, useWeekViewData } from '@/hooks/calendar'
import React from 'react'

function CalendarWeekView() {
  const weekViewData = useWeekViewData()
  const weekdays = useWeekdayNames('short')

  console.log(weekViewData)
  return <div key={`week-${weekViewData.week}`} className='flex-1 h-0 w-full bg-transparent rounded-lg overflow-hidden flex flex-col border-2 border-white/20'>
    <div className='flex-1 flex flex-col'>
      {weekViewData.days.map((day) => (
        <div key={day.date.toISOString()} className='flex-1 p-1'>{day.day}</div>
      ))}
    </div>
  </div>
}

export default CalendarWeekView