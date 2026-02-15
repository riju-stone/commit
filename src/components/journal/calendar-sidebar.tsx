import CalendarTimelineBlock from "./blocks/calendar-timeline";

export default function CalendarSidebarComponent() {
  return (
    <div className="w-full h-[calc(100vh-60px)] text-nowrap overflow-hidden mt-10">
      <CalendarTimelineBlock />
    </div>
  );
}
