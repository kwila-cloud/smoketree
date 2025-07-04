import { attemptSendMessage, estimateSegments, getCurrentMonth } from '../src/utils';
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { createTestDb } from './utils';

describe('estimateSegments', () => {
  test('should correctly estimate segments for short content', () => {
    expect(estimateSegments('hello')).toBe(1);
  });

  test('should correctly estimate segments for content exactly 150 characters', () => {
    expect(estimateSegments('a'.repeat(150))).toBe(1);
  });

  test('should correctly estimate segments for content over 150 characters', () => {
    expect(estimateSegments('a'.repeat(151))).toBe(2);
  });

  test('should correctly estimate segments for empty content', () => {
    expect(estimateSegments('')).toBe(0);
  });
});

describe('getCurrentMonth', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-07-15T10:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test('should return the current month in YYYY-MM format', () => {
    expect(getCurrentMonth()).toBe('2024-07');
  });
});

describe('attemptSendMessage', () => {
  let db: any;
  const ORG_UUID = 'org-test-uuid';
  const MESSAGE_UUID = 'msg-test-uuid';
  const NOW = '2024-07-01T00:00:00Z';
  const MONTH = '2024-07';

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations([ORG_UUID]);
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'mock-uuid'),
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    db.close();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('should return error if message not found', async () => {
    const result = await attemptSendMessage(db, 'non-existent-uuid');
    expect(result).toEqual({ error: 'Message not found', uuid: 'non-existent-uuid' });
  });

  test('should return error if message already sent', async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(MESSAGE_UUID, ORG_UUID, '123', 'hello', 1, 'sent', NOW, NOW).run();

    const result = await attemptSendMessage(db, MESSAGE_UUID);
    expect(result).toEqual({
      uuid: MESSAGE_UUID,
      organizationUuid: ORG_UUID,
      to: '123',
      content: 'hello',
      segments: 1,
      createdAt: NOW,
      updatedAt: NOW,
    });
  });

  test('should return rate_limited if usage exceeds segment limit', async () => {
    // Set a monthly limit
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, updated_at) VALUES (?, ?, ?, ?)`
    ).bind(ORG_UUID, MONTH, 50, NOW).run();

    // Insert messages that exceed the limit
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind('msg-1', ORG_UUID, '123', 'content1', 40, 'sent', NOW, NOW).run();
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind('msg-2', ORG_UUID, '123', 'content2', 15, 'pending', NOW, NOW).run(); // This one will be rate-limited

    const result = await attemptSendMessage(db, 'msg-2');
    expect(result).toEqual({
      uuid: 'msg-2',
      organizationUuid: ORG_UUID,
      createdAt: NOW,
      segments: 15,
      content: 'content2',
      to: '123',
      updatedAt: NOW,
    });

    // Verify message attempt was recorded
    const attempt = await db.prepare(`SELECT status, error_message FROM message_attempt WHERE message_uuid = ?`).bind('msg-2').first();
    expect(attempt).toEqual({ status: 'rate_limited', error_message: 'Rate limited' });
  });

  test('should successfully update message status and insert message attempt', async () => {
    // Set a sufficient monthly limit
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, updated_at) VALUES (?, ?, ?, ?)`
    ).bind(ORG_UUID, MONTH, 100, NOW).run();

    // Insert a new message
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(MESSAGE_UUID, ORG_UUID, '123', 'hello', 10, 'pending', NOW, NOW).run();

    const result = await attemptSendMessage(db, MESSAGE_UUID);
    expect(result).toEqual({
      uuid: MESSAGE_UUID,
      organizationUuid: ORG_UUID,
      to: '123',
      content: 'hello',
      segments: 10,
      createdAt: NOW,
      updatedAt: expect.any(String), // updated_at will be CURRENT_TIMESTAMP
    });

    // Verify message status was updated
    const updatedMsg = await db.prepare(`SELECT current_status FROM message WHERE uuid = ?`).bind(MESSAGE_UUID).first();
    expect(updatedMsg.current_status).toBe('pending');

    // Verify message attempt was recorded
    const attempt = await db.prepare(`SELECT status FROM message_attempt WHERE message_uuid = ?`).bind(MESSAGE_UUID).first();
    expect(attempt.status).toBe('pending');
  });

  test('should return rate_limited if no usage limit is set (default to 0)', async () => {
    // No monthly_limit inserted for ORG_UUID and MONTH

    // Insert a new message with 1 segment
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(MESSAGE_UUID, ORG_UUID, '123', 'hello', 1, 'pending', NOW, NOW).run();

    const result = await attemptSendMessage(db, MESSAGE_UUID);
    expect(result).toEqual({
      uuid: MESSAGE_UUID,
      organizationUuid: ORG_UUID,
      createdAt: NOW,
      segments: 1,
      content: 'hello',
      to: '123',
      updatedAt: NOW,
    });

    // Verify message attempt was recorded
    const attempt = await db.prepare(`SELECT status, error_message FROM message_attempt WHERE message_uuid = ?`).bind(MESSAGE_UUID).first();
    expect(attempt).toEqual({ status: 'rate_limited', error_message: 'Rate limited' });
  });
});
