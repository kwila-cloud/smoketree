export function estimateSegments(content: string): number {
  return Math.ceil(content.length / 150);
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function attemptSendMessage(DB: any, messageUuid: string) {
  // Fetch message info from DB
  const msgRow = await DB.prepare(
    `SELECT uuid, organization_uuid as organizationUuid, to_number as "to", content, segments, created_at as createdAt, updated_at as updatedAt FROM message WHERE uuid = ?`,
  )
    .bind(messageUuid)
    .first();
  if (!msgRow) {
    return { error: "Message not found", uuid: messageUuid };
  }
  // Check if the message has already been sent
  const { results: attempts } = await DB.prepare(
    `SELECT * FROM message_attempt WHERE message_uuid = ? AND status == 'sent'`,
  )
    .bind(messageUuid)
    .all();
  if (attempts.length > 0) {
    return { error: "Message already sent", uuid: messageUuid };
  }
  const organizationUuid = msgRow.organizationUuid;
  const createdAt = msgRow.createdAt;
  const month = createdAt.slice(0, 7); // YYYY-MM
  const now = new Date().toISOString();
  // Check monthly segment limit
  const usageRow = await DB.prepare(
    `SELECT COALESCE(SUM(COALESCE(segments, 0)), 0) as used FROM message WHERE organization_uuid = ? AND strftime('%Y-%m', created_at) = ?`,
  )
    .bind(organizationUuid, month)
    .first();
  const used = usageRow ? usageRow.used : 0;
  const limitRow = await DB.prepare(
    `SELECT segment_limit as segmentLimit FROM monthly_limit WHERE organization_uuid = ? AND month = ?`,
  )
    .bind(organizationUuid, month)
    .first();
  const segmentLimit = limitRow ? limitRow.segmentLimit : 0;
  const attemptUuid = crypto.randomUUID();
  if (used > segmentLimit) {
    await DB.prepare(
      `INSERT INTO message_attempt (uuid, message_uuid, status, error_message, attempted_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    )
      .bind(
        attemptUuid,
        messageUuid,
        "rate_limited",
        `Rate limited (used: $used, limit: $segmentLimit)`,
      )
      .run();
    return {...msgRow, attemptUuid};
  }
  await DB.prepare(
    `INSERT INTO message_attempt (uuid, message_uuid, status, attempted_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
  )
    .bind(attemptUuid, messageUuid, "pending")
    .run();
  return {...msgRow, attemptUuid};
}
