export function estimateSegments(content: string): number {
  return Math.ceil(content.length / 150);
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function attemptSendMessage(DB: any, messageUuid: string) {
  // Fetch message info from DB
  const msgRow = await DB.prepare(
    `SELECT uuid, organization_uuid as organizationUuid, to_number as "to", content, segments, current_status as currentStatus, created_at as createdAt, updated_at as updatedAt FROM message WHERE uuid = ?`
  ).bind(messageUuid).first();
  if (!msgRow) {
    return { error: 'Message not found', uuid: messageUuid };
  }
  if (msgRow.currentStatus === 'sent') {
    return { ...msgRow, error: 'Message already sent' };
  }
  const organizationUuid = msgRow.organizationUuid;
  const createdAt = msgRow.createdAt;
  const month = createdAt.slice(0, 7); // YYYY-MM
  const now = new Date().toISOString();
  // Check monthly segment limit
  const usageRow = await DB.prepare(
    `SELECT COALESCE(SUM(COALESCE(segments, 0)), 0) as used FROM message WHERE organization_uuid = ? AND strftime('%Y-%m', created_at) = ?`
  ).bind(organizationUuid, month).first();
  const used = usageRow ? usageRow.used : 0;
  const limitRow = await DB.prepare(
    `SELECT segment_limit as segmentLimit FROM monthly_limit WHERE organization_uuid = ? AND month = ?`
  ).bind(organizationUuid, month).first();
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
    `UPDATE message SET current_status = 'pending', updated_at = CURRENT_TIMESTAMP WHERE uuid = ?`
  ).bind(messageUuid).run();
  await DB.prepare(
    `INSERT INTO message_attempt (uuid, message_uuid, status, attempted_at) VALUES (?, ?, ?, ?)`
  ).bind(crypto.randomUUID(), messageUuid, 'pending', now).run();
  const finalMsgRow = await DB.prepare(
    `SELECT uuid, organization_uuid as organizationUuid, to_number as "to", content, segments, current_status as currentStatus, created_at as createdAt, updated_at as updatedAt FROM message WHERE uuid = ?`
  ).bind(messageUuid).first();
  return finalMsgRow;
}
