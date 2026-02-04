import { create } from "zustand";
import type { EmailAccount, EmailFolder } from "@/types/email";
import { revokeTokens } from "@/lib/oauth";

/**
 * Simplified email store using Tanstack Query
 * Most state is now managed by React Query, this store only handles:
 * - Connected account info
 * - Current folder selection
 * - Selected email ID
 * - UI state that isn't related to data fetching
 */

interface EmailState {
  // Account management (single account for now)
  connectedAccount: EmailAccount | null;

  // View state - managed by store
  selectedEmailId: string | null;
  currentFolder: EmailFolder;

  // All data fetching, caching, loading, and error states
  // are now managed by Tanstack Query hooks
}

interface EmailActions {
  // Account management
  connectAccount: (account: EmailAccount) => void;
  disconnectAccount: () => Promise<void>;

  // View state
  setSelectedEmail: (id: string | null) => void;
  setCurrentFolder: (folder: EmailFolder) => void;

  // Note: fetchEmails, fetchEmail, sendEmail, markAsRead, deleteEmail
  // are now handled by the Tanstack Query hooks in useGmailQueries.ts
}

const initialState: EmailState = {
  connectedAccount: null,
  selectedEmailId: null,
  currentFolder: "inbox",
};

/**
 * Use this hook to access the email store
 * For data fetching, use the hooks from useGmailQueries.ts:
 * - useEmailsQuery(folder) - for fetching emails list
 * - useEmailQuery(emailId) - for fetching a single email
 * - useSendEmailMutation() - for sending emails
 * - useMarkAsReadMutation(folder) - for marking emails as read
 * - useDeleteEmailMutation(folder) - for deleting emails
 */
export const useEmailStore = create<EmailState & EmailActions>((set, get) => ({
  ...initialState,

  connectAccount: (account: EmailAccount) => {
    set({ connectedAccount: account });
  },

  disconnectAccount: async () => {
    // Revoke tokens and clear storage
    try {
      await revokeTokens();
    } catch (error) {
      console.error("Failed to revoke tokens:", error);
    }

    set({
      connectedAccount: null,
      selectedEmailId: null,
      currentFolder: "inbox",
    });

    // Note: Tanstack Query cache will be cleared automatically
    // when the component unmounts or you can manually invalidate
  },

  setSelectedEmail: (id: string | null) => {
    set({ selectedEmailId: id });
  },

  setCurrentFolder: (folder: EmailFolder) => {
    set({
      currentFolder: folder,
      selectedEmailId: null,
    });
  },
}));
