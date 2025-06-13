// Types for DB entities and API responses
export type Organization = {
  uuid: string;
  name: string;
  adminApiKey: string;
  userApiKey: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  uuid: string;
  organizationUuid: string;
  to: string;
  content: string;
  segments: number | null;
  currentStatus: 'pending' | 'sent' | 'failed' | 'rate_limited';
  createdAt: string;
  updatedAt: string;
};

export type MessageAttempt = {
  uuid: string;
  messageUuid: string;
  status: 'pending' | 'sent' | 'failed' | 'rate_limited';
  twilioMessageSid?: string;
  errorMessage?: string;
  attemptedAt: string;
};

export type MonthlyLimit = {
  organizationUuid: string;
  month: string; // YYYY-MM
  segmentLimit: number;
  createdAt: string;
  updatedAt: string;
};
