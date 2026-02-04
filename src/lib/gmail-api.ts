import { getValidAccessToken } from "./oauth";
import type { Email, EmailFolder, DraftEmail, EmailAddress } from "@/types/email";

const GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1";

/**
 * Map our folder types to Gmail query strings
 */
function folderToGmailQuery(folder: EmailFolder): string {
  switch (folder) {
    case "inbox":
      return "in:inbox";
    case "sent":
      return "in:sent";
    case "drafts":
      return "in:drafts";
    case "starred":
      return "is:starred";
    case "trash":
      return "in:trash";
    default:
      return "in:inbox";
  }
}

/**
 * Parse email address from Gmail format
 */
function parseEmailAddress(address: string): EmailAddress {
  // Format: "Name <email@example.com>" or "email@example.com"
  const match = address.match(/^(.+?)\s*<(.+?)>$|^(.+?)$/);
  if (match) {
    return {
      name: match[1] || undefined,
      email: match[2] || match[3] || address,
    };
  }
  return { email: address };
}

/**
 * Parse email addresses from header string
 */
function parseEmailAddresses(header: string): EmailAddress[] {
  if (!header) return [];

  // Split by comma and parse each address
  return header.split(",").map((addr) => parseEmailAddress(addr.trim()));
}

/**
 * Parse MIME message parts to extract body and attachments
 */
function parseMessageParts(
  parts: any[],
  htmlBody: string = "",
  textBody: string = "",
  attachments: any[] = [],
): { htmlBody: string; textBody: string; attachments: any[] } {
  for (const part of parts) {
    if (part.parts) {
      // Recursively parse nested parts
      const result = parseMessageParts(part.parts, htmlBody, textBody, attachments);
      htmlBody = result.htmlBody;
      textBody = result.textBody;
      attachments = result.attachments;
    } else {
      const mimeType = part.mimeType || "";
      const body = part.body?.data || "";

      if (mimeType === "text/html" && body) {
        htmlBody = atob(body.replace(/-/g, "+").replace(/_/g, "/"));
      } else if (mimeType === "text/plain" && body && !htmlBody) {
        textBody = atob(body.replace(/-/g, "+").replace(/_/g, "/"));
      } else if (part.filename && body) {
        attachments.push({
          id: part.body?.attachmentId || "",
          filename: part.filename,
          mimeType: mimeType,
          size: part.body?.size || 0,
        });
      }
    }
  }

  return { htmlBody, textBody, attachments };
}

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  signal?: AbortSignal,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (signal?.aborted) {
      throw new Error("Request aborted");
    }

    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a rate limit error (429)
      if (error.message?.includes("429") || error.message?.includes("rate limit")) {
        if (attempt < maxRetries - 1) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = initialDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      // For other errors or final retry, throw immediately
      throw error;
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

/**
 * Fetch list of emails from Gmail with rate limiting and batching
 */
export async function fetchEmails(
  folder: EmailFolder,
  pageToken?: string,
  maxResults: number = 50,
  signal?: AbortSignal,
): Promise<{ emails: Email[]; nextPageToken?: string }> {
  const accessToken = await getValidAccessToken();
  const query = folderToGmailQuery(folder);

  const params = new URLSearchParams({
    q: query,
    maxResults: maxResults.toString(),
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const response = await retryWithBackoff(
    async () => {
      const res = await fetch(`${GMAIL_API_BASE}/users/me/messages?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        const error = new Error(`Failed to fetch emails: ${errorText}`);
        // Preserve status code for rate limit detection
        if (res.status === 429) {
          error.message = `429 rate limit exceeded: ${errorText}`;
        }
        throw error;
      }

      return res;
    },
    3,
    1000,
    signal,
  );

  const data = await response.json();
  const messageIds = data.messages?.map((m: any) => m.id) || [];

  // Batch email fetching to avoid rate limits
  // Fetch emails in smaller batches with delays between batches
  const batchSize = 5; // Reduced from 20 to avoid rate limits
  const emails: Email[] = [];

  for (let i = 0; i < Math.min(messageIds.length, 20); i += batchSize) {
    if (signal?.aborted) {
      throw new Error("Request aborted");
    }

    const batch = messageIds.slice(i, i + batchSize);
    const batchPromises = batch.map((id: string) => retryWithBackoff(() => fetchEmail(id, signal), 2, 500, signal));

    try {
      const batchResults = await Promise.all(batchPromises);
      emails.push(...batchResults);
    } catch (error: any) {
      // If batch fails, continue with next batch but log error
      console.warn(`Failed to fetch batch of emails:`, error);
    }

    // Small delay between batches to avoid rate limits
    if (i + batchSize < Math.min(messageIds.length, 20)) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  return {
    emails,
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Fetch a single email by ID
 */
export async function fetchEmail(emailId: string, signal?: AbortSignal): Promise<Email> {
  const accessToken = await getValidAccessToken();

  const response = await retryWithBackoff(
    async () => {
      const res = await fetch(`${GMAIL_API_BASE}/users/me/messages/${emailId}?format=full`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        const error = new Error(`Failed to fetch email: ${errorText}`);
        if (res.status === 429) {
          error.message = `429 rate limit exceeded: ${errorText}`;
        }
        throw error;
      }

      return res;
    },
    2,
    500,
    signal,
  );

  if (signal?.aborted) {
    throw new Error("Request aborted");
  }

  const message = await response.json();
  const headers = message.payload?.headers || [];

  // Extract headers
  const getHeader = (name: string) => {
    const header = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
    return header?.value || "";
  };

  const subject = getHeader("subject");
  const from = parseEmailAddress(getHeader("from"));
  const to = parseEmailAddresses(getHeader("to"));
  const cc = parseEmailAddresses(getHeader("cc"));
  const bcc = parseEmailAddresses(getHeader("bcc"));

  // Parse date - Gmail returns Unix timestamp in milliseconds
  const dateHeader = getHeader("date");
  let date: Date;
  if (dateHeader) {
    // Try parsing as Unix timestamp (milliseconds)
    const timestamp = parseInt(dateHeader);
    if (!isNaN(timestamp) && timestamp > 0) {
      date = new Date(timestamp);
    } else {
      // Try parsing as RFC 2822 date string
      date = new Date(dateHeader);
    }
    // Fallback to current date if parsing failed
    if (isNaN(date.getTime())) {
      date = new Date();
    }
  } else {
    date = new Date();
  }

  // Parse message body
  const payload = message.payload || {};
  const parts = payload.parts || [];

  let htmlBody = "";
  let textBody = "";
  let attachments: any[] = [];

  if (parts.length > 0) {
    const parsed = parseMessageParts(parts);
    htmlBody = parsed.htmlBody;
    textBody = parsed.textBody;
    attachments = parsed.attachments;
  } else if (payload.body?.data) {
    // Single part message
    const mimeType = payload.mimeType || "text/plain";
    const bodyData = atob(payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));

    if (mimeType === "text/html") {
      htmlBody = bodyData;
    } else {
      textBody = bodyData;
    }
  }

  // Get labels
  const labels = message.labelIds || [];
  const isRead = !labels.includes("UNREAD");
  const isStarred = labels.includes("STARRED");

  return {
    id: message.id,
    threadId: message.threadId,
    from,
    to,
    cc: cc.length > 0 ? cc : undefined,
    bcc: bcc.length > 0 ? bcc : undefined,
    subject: subject || "(No Subject)",
    body: textBody || htmlBody.replace(/<[^>]*>/g, "") || "",
    htmlBody: htmlBody || undefined,
    date,
    isRead,
    isStarred,
    labels,
    attachments:
      attachments.length > 0
        ? attachments.map((att) => ({
            id: att.id,
            filename: att.filename,
            mimeType: att.mimeType,
            size: att.size,
          }))
        : undefined,
    providerId: message.id,
  };
}

/**
 * Send an email via Gmail API
 */
export async function sendEmail(draft: DraftEmail): Promise<void> {
  const accessToken = await getValidAccessToken();

  // Build RFC 2822 message
  const lines: string[] = [];

  // Headers
  lines.push(`To: ${draft.to.join(", ")}`);
  if (draft.cc && draft.cc.length > 0) {
    lines.push(`Cc: ${draft.cc.join(", ")}`);
  }
  if (draft.bcc && draft.bcc.length > 0) {
    lines.push(`Bcc: ${draft.bcc.join(", ")}`);
  }
  lines.push(`Subject: ${draft.subject || ""}`);
  lines.push("Content-Type: text/html; charset=UTF-8");
  lines.push(""); // Empty line between headers and body
  lines.push(draft.htmlBody || draft.body);

  const rawMessage = lines.join("\r\n");

  // Base64url encode
  const base64Message = btoa(rawMessage).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const response = await fetch(`${GMAIL_API_BASE}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: base64Message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
}

/**
 * Mark an email as read
 */
export async function markAsRead(emailId: string): Promise<void> {
  const accessToken = await getValidAccessToken();

  const response = await fetch(`${GMAIL_API_BASE}/users/me/messages/${emailId}/modify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      removeLabelIds: ["UNREAD"],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to mark email as read: ${error}`);
  }
}

/**
 * Delete an email
 */
export async function deleteEmail(emailId: string): Promise<void> {
  const accessToken = await getValidAccessToken();

  const response = await fetch(`${GMAIL_API_BASE}/users/me/messages/${emailId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete email: ${error}`);
  }
}

/**
 * Get user profile information
 */
export async function getUserProfile(): Promise<{ email: string; name: string }> {
  const accessToken = await getValidAccessToken();

  const response = await fetch(`${GMAIL_API_BASE}/users/me/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get user profile: ${error}`);
  }

  const profile = await response.json();

  // Also fetch from Google People API for name
  try {
    const peopleResponse = await fetch("https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (peopleResponse.ok) {
      const peopleData = await peopleResponse.json();
      const name = peopleData.names?.[0]?.displayName || "";
      return {
        email: profile.emailAddress || "",
        name,
      };
    }
  } catch (error) {
    console.warn("Failed to fetch name from People API:", error);
  }

  return {
    email: profile.emailAddress || "",
    name: "",
  };
}
