import { useEmailStore } from "@/store/emailStore";
import { useEmailsQuery, useEmailQuery } from "@/hooks/useGmailQueries";
import { format, formatDistanceToNow } from "date-fns";
import { Star, Mail } from "lucide-react";
import { motion } from "motion/react";

const EMAIL_ITEM_VARIANTS = {
  inactive: {
    backgroundColor: "transparent",
  },
  active: {
    backgroundColor: "#ffffff10",
  },
};

function EmailListItem({ emailId }: { emailId: string }) {
  const { selectedEmailId, setSelectedEmail } = useEmailStore();

  // Use the query hook to get properly typed email data
  const { data: emailData, isLoading } = useEmailQuery(emailId);

  const isSelected = selectedEmailId === emailId;

  if (isLoading || !emailData) {
    return (
      <div className="w-full p-4 border-b border-white/10 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-white/10 rounded w-1/2"></div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(emailData.date, { addSuffix: true });
  const formattedDate = format(emailData.date, "MMM d");

  return (
    <motion.button
      className="w-full flex items-start gap-3 p-4 border-b border-white/10 text-left hover:bg-white/5 transition-colors"
      variants={EMAIL_ITEM_VARIANTS}
      animate={isSelected ? "active" : "inactive"}
      onClick={() => setSelectedEmail(emailId)}
      whileHover={{ backgroundColor: "#ffffff08" }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-medium">
        {emailData.from.name?.[0]?.toUpperCase() || emailData.from.email[0]?.toUpperCase() || "?"}
      </div>

      {/* Email Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className={`text-sm font-medium truncate ${emailData.isRead ? "text-white/70" : "text-white"}`}>
              {emailData.from.name || emailData.from.email}
            </span>
            {emailData.isStarred && <Star className="size-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-white/40">
              {timeAgo.includes("hour") || timeAgo.includes("day") ? formattedDate : timeAgo}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm truncate ${emailData.isRead ? "text-white/60" : "text-white font-medium"}`}>
            {emailData.subject || "(No Subject)"}
          </span>
        </div>

        <p className="text-xs text-white/50 line-clamp-2 truncate">
          {emailData.body.replace(/\n/g, " ").substring(0, 100)}
        </p>
      </div>

      {/* Unread Indicator */}
      {!emailData.isRead && <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
    </motion.button>
  );
}

export default function EmailListComponent() {
  const { connectedAccount, currentFolder } = useEmailStore();

  // Fetch emails with automatic caching and refetching
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useEmailsQuery(
    currentFolder,
    !!connectedAccount,
  );

  if (!connectedAccount) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40">
        <div className="text-center">
          <Mail className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Connect your Gmail account to view emails</p>
        </div>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/40 mx-auto mb-4"></div>
          <p className="text-sm">Loading emails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40">
        <div className="text-center">
          <p className="text-sm text-red-400">Error loading emails</p>
          <p className="text-xs mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  // Flatten all pages into a single email list
  const emails = data?.pages.flatMap((page) => page.emails) ?? [];

  if (emails.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40">
        <div className="text-center">
          <Mail className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No emails in {currentFolder}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col">
        {emails.map((email) => (
          <EmailListItem key={email.id} emailId={email.id} />
        ))}
      </div>

      {hasNextPage && (
        <div className="p-4 text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-white/60 hover:text-white text-sm disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
