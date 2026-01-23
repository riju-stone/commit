import { useTimelineDays } from '@/hooks/calendar'
import { format, parseISO } from 'date-fns'
import { useMemo, memo } from 'react'

const DayItem = memo(({ day }: { day: Date }) => {
  const dayLabel = useMemo(() => format(day, 'dd'), [day])
  return (
    <div className='w-full flex gap-2 justify-end items-center'>
      <div className='w-1/4 h-px bg-white/30' />
      <div className='text-xs text-white/60'>
        {dayLabel}
      </div>
    </div>
  )
})

const MonthSection = memo(({ month, days, monthLabel }: { month: string; days: Date[]; monthLabel: string }) => {
  return (
    <div className='w-full flex flex-col'>
      <div className='w-fit text-sm text-white/60 bg-black/30 py-1 px-2 rounded-lg sticky top-0'>
        {monthLabel}
      </div>

      <div className='w-full flex flex-col gap-2 items-end'>
        {days.map((day) => (
          <DayItem key={`day-${day.getTime()}-${month}`} day={day} />
        ))}
      </div>
    </div>
  )
})

function CalendarTimelineBlock() {
  const timelineDays = useTimelineDays(new Date(), 365);

  const sortedMonthsWithLabels = useMemo(() => {
    const months = Object.keys(timelineDays).sort().reverse();
    return months.map(month => {
      const monthDate = parseISO(month + '-01');
      return {
        month,
        label: format(monthDate, 'MMMM yy'),
        days: timelineDays[month]
      };
    });
  }, [timelineDays]);

  return (
    <div className='w-full h-full flex flex-col px-4 overflow-y-auto py-2'>
      {/* Render months on the left side of the timeline */}
      <div className='w-full flex flex-col gap-4'>
        {sortedMonthsWithLabels.map(({ month, label, days }) => (
          <MonthSection
            key={`month-${month}`}
            month={month}
            days={days}
            monthLabel={label}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(CalendarTimelineBlock)