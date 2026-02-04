import { useEmailStore } from "@/store/emailStore";
import { invalidateFolder } from "@/hooks/useGmailQueries";
import { Button } from "@/components/ui/button";
import { Mail, Inbox, Send, FileText, Star, Trash2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import type { EmailFolder } from "@/types/email";

const FOLDER_CONFIG: Array<{ id: EmailFolder; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: FileText },
  { id: "starred", label: "Starred", icon: Star },
  { id: "trash", label: "Trash", icon: Trash2 },
];

const FOLDER_ITEM_VARIANTS = {
  inactive: {
    backgroundColor: "transparent",
    color: "#ffffff80",
  },
  active: {
    backgroundColor: "#ffffff10",
    color: "#ffffff",
  },
};

function FolderItem({
  folder,
  isActive,
  onClick,
}: {
  folder: (typeof FOLDER_CONFIG)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = folder.icon;

  return (
    <motion.button
      className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-left text-sm"
      variants={FOLDER_ITEM_VARIANTS}
      animate={isActive ? "active" : "inactive"}
      onClick={onClick}
      whileHover={{ backgroundColor: "#ffffff10" }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="size-4" />
      <span>{folder.label}</span>
    </motion.button>
  );
}

export default function EmailSidebarComponent() {
  const queryClient = useQueryClient();
  const { connectedAccount, currentFolder, setCurrentFolder } = useEmailStore();

  const handleFolderClick = (folder: EmailFolder) => {
    // Only switch if it's a different folder
    if (folder !== currentFolder) {
      setCurrentFolder(folder);
      // Emails will be automatically fetched by useEmailsQuery
    }
  };

  const handleRefresh = () => {
    // Invalidate and refetch current folder
    invalidateFolder(queryClient, currentFolder);
  };

  const handleConnect = async () => {
    try {
      const { initiateGoogleOAuth, exchangeCodeForTokens } = await import("@/lib/oauth");
      const { getUserProfile } = await import("@/lib/gmail-api");
      const { getStoredTokens } = await import("@/lib/token-storage");

      // Check if we already have stored tokens
      const storedTokens = await getStoredTokens();
      if (storedTokens) {
        // Try to use existing tokens
        try {
          const profile = await getUserProfile();
          const { connectAccount } = useEmailStore.getState();
          connectAccount({
            id: crypto.randomUUID(),
            email: profile.email,
            provider: "gmail",
            name: profile.name,
            accessToken: storedTokens.accessToken,
            refreshToken: storedTokens.refreshToken,
            expiresAt: new Date(storedTokens.expiresAt * 1000),
            connectedAt: new Date(),
          });
          return;
        } catch (error) {
          // Tokens invalid, proceed with new OAuth flow
          console.warn("Stored tokens invalid, starting new OAuth flow");
        }
      }

      // Start OAuth flow
      const code = await initiateGoogleOAuth();
      const tokens = await exchangeCodeForTokens(code);

      // Get user profile
      const profile = await getUserProfile();

      // Store account in store
      const { connectAccount } = useEmailStore.getState();
      connectAccount({
        id: crypto.randomUUID(),
        email: profile.email,
        provider: "gmail",
        name: profile.name,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        connectedAt: new Date(),
      });

      // Emails will be automatically fetched by useEmailsQuery when folder is set
    } catch (error) {
      console.error("Failed to connect Gmail account:", error);
      // Error handling is now managed by Tanstack Query hooks
    }
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] text-nowrap overflow-hidden mt-[40px] flex flex-col">
      {/* Account Section */}
      <div className="px-4 py-3 border-b border-white/10">
        {connectedAccount ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-white/60" />
              <span className="text-sm text-white/80 font-medium truncate">
                {connectedAccount.name || connectedAccount.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-white/60 hover:text-white"
              onClick={async () => {
                await useEmailStore.getState().disconnectAccount();
              }}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="w-full justify-center gap-2" onClick={handleConnect}>
            <Mail className="size-4" />
            Connect Gmail
          </Button>
        )}
      </div>

      {/* Folders Section */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="flex flex-col gap-1">
          {FOLDER_CONFIG.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              isActive={currentFolder === folder.id}
              onClick={() => handleFolderClick(folder.id)}
            />
          ))}
        </div>

        {/* Refresh Button */}
        {connectedAccount && (
          <div className="mt-4 px-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-white/60 hover:text-white"
              onClick={handleRefresh}
            >
              <RefreshCw className="size-4 mr-2" />
              Refresh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
