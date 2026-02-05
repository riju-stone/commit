import { Bolt, Brain, Calendar, CircleCheckBig, Home, LineSquiggle, Mail, Newspaper, NotepadText } from "lucide-react";
import useAppStore from "@/store/appStore";
import { motion } from "motion/react";

const ACTIVITY_BAR_OPEN_WIDTH = "50px";
const ACTIVITY_BAR_CLOSED_WIDTH = "0px";

const ACTIVITY_BAR_CONTENT_ANIMATION = {
  activityBarWrapper: {
    closed: {
      width: ACTIVITY_BAR_CLOSED_WIDTH,
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    open: {
      width: ACTIVITY_BAR_OPEN_WIDTH,
      paddingLeft: "10px",
      paddingRight: "10px",
    },
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      delay: 0.2,
    },
  },
  activityBarContent: {
    closed: {
      opacity: 0,
      x: 30,
    },
    open: {
      opacity: 1,
      x: 0,
    },
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

function ActivityBarComponent() {
  const { activityBarOpen, activeTab, setActiveTab } = useAppStore();

  return (
    <motion.div
      className="shrink-0 flex-wrap h-screen bg-black/60 flex flex-col items-start justify-between overflow-hidden"
      variants={ACTIVITY_BAR_CONTENT_ANIMATION.activityBarWrapper}
      initial="closed"
      animate={activityBarOpen ? "open" : "closed"}
    >
      <motion.div
        className="flex flex-col items-start justify-center gap-3 mt-10 mb-4"
        variants={ACTIVITY_BAR_CONTENT_ANIMATION.activityBarContent}
        initial="closed"
        animate={activityBarOpen ? "open" : "closed"}
      >
        <button
          className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.8)] ${activeTab === "home" ? "bg-[rgba(151,151,151,0.4)]" : "bg-transparent"}`}
          onClick={() => setActiveTab("home")}
        >
          <Home />
        </button>
        <button
          className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.8)] ${activeTab === "email" ? "bg-[rgba(151,151,151,0.4)]" : "bg-transparent"}`}
          onClick={() => setActiveTab("email")}
        >
          <Mail />
        </button>
        <button
          className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.8)] ${activeTab === "feed" ? "bg-[rgba(151,151,151,0.4)]" : "bg-transparent"}`}
          onClick={() => setActiveTab("feed")}
        >
          <Newspaper />
        </button>
        <button
          className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.8)] ${activeTab === "tasks" ? "bg-[rgba(151,151,151,0.4)]" : "bg-transparent"}`}
          onClick={() => setActiveTab("tasks")}
        >
          <CircleCheckBig />
        </button>
        <button
          className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.8)] ${activeTab === "calendar" ? "bg-[rgba(151,151,151,0.4)]" : "bg-transparent"}`}
          onClick={() => setActiveTab("calendar")}
        >
          <Calendar />
        </button>
        <button
          className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.8)] ${activeTab === "notes" ? "bg-[rgba(151,151,151,0.4)]" : "bg-transparent"}`}
          onClick={() => setActiveTab("notes")}
        >
          <NotepadText />
        </button>
        <button
          className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.8)] ${activeTab === "journal" ? "bg-[rgba(151,151,151,0.4)]" : "bg-transparent"}`}
          onClick={() => setActiveTab("journal")}
        >
          <Brain />
        </button>
        <button
          className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.8)] ${activeTab === "whiteboard" ? "bg-[rgba(151,151,151,0.4)]" : "bg-transparent"}`}
          onClick={() => setActiveTab("whiteboard")}
        >
          <LineSquiggle />
        </button>
      </motion.div>
      <motion.div
        className="flex flex-col items-start justify-center gap-3 mt-10 mb-4"
        variants={ACTIVITY_BAR_CONTENT_ANIMATION.activityBarContent}
        initial="closed"
        animate={activityBarOpen ? "open" : "closed"}
      >
        <button
          className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.8)] ${activeTab === "settings" ? "bg-[rgba(151,151,151,0.4)]" : "bg-transparent"}`}
          onClick={() => setActiveTab("settings")}
        >
          <Bolt />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default ActivityBarComponent;
