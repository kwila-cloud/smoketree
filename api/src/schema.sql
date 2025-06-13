CREATE TABLE IF NOT EXISTS organization (
  uuid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_key (
  key TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('admin', 'user')),
  organization_uuid TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_uuid) REFERENCES organization(uuid)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_api_key_key ON api_key(key);

CREATE INDEX IF NOT EXISTS idx_organization_uuid ON organization(uuid);

CREATE TABLE IF NOT EXISTS message (
  uuid TEXT PRIMARY KEY,
  organization_uuid TEXT NOT NULL,
  to_number TEXT NOT NULL,
  content TEXT NOT NULL,
  segments INTEGER,
  current_status TEXT NOT NULL CHECK (current_status IN ('pending', 'sent', 'failed', 'rate_limited')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_uuid) REFERENCES organization(uuid)
);
CREATE INDEX IF NOT EXISTS idx_message_org_uuid ON message(organization_uuid);
CREATE INDEX IF NOT EXISTS idx_message_status ON message(current_status);
CREATE INDEX IF NOT EXISTS idx_message_created_at ON message(created_at);
CREATE INDEX IF NOT EXISTS idx_message_org_month ON message(organization_uuid, created_at);

CREATE TABLE IF NOT EXISTS message_attempt (
  uuid TEXT PRIMARY KEY,
  message_uuid TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'rate_limited')),
  twilio_message_sid TEXT,
  error_message TEXT,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_uuid) REFERENCES message(uuid)
);
CREATE INDEX IF NOT EXISTS idx_attempt_message_uuid ON message_attempt(message_uuid);
CREATE INDEX IF NOT EXISTS idx_attempt_attempted_at ON message_attempt(attempted_at);

CREATE TABLE IF NOT EXISTS monthly_limit (
  organization_uuid TEXT NOT NULL,
  month TEXT NOT NULL,
  segment_limit INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (organization_uuid, month),
  FOREIGN KEY (organization_uuid) REFERENCES organization(uuid)
);
CREATE INDEX IF NOT EXISTS idx_limit_month ON monthly_limit(month);
