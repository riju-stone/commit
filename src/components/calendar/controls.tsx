import moment from 'moment'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCalendarStore } from '@/store/calendar'

function CalendarControls() {
  const { currentMonth, currentYear, setCurrentMonth, setCurrentYear, setCalendarView, calendarView } = useCalendarStore()

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleToday = () => {
    setCurrentMonth(moment().month())
    setCurrentYear(moment().year())
  }

  return (
    <div className='w-full flex items-center justify-between gap-2' >
      <div className='flex items-center justify-center gap-2'>
        <Button variant='outline' className='dark'
          onClick={handlePreviousMonth}
        >
          <ChevronLeft />
          Before
        </Button>
        <Button variant='outline' className='dark'
          onClick={handleToday}
        >
          Today
        </Button>
        <Button variant='outline' className='dark'
          onClick={handleNextMonth}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
      <div className=''>{moment([currentYear, currentMonth]).format("MMMM YYYY")}</div>
      <div className='flex items-center justify-center gap-2'>
        <Button variant='outline' className='dark'
          onClick={() => setCalendarView('month')}
          disabled={calendarView === 'month'}
        >
          Month
        </Button>
        <Button variant='outline' className='dark'
          onClick={() => setCalendarView('week')}
          disabled={calendarView === 'week'}
        >
          Week
        </Button>
      </div>
    </div>
  )
}

export default CalendarControls