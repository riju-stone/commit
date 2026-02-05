import { useEffect, useRef, useCallback } from "react";
import { useEmailStore } from "@/store/emailStore";
import { getStoredTokens } from "@/lib/token-storage";
import { getValidAccessToken } from "@/lib/oauth";
import { getUserProfile } from "@/lib/gmail-api";

/**
 * Hook to manage authentication session
 *
 * Features:
 * - Checks for stored tokens on mount and restores session
 * - Periodically validates and refreshes tokens
 * - Automatically refreshes access token when it expires
 * - Logs user out when refresh token expires
 *
 * @param checkInterval - How often to check token validity (in milliseconds, default: 5 minutes)
 */
export function useAuthSession(checkInterval: number = 5 * 60 * 1000) {
  const { connectedAccount, connectAccount, disconnectAccount } = useEmailStore();
  const isCheckingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkAndRestoreSession = useCallback(async () => {
    // Prevent concurrent checks
    if (isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;

    try {
      // Check if we have stored tokens
      const storedTokens = await getStoredTokens();

      if (!storedTokens) {
        // No stored tokens found
        // If we have a connected account, verify the session is still valid
        if (connectedAccount) {
          try {
            // Verify by calling the API (which uses get_valid_access_token internally)
            await getValidAccessToken();
            // Session is valid - tokens are in Rust backend storage even if not immediately retrievable
            console.log("Session valid, tokens managed by backend");
            return;
          } catch (error) {
            // Session is invalid, disconnect
            console.log("No stored tokens and session invalid, disconnecting...");
            await disconnectAccount();
          }
        }
        return;
      }

      // Check if refresh token has expired
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = storedTokens.expiresAt - now;

      // If token expires in less than 5 minutes or is already expired
      if (timeUntilExpiry < 300) {
        try {
          // Try to get a valid access token (this will refresh if needed)
          await getValidAccessToken();

          // After refresh, get updated tokens
          const updatedTokens = await getStoredTokens();
          if (!updatedTokens) {
            throw new Error("Failed to get updated tokens after refresh");
          }

          // Verify tokens work by getting user profile
          const profile = await getUserProfile();

          // Update the store with refreshed tokens
          connectAccount({
            id: connectedAccount?.id || crypto.randomUUID(),
            email: profile.email,
            provider: "gmail",
            name: profile.name,
            accessToken: updatedTokens.accessToken,
            refreshToken: updatedTokens.refreshToken,
            expiresAt: new Date(updatedTokens.expiresAt * 1000),
            connectedAt: connectedAccount?.connectedAt || new Date(),
          });

          console.log("Session refreshed successfully");
        } catch (error) {
          // Refresh failed - tokens are likely expired
          console.error("Failed to refresh tokens, logging out:", error);
          await disconnectAccount();
          return;
        }
      } else if (!connectedAccount) {
        // We have valid tokens but no connected account in store
        // This happens after switching views or app restart
        try {
          const profile = await getUserProfile();

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

          console.log("Session restored from stored tokens");
        } catch (error) {
          // Tokens are invalid
          console.warn("Stored tokens are invalid:", error);
          await disconnectAccount();
        }
      }
    } catch (error) {
      console.error("Error during session check:", error);
    } finally {
      isCheckingRef.current = false;
    }
  }, [connectedAccount, connectAccount, disconnectAccount]);

  // Initial check on mount - only restore if no account is connected
  useEffect(() => {
    // Only check for stored tokens if user is not already connected
    // This prevents unnecessary checks right after login
    if (!connectedAccount) {
      checkAndRestoreSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Periodic check while component is mounted
  useEffect(() => {
    // Only set up periodic checking if we have a connected account
    if (connectedAccount) {
      intervalRef.current = setInterval(() => {
        checkAndRestoreSession();
      }, checkInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      // Clear interval if user disconnects
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [connectedAccount, checkInterval, checkAndRestoreSession]);

  return {
    isAuthenticated: !!connectedAccount,
    connectedAccount,
    refreshSession: checkAndRestoreSession,
  };
}
