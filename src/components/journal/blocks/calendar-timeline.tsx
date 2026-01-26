import { useTimelineDays } from '@/hooks/calendar'
import { format, parseISO } from 'date-fns'
import { useMemo, memo } from 'react'
import { motion } from 'motion/react'

const DAY_ITEM_PARENT = {
  initial: {
    staggerChildren: 0.1,
  },
  hover: {
    staggerChildren: 0.1,
  }
}

const DAY_ITEM_LINE = {
  initial: {
    width: "50px",
    backgroundColor: "#fff",
  },
  hover: {
    width: "75px",
    backgroundColor: "#FA5C5C",
  },
}

const DAY_ITEM_LABEL = {
  initial: {
    color: "#fff",
  },
  hover: {
    color: "#FA5C5C",
  },
}

const DayItem = memo(({ day }: { day: Date }) => {
  const dayLabel = useMemo(() => format(day, 'dd'), [day])
  return (
    <motion.div
      className='w-full flex gap-2 justify-end items-center cursor-pointer'
      variants={DAY_ITEM_PARENT}
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        className='h-[2px] bg-white/40'
        variants={DAY_ITEM_LINE}
      />
      <motion.div className='text-sm text-white/40'
        variants={DAY_ITEM_LABEL}>
        {dayLabel}
      </motion.div>
    </motion.div >
  )
})

const MonthSection = memo(({ month, days, monthLabel }: { month: string; days: Date[]; monthLabel: string }) => {
  return (
    <div className='w-full flex flex-col'>
      <div className='w-fit text-sm text-white bg-black/20 border border-white/20 py-1 px-2 rounded-lg sticky top-0'>
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