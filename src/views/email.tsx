import { motion } from "motion/react";
import EmailListComponent from "@/components/email/email-list";
import { useEmailStore } from "@/store/emailStore";

const EMAIL_VIEW_ANIMATION = {
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

function EmailView() {
  // No longer need to manually fetch emails - Tanstack Query handles this automatically
  const { connectedAccount } = useEmailStore();

  return (
    <div className="grow w-full h-screen bg-black/80 flex items-center justify-center overflow-hidden text-white">
      <motion.div
        layout
        variants={EMAIL_VIEW_ANIMATION}
        initial="initial"
        animate="visible"
        exit="initial"
        className="w-full h-full flex flex-col"
      >
        <EmailListComponent />
      </motion.div>
    </div>
  );
}

export default EmailView;
