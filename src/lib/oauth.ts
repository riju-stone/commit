import { openUrl } from "@tauri-apps/plugin-opener";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { GOOGLE_AUTH_SCOPES } from "@/constants/api";

// Get from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

/**
 * Generate a random state string for OAuth security
 */
function generateState(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Fallback OAuth flow using manual code entry
 * Used when the OAuth server fails to start
 */
async function initiateGoogleOAuthFallback(state: string): Promise<string> {
  const GOOGLE_OAUTH_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
  const GOOGLE_REDIRECT_URI = "http://localhost:8000";

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: GOOGLE_AUTH_SCOPES.join(" "),
    state,
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `${GOOGLE_OAUTH_AUTH_URL}?${params.toString()}`;
  await openUrl(authUrl);

  return new Promise((resolve, reject) => {
    const code = prompt(
      "Please complete the OAuth flow in your browser.\n\n" +
        "After authorizing, copy the full redirect URL from your browser's address bar and paste it here:",
    );

    if (!code) {
      reject(new Error("OAuth flow cancelled by user"));
      return;
    }

    // Try to extract code from URL if user pasted the full URL
    try {
      const url = new URL(code);
      const extractedCode = url.searchParams.get("code");
      const returnedState = url.searchParams.get("state");
      const error = url.searchParams.get("error");

      if (error) {
        const errorDescription = url.searchParams.get("error_description") || error;
        reject(new Error(`OAuth error: ${errorDescription}`));
        return;
      }

      if (extractedCode) {
        if (returnedState !== state) {
          reject(new Error("OAuth state mismatch - possible CSRF attack"));
          return;
        }
        resolve(extractedCode);
        return;
      }
    } catch {
      // User pasted just the code, not the URL - continue to validation below
    }

    // Validate the code looks reasonable (alphanumeric, dashes, underscores)
    if (/^[a-zA-Z0-9_-]+$/.test(code)) {
      resolve(code);
    } else {
      reject(new Error("Invalid authorization code format. Please paste the full redirect URL."));
    }
  });
}

/**
 * Initiate Google OAuth flow
 * Opens browser and returns authorization code
 */
export async function initiateGoogleOAuth(): Promise<string> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("Google OAuth Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.");
  }

  // Initialize OAuth config in Rust backend
  await invoke("init_oauth_config", {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: "http://localhost:8000",
  });

  const state = generateState();

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: "http://localhost:8000",
    response_type: "code",
    scope: GOOGLE_AUTH_SCOPES.join(" "),
    state,
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  try {
    // Start OAuth server in Rust backend
    const port = await invoke<number>("start_oauth_server");
    console.log(`OAuth server started on port ${port}`);

    // Listen for OAuth redirect and open browser
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("OAuth flow timed out after 5 minutes"));
      }, 300000);

      listen<string>("oauth-redirect", (event) => {
        clearTimeout(timeout);

        try {
          const redirectUrl = new URL(event.payload);
          const code = redirectUrl.searchParams.get("code");
          const returnedState = redirectUrl.searchParams.get("state");
          const error = redirectUrl.searchParams.get("error");

          if (error) {
            reject(new Error(`OAuth error: ${redirectUrl.searchParams.get("error_description") || error}`));
            return;
          }

          if (!code) {
            reject(new Error("No authorization code received"));
            return;
          }

          if (returnedState !== state) {
            reject(new Error("OAuth state mismatch - possible CSRF attack"));
            return;
          }

          resolve(code);
        } catch (error) {
          reject(
            new Error(`Failed to parse OAuth redirect: ${error instanceof Error ? error.message : String(error)}`),
          );
        }
      }).catch((error) => {
        clearTimeout(timeout);
        reject(new Error(`Failed to set up OAuth listener: ${error instanceof Error ? error.message : String(error)}`));
      });

      openUrl(authUrl).catch((error) => {
        clearTimeout(timeout);
        reject(new Error(`Failed to open browser: ${error instanceof Error ? error.message : String(error)}`));
      });
    });
  } catch (error) {
    console.error("Failed to start OAuth server, using fallback:", error);
    return initiateGoogleOAuthFallback(state);
  }
}

/**
 * Exchange authorization code for access and refresh tokens
 * Handled by Rust backend for secure token exchange
 */
export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  try {
    return await invoke<TokenResponse>("exchange_code", { code });
  } catch (error) {
    throw new Error(`Token exchange failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Refresh access token using refresh token
 * Handled by Rust backend (retrieves refresh token from secure storage)
 */
export async function refreshAccessToken(): Promise<TokenResponse> {
  try {
    return await invoke<TokenResponse>("refresh_access_token");
  } catch (error) {
    throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get valid access token, refreshing if necessary
 * Handled by Rust backend for token validation and refresh
 */
export async function getValidAccessToken(): Promise<string> {
  try {
    return await invoke<string>("get_valid_access_token");
  } catch (error) {
    throw new Error(`Failed to get valid access token: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Revoke tokens and clear storage
 * Handled by Rust backend for secure token revocation
 */
export async function revokeTokens(): Promise<void> {
  try {
    await invoke("revoke_tokens");
  } catch (error) {
    console.error("Failed to revoke tokens:", error);
  }
}
