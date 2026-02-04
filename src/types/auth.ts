export interface OAuthResponse {
  code: string;
  state?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // in seconds
  token_type: string;
  scope?: string;
}

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp in seconds
  tokenType: string;
}
