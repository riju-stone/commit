import React from "react";
import { useEmailStore } from "@/store/emailStore";
import { useEmailQuery, useMarkAsReadMutation, useDeleteEmailMutation } from "@/hooks/useGmailQueries";
import { Button } from "@/components/ui/button";
import { Reply, Forward, Trash2, Star, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";

const EMAIL_VIEWER_ANIMATION = {
  initial: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
  transition: {
    duration: 0.3,
    ease: "easeOut",
  },
};

export default function EmailViewerComponent() {
  const { selectedEmailId, currentFolder, setSelectedEmail } = useEmailStore();

  // Fetch individual email with caching
  const { data: email, isLoading, error } = useEmailQuery(selectedEmailId || "", !!selectedEmailId);

  // Mutations for email actions
  const markAsRead = useMarkAsReadMutation(currentFolder);
  const deleteEmail = useDeleteEmailMutation(currentFolder);

  // Mark email as read when viewing
  React.useEffect(() => {
    if (email && !email.isRead) {
      markAsRead.mutate(email.id);
    }
  }, [email?.id, email?.isRead, markAsRead]);

  if (!selectedEmailId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40">
        <div className="text-center">
          <p className="text-sm">Select an email to view</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40">
        <div className="text-center">
          <p className="text-sm">Loading email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40">
        <div className="text-center">
          <p className="text-sm text-red-400">Error loading email</p>
          <p className="text-xs mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40">
        <div className="text-center">
          <p className="text-sm">Email not found</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteEmail.mutate(email.id, {
      onSuccess: () => {
        setSelectedEmail(null);
      },
    });
  };

  const handleReply = () => {
    // TODO: Implement reply functionality
    console.log("Reply to email", email.id);
  };

  const handleForward = () => {
    // TODO: Implement forward functionality
    console.log("Forward email", email.id);
  };

  const handleStar = () => {
    // TODO: Implement star/unstar functionality
    console.log("Star email", email.id);
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col overflow-hidden"
      variants={EMAIL_VIEWER_ANIMATION}
      initial="initial"
      animate="visible"
    >
      {/* Email Header */}
      <div className="shrink-0 border-b border-white/10 p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white mb-2 truncate">{email.subject || "(No Subject)"}</h2>
            <div className="flex flex-col gap-1 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white/80">From:</span>
                <span className="truncate">
                  {email.from.name ? `${email.from.name} <${email.from.email}>` : email.from.email}
                </span>
              </div>
              {email.to.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white/80">To:</span>
                  <span className="truncate">{email.to.map((addr) => addr.name || addr.email).join(", ")}</span>
                </div>
              )}
              {email.cc && email.cc.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white/80">CC:</span>
                  <span className="truncate">{email.cc.map((addr) => addr.name || addr.email).join(", ")}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-medium text-white/80">Date:</span>
                <span>{format(email.date, "PPpp")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReply} className="text-white/60 hover:text-white">
            <Reply className="size-4" />
            Reply
          </Button>
          <Button variant="ghost" size="sm" onClick={handleForward} className="text-white/60 hover:text-white">
            <Forward className="size-4" />
            Forward
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStar}
            className={`text-white/60 hover:text-white ${email.isStarred ? "text-yellow-400" : ""}`}
          >
            <Star className={`size-4 ${email.isStarred ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-white/60 hover:text-destructive"
            disabled={deleteEmail.isPending}
          >
            <Trash2 className="size-4" />
            {deleteEmail.isPending ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white ml-auto">
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {email.htmlBody ? (
          <div
            className="prose prose-invert max-w-none text-white/80"
            dangerouslySetInnerHTML={{ __html: email.htmlBody }}
          />
        ) : (
          <div className="text-white/80 whitespace-pre-wrap">{email.body}</div>
        )}

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-medium text-white/80 mb-3">Attachments</h3>
            <div className="flex flex-col gap-2">
              {email.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-3 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{attachment.filename}</p>
                    <p className="text-xs text-white/40">{(attachment.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white"
                    onClick={() => {
                      // TODO: Implement attachment download
                      console.log("Download attachment", attachment.id);
                    }}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
