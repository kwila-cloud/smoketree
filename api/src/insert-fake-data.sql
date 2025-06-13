-- Insert a fake organization
INSERT INTO organization (uuid, name) VALUES
  ('org-1234', 'Acme Corp');

-- Insert a fake API key for the organization
INSERT INTO api_key (key, type, organization_uuid) VALUES
  ('key-abc123', 'admin', 'org-1234'),
  ('key-user456', 'user', 'org-1234');

-- Insert a monthly limit for the organization
INSERT INTO monthly_limit (organization_uuid, month, segment_limit) VALUES
  ('org-1234', '2025-06', 1000);

-- Insert a fake message
INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status) VALUES
  ('msg-001', 'org-1234', '+15555550123', 'Hello world!', 1, 'sent'),
  ('msg-002', 'org-1234', '+15555550124', 'Test message', 1, 'pending');

-- Insert message attempts for the messages
INSERT INTO message_attempt (uuid, message_uuid, status, twilio_message_sid, error_message) VALUES
  ('attempt-001', 'msg-001', 'sent', 'SM1234567890', NULL),
  ('attempt-002', 'msg-002', 'pending', NULL, NULL);
