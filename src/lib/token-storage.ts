import { StoredTokens } from "@/types/auth";
import { invoke } from "@tauri-apps/api/core";

/**
 * Store tokens securely using Rust backend
 * Note: This is typically not needed as exchange_code and refresh_access_token in Rust handle storage
 */
export async function storeTokens(tokens: StoredTokens): Promise<void> {
  try {
    await invoke("store_tokens", {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      tokenType: tokens.tokenType,
    });
  } catch (error) {
    console.error("Failed to store tokens:", error);
    // Don't throw - Rust backend handles storage automatically during OAuth flow
  }
}

/**
 * Retrieve stored tokens from Rust backend
 */
export async function getStoredTokens(): Promise<StoredTokens | null> {
  try {
    const tokens = await invoke<StoredTokens | null>("get_stored_tokens");

    if (!tokens) {
      return null;
    }

    // Validate token structure
    if (!tokens.accessToken || !tokens.refreshToken) {
      return null;
    }

    return tokens;
  } catch (error) {
    console.error("Failed to retrieve tokens:", error);
    return null;
  }
}

/**
 * Clear stored tokens using Rust backend
 */
export async function clearTokens(): Promise<void> {
  try {
    await invoke("clear_tokens");
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
}
