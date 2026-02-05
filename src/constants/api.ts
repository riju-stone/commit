export const GOOGLE_OAUTH_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_REDIRECT_URI = "http://localhost:8000";

export const GMAIL_API_BASE = "https://gmail.googleapis.com/v1";
export const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

export const GOOGLE_AUTH_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.events.public.readonly",
];
