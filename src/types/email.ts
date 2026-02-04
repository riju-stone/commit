export type EmailProvider = 'gmail' | 'outlook' | 'apple' // Future support

export interface EmailAccount {
  id: string
  email: string
  provider: EmailProvider
  name?: string
  accessToken: string
  refreshToken: string
  expiresAt: Date
  connectedAt: Date
}

export interface Email {
  id: string
  threadId: string
  from: EmailAddress
  to: EmailAddress[]
  cc?: EmailAddress[]
  bcc?: EmailAddress[]
  subject: string
  body: string
  htmlBody?: string
  date: Date
  isRead: boolean
  isStarred: boolean
  labels: string[]
  attachments?: EmailAttachment[]
  providerId: string
}

export interface EmailAddress {
  name?: string
  email: string
}

export interface EmailAttachment {
  id: string
  filename: string
  mimeType: string
  size: number
  data?: string // Base64 encoded
}

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'starred' | 'trash'

export interface DraftEmail {
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  htmlBody?: string
  attachments?: File[]
}
