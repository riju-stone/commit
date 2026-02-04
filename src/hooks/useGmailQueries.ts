import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type QueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import * as gmailApi from "@/lib/gmail-api";
import type { Email, EmailFolder, DraftEmail } from "@/types/email";

/**
 * Query Keys Factory
 * Provides type-safe and consistent query keys for all Gmail operations
 */
export const gmailKeys = {
  all: ["gmail"] as const,
  folders: () => [...gmailKeys.all, "folders"] as const,
  folder: (folder: EmailFolder) => [...gmailKeys.folders(), folder] as const,
  emails: (folder: EmailFolder) => [...gmailKeys.folder(folder), "emails"] as const,
  email: (emailId: string) => [...gmailKeys.all, "email", emailId] as const,
  profile: () => [...gmailKeys.all, "profile"] as const,
};

/**
 * Hook for fetching paginated emails from a specific folder
 * Features:
 * - Infinite scroll with pagination
 * - Automatic refetching every 2 minutes
 * - Background refetching when window regains focus
 * - Retry mechanism with exponential backoff
 */
export function useEmailsQuery(folder: EmailFolder, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: gmailKeys.emails(folder),
    queryFn: async ({ pageParam }) => {
      const abortController = new AbortController();
      try {
        return await gmailApi.fetchEmails(folder, pageParam, 50, abortController.signal);
      } catch (error) {
        abortController.abort();
        throw error;
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    enabled,
    // Refetch every 2 minutes for real-time updates
    refetchInterval: 1000 * 60 * 2,
    // Continue refetching in background
    refetchIntervalInBackground: false,
    // Stale time of 1 minute - data older than this will refetch
    staleTime: 1000 * 60 * 1,
    // Keep unused data for 5 minutes
    gcTime: 1000 * 60 * 5,
    // Retry 3 times with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single email by ID
 * Features:
 * - Caches individual emails for 5 minutes
 * - Automatically refetches when stale
 * - Retry mechanism
 */
export function useEmailQuery(emailId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: gmailKeys.email(emailId),
    queryFn: async () => {
      const abortController = new AbortController();
      try {
        return await gmailApi.fetchEmail(emailId, abortController.signal);
      } catch (error) {
        abortController.abort();
        throw error;
      }
    },
    enabled: enabled && !!emailId,
    // Individual emails are cached longer (5 minutes)
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching user profile
 */
export function useUserProfileQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: gmailKeys.profile(),
    queryFn: () => gmailApi.getUserProfile(),
    enabled,
    staleTime: 1000 * 60 * 10, // Profile data is stable, cache for 10 minutes
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });
}

/**
 * Mutation hook for sending emails
 * Features:
 * - Invalidates sent folder after success
 * - Error handling with retry
 */
export function useSendEmailMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: DraftEmail) => gmailApi.sendEmail(draft),
    onSuccess: () => {
      // Invalidate sent folder to refetch with new email
      queryClient.invalidateQueries({
        queryKey: gmailKeys.emails("sent"),
      });
    },
    retry: 1,
    retryDelay: 1000,
  });
}

/**
 * Mutation hook for marking emails as read
 * Features:
 * - Optimistic updates for instant UI feedback
 * - Automatic rollback on error
 * - Cache invalidation
 */
export function useMarkAsReadMutation(folder: EmailFolder) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (emailId: string) => gmailApi.markAsRead(emailId),
    onMutate: async (emailId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: gmailKeys.email(emailId) });
      await queryClient.cancelQueries({ queryKey: gmailKeys.emails(folder) });

      // Snapshot previous values for rollback
      const previousEmail = queryClient.getQueryData<Email>(gmailKeys.email(emailId));
      const previousEmails = queryClient.getQueryData<InfiniteData<{ emails: Email[]; nextPageToken?: string }>>(
        gmailKeys.emails(folder),
      );

      // Optimistically update individual email
      if (previousEmail) {
        queryClient.setQueryData<Email>(gmailKeys.email(emailId), {
          ...previousEmail,
          isRead: true,
        });
      }

      // Optimistically update in the email list
      if (previousEmails) {
        queryClient.setQueryData<InfiniteData<{ emails: Email[]; nextPageToken?: string }>>(gmailKeys.emails(folder), {
          ...previousEmails,
          pages: previousEmails.pages.map((page) => ({
            ...page,
            emails: page.emails.map((email) => (email.id === emailId ? { ...email, isRead: true } : email)),
          })),
        });
      }

      return { previousEmail, previousEmails };
    },
    onError: (_err, emailId, context) => {
      // Rollback on error
      if (context?.previousEmail) {
        queryClient.setQueryData(gmailKeys.email(emailId), context.previousEmail);
      }
      if (context?.previousEmails) {
        queryClient.setQueryData(gmailKeys.emails(folder), context.previousEmails);
      }
    },
    onSettled: (_data, _error, emailId) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: gmailKeys.email(emailId) });
      queryClient.invalidateQueries({ queryKey: gmailKeys.emails(folder) });
    },
  });
}

/**
 * Mutation hook for deleting emails
 * Features:
 * - Optimistic updates
 * - Automatic rollback on error
 * - Cache cleanup
 */
export function useDeleteEmailMutation(folder: EmailFolder) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (emailId: string) => gmailApi.deleteEmail(emailId),
    onMutate: async (emailId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: gmailKeys.emails(folder) });

      // Snapshot previous value
      const previousEmails = queryClient.getQueryData<InfiniteData<{ emails: Email[]; nextPageToken?: string }>>(
        gmailKeys.emails(folder),
      );

      // Optimistically remove from list
      if (previousEmails) {
        queryClient.setQueryData<InfiniteData<{ emails: Email[]; nextPageToken?: string }>>(gmailKeys.emails(folder), {
          ...previousEmails,
          pages: previousEmails.pages.map((page) => ({
            ...page,
            emails: page.emails.filter((email) => email.id !== emailId),
          })),
        });
      }

      return { previousEmails };
    },
    onError: (_err, _emailId, context) => {
      // Rollback on error
      if (context?.previousEmails) {
        queryClient.setQueryData(gmailKeys.emails(folder), context.previousEmails);
      }
    },
    onSuccess: (_data, emailId) => {
      // Remove individual email from cache
      queryClient.removeQueries({ queryKey: gmailKeys.email(emailId) });
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: gmailKeys.emails(folder) });
    },
  });
}

/**
 * Utility function to prefetch an email
 * Useful for optimizing perceived performance
 */
export function prefetchEmail(queryClient: QueryClient, emailId: string) {
  return queryClient.prefetchQuery({
    queryKey: gmailKeys.email(emailId),
    queryFn: async () => {
      const abortController = new AbortController();
      try {
        return await gmailApi.fetchEmail(emailId, abortController.signal);
      } catch (error) {
        abortController.abort();
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Utility function to invalidate all email queries
 * Useful after major operations or reconnection
 */
export function invalidateAllEmails(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: gmailKeys.all,
  });
}

/**
 * Utility function to invalidate a specific folder
 */
export function invalidateFolder(queryClient: QueryClient, folder: EmailFolder) {
  return queryClient.invalidateQueries({
    queryKey: gmailKeys.emails(folder),
  });
}
