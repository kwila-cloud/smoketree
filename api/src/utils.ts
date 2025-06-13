export function estimateSegments(content: string): number {
  return Math.ceil(content.length / 150);
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function attemptSendMessage({ DB, organization, messageUuid, month, now }: {
  DB: any;
  organization: any;
  messageUuid: string;
  month: string;
  now: string;
}) {
  // Fetch message info from DB
  const msgRow = await DB.prepare(
    `SELECT uuid, organization_uuid as organizationUuid, to_number as "to", content, segments, current_status as currentStatus, created_at as createdAt, updated_at as updatedAt FROM message WHERE uuid = ? AND organization_uuid = ?`
  ).bind(messageUuid, organization.uuid).first();
  if (!msgRow) {
    return { error: 'Message not found', uuid: messageUuid };
  }
  // Check monthly segment limit
  const usageRow = await DB.prepare(
    `SELECT COALESCE(SUM(COALESCE(segments, 0)), 0) as used FROM message WHERE organization_uuid = ? AND strftime('%Y-%m', created_at) = ?`
  ).bind(organization.uuid, month).first();
  // This will already include the estimated segments for this message, so we don't need to add them again.
  const used = usageRow ? usageRow.used : 0;
  const limitRow = await DB.prepare(
    `SELECT segment_limit as segmentLimit FROM monthly_limit WHERE organization_uuid = ? AND month = ?`
  ).bind(organization.uuid, month).first();
  const segmentLimit = limitRow ? limitRow.segmentLimit : 0;
  if (used > segmentLimit) {
    await DB.prepare(
      `INSERT INTO message_attempt (uuid, message_uuid, status, error_message, attempted_at) VALUES (?, ?, ?, ?, ?)`
    ).bind(crypto.randomUUID(), messageUuid, 'rate_limited', 'Rate limited', now).run();
    return {
      ...msgRow,
      currentStatus: 'rate_limited',
      error: 'Rate limited',
    };
  }
  await DB.prepare(
    `INSERT INTO message_attempt (uuid, message_uuid, status, attempted_at) VALUES (?, ?, ?, ?)`
  ).bind(crypto.randomUUID(), messageUuid, 'pending', now).run();
  return {
    ...msgRow,
    currentStatus: 'pending',
  };
}
