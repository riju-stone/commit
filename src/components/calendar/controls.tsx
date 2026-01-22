import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCalendarStore } from '@/store/calendarStore'
import { formatDate } from '@/utils/calendar'

function CalendarControls() {
  const calendarView = useCalendarStore((state) => state.calendarView)
  const currentDate = useCalendarStore((state) => state.currentDate)
  const navigateRelative = useCalendarStore((state) => state.navigateRelative)
  const goToToday = useCalendarStore((state) => state.goToToday)
  const setCalendarView = useCalendarStore((state) => state.setCalendarView)

  const handlePrevious = () => {
    navigateRelative('prev')
  }

  const handleNext = () => {
    navigateRelative('next')
  }

  const getDisplayTitle = () => {
    switch (calendarView) {
      case 'month':
        return formatDate(currentDate, 'MMMM yyyy')
      case 'week':
        return formatDate(currentDate, "'Week of' MMM d, yyyy")
      default:
        return formatDate(currentDate, 'MMMM yyyy')
    }
  }

  return (
    <div className='w-full flex items-center justify-between gap-2 p-2'>
      <div className='flex items-center justify-center gap-2'>
        <Button
          variant='outline'
          className='dark'
          onClick={handlePrevious}
          aria-label={`Previous ${calendarView}`}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant='outline'
          className='dark'
          onClick={goToToday}
        >
          Today
        </Button>
        <Button
          variant='outline'
          className='dark'
          onClick={handleNext}
          aria-label={`Next ${calendarView}`}
        >
          <ChevronRight />
        </Button>
      </div>

      <div className='text-lg font-medium'>
        {getDisplayTitle()}
      </div>

      <div className='flex items-center justify-center gap-2'>
        <Button
          variant='outline'
          className='dark'
          onClick={() => setCalendarView('month')}
          disabled={calendarView === 'month'}
        >
          Month
        </Button>
        <Button
          variant='outline'
          className='dark'
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
