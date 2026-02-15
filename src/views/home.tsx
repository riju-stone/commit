import { motion } from "motion/react";

const HOME_VIEW_ANIMATION = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
};

function HomeView() {
  return (
    <div className="grow w-full h-screen bg-black/80 flex items-center justify-center text-white">
      <motion.div variants={HOME_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">
        Home
      </motion.div>
    </div>
  );
}

export default HomeView;
