# Smoketree API Service - Technical Design Document

## Overview

This document outlines the design for an SMS API service built on Cloudflare Workers that provides organizations with multi-tenant SMS capabilities using Twilio as the SMS provider.

## Architecture

### Technology Stack
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **SMS Provider**: Twilio API
- **Authentication**: API Key-based

### Core Features
- Organization-based multi-tenancy
- Monthly segment limits per organization
- Message retry functionality
- Usage tracking and reporting
- Admin and user-level API access

## Database Schema

### Organization Table
```sql
CREATE TABLE organization (
  uuid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  admin_api_key TEXT UNIQUE NOT NULL,
  user_api_key TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organization_admin_key ON organization(admin_api_key);
CREATE INDEX idx_organization_user_key ON organization(user_api_key);
```

### Message Table
```sql
CREATE TABLE message (
  uuid TEXT PRIMARY KEY,
  organization_uuid TEXT NOT NULL,
  to_number TEXT NOT NULL,
  content TEXT NOT NULL,
  segments INTEGER, -- Populated from Twilio response, NULL until sent
  current_status TEXT NOT NULL CHECK (current_status IN ('pending', 'sent', 'failed', 'rate_limited')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_uuid) REFERENCES organization(uuid)
);

CREATE INDEX idx_message_org_uuid ON message(organization_uuid);
CREATE INDEX idx_message_status ON message(current_status);
CREATE INDEX idx_message_created_at ON message(created_at);
CREATE INDEX idx_message_org_month ON message(organization_uuid, created_at);
```

### Message Attempt Table
```sql
CREATE TABLE message_attempt (
  uuid TEXT PRIMARY KEY,
  message_uuid TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'rate_limited')),
  twilio_message_sid TEXT,
  error_message TEXT,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_uuid) REFERENCES message(uuid)
);

CREATE INDEX idx_attempt_message_uuid ON message_attempt(message_uuid);
CREATE INDEX idx_attempt_attempted_at ON message_attempt(attempted_at);
```

### Monthly Limit Table
```sql
CREATE TABLE monthly_limit (
  organization_uuid TEXT NOT NULL,
  month TEXT NOT NULL, -- Format: YYYY-MM
  segment_limit INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (organization_uuid, month),
  FOREIGN KEY (organization_uuid) REFERENCES organization(uuid)
);

CREATE INDEX idx_limit_month ON monthly_limit(month);
```

## API Specification

### Authentication
All requests must include an API key in the `X-API-Key` header. Each organization has two API keys:
- **Admin API Key**: Full access to all endpoints
- **User API Key**: Limited access (cannot modify limits)

### Endpoints

#### Send SMS Message
```
POST /api/v1/messages
Content-Type: application/json
X-API-Key: {api_key}

{
  "to": "+1234567890",
  "content": "Hello, world!"
}

Response 200:
{
  "uuid": "message-uuid",
  "organizationUuid": "org-uuid",
  "to": "+1234567890",
  "content": "Hello, world!",
  "segments": null, // Will be populated after sending
  "currentStatus": "pending",
  "createdAt": "2023-12-01T10:00:00Z",
  "updatedAt": "2023-12-01T10:00:00Z"
}

Response 429 (Rate Limited):
{
  "error": "Monthly segment limit exceeded",
  "messageUuid": "message-uuid", // For retry purposes
  "currentUsage": 995,
  "monthlyLimit": 1000
}
```

#### Get Message Status
```
GET /api/v1/messages/{messageUuid}
X-API-Key: {api_key}

Response 200:
{
  "uuid": "message-uuid",
  "organizationUuid": "org-uuid",
  "to": "+1234567890",
  "content": "Hello, world!",
  "segments": 2,
  "currentStatus": "sent",
  "createdAt": "2023-12-01T10:00:00Z",
  "updatedAt": "2023-12-01T10:00:05Z"
}
```

#### Retry Message
```
POST /api/v1/messages/{messageUuid}/retry
X-API-Key: {api_key}

Response 200:
{
  "uuid": "message-uuid",
  "organizationUuid": "org-uuid",
  "to": "+1234567890",
  "content": "Hello, world!",
  "segments": 2,
  "currentStatus": "sent",
  "createdAt": "2023-12-01T10:00:00Z",
  "updatedAt": "2023-12-01T10:01:00Z"
}
```

#### List Messages
```
GET /api/v1/messages?status={status}&limit={limit}&offset={offset}
X-API-Key: {api_key}

Response 200:
{
  "messages": [...],
  "total": 245,
  "limit": 50,
  "offset": 0
}
```

#### Get Usage Statistics
```
GET /api/v1/usage
GET /api/v1/usage/{YYYY-MM}
X-API-Key: {api_key}

Response 200:
{
  "month": "2023-12",
  "totalMessages": 245,
  "totalSegments": 487,
  "segmentLimit": 1000,
  "isLimitExceeded": false,
  "remainingSegments": 513
}
```

#### Manage Monthly Limits (Admin Only)
```
GET /api/v1/limits
GET /api/v1/limits/{YYYY-MM}
PUT /api/v1/limits/{YYYY-MM}
X-API-Key: {admin_api_key}

PUT Request Body:
{
  "segmentLimit": 1500
}

Response 200:
{
  "month": "2023-12",
  "segmentLimit": 1500,
  "updatedAt": "2023-12-01T10:00:00Z"
}
```

## Business Logic

### Segment Calculation and Rate Limiting

#### Pre-Send Rate Limiting
1. Estimate segments using: `Math.ceil(content.length / 140)`
2. Query current month segment usage for organization
3. Check if estimated total would exceed monthly limit
4. If exceeded: Create message with `rate_limited` status
5. If allowed: Proceed with Twilio API call

#### Post-Send Segment Tracking
1. Extract actual segments from Twilio response: `response.num_segments`
2. Update message record with actual segment count
3. Update status based on Twilio result

### Message Status Flow
```
pending → sent (success)
pending → failed (Twilio error)
pending → rate_limited (limit exceeded)

rate_limited → sent (retry after limit increase)
rate_limited → failed (retry failed)
failed → sent (successful retry)
failed → failed (retry failed again)
```

### Key Queries

#### Current Month Usage
```sql
SELECT COALESCE(SUM(segments), 0) as used_segments
FROM message 
WHERE organization_uuid = ? 
AND strftime('%Y-%m', created_at) = ?
AND current_status = 'sent'
AND segments IS NOT NULL;
```

#### Monthly Limit Lookup
```sql
SELECT segment_limit 
FROM monthly_limit 
WHERE organization_uuid = ? AND month = ?;
```

#### Retryable Messages
```sql
SELECT * FROM message 
WHERE organization_uuid = ? 
AND current_status IN ('failed', 'rate_limited')
ORDER BY created_at DESC;
```

## API Permission Matrix

| Endpoint | User API Key | Admin API Key |
|----------|-------------|---------------|
| `POST /messages` | ✅ | ✅ |
| `GET /messages/:uuid` | ✅ | ✅ |
| `POST /messages/:uuid/retry` | ✅ | ✅ |
| `GET /messages` | ✅ | ✅ |
| `GET /usage` | ✅ | ✅ |
| `GET /limits` | ✅ | ✅ |
| `PUT /limits/:month` | ❌ | ✅ |

## Error Handling

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid/missing API key)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (message/organization not found)
- `429` - Rate Limited (segment limit exceeded) 
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Human readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional context"
  }
}
```

## Implementation Notes

### Rate Limiting Strategy
- Uses **estimate-based limiting**
- Estimates segments before sending to Twilio
- Actual usage may slightly exceed limits in edge cases
- Provides better user experience vs conservative limiting

### Segment Tracking
- `segments` field is `NULL` until message is successfully sent
- Only successful messages (`sent` status) with non-NULL segments count toward usage
- Failed and rate-limited messages consume no segments

### Retry Logic
- Retries are manual (API-driven), not automatic
- Messages can be retried unlimited times
- Each retry creates a new `message_attempt` record
- Rate-limited messages can be retried after limit increases

### Month-Specific Limits
- Organizations can set different limits for each month
- Format: `YYYY-MM` (e.g., "2024-01")
- No limit means a limit of 0

## Configuration

### Environment Variables
- `TWILIO_ACCOUNT_SID` - Twilio account identifier
- `TWILIO_AUTH_TOKEN` - Twilio authentication token
- `TWILIO_FROM_NUMBER` - Default sending phone number
- `DATABASE_ID` - Cloudflare D1 database identifier
- `DEFAULT_SEGMENT_LIMIT` - Default monthly limit for new organizations

This design provides a robust, scalable SMS API service with proper multi-tenancy, rate limiting, and usage tracking capabilities.
