export async function getUserProfile() {}

export async function fetchAllEmails(folderId: string, pageToken?: string) {}

export async function fetchEmailById(emailId: string) {}

export async function sendEmail(to: string, subject: string, body: string) {}

export async function deleteEmail(emailId: string) {}

export async function markEmailAsRead(emailId: string) {}
