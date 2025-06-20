// Cloudflare Worker scheduled trigger: send pending message attempts every minute
import { sendSms } from "../twilio";
import { estimateSegments } from "../utils";

export const scheduled = async (event: ScheduledEvent, env: any, ctx: any) => {
  const DB = env.DB;
  // Find up to 10 pending attempts (not sent, not failed)
  const rows = await DB.prepare(
    `SELECT a.uuid as attemptUuid, a.message_uuid as messageUuid, m.to_number as to, m.content, m.organization_uuid as organizationUuid
       FROM message_attempt a
       JOIN message m ON a.message_uuid = m.uuid
       WHERE a.status = 'pending'
       ORDER BY a.attempted_at ASC
       LIMIT 10`
  ).all();
  for (const row of rows.results) {
    try {
      // TODO: fetch Twilio credentials from env or org config
      const twilioConfig = {
        from: env.TWILIO_FROM,
        accountSid: env.TWILIO_ACCOUNT_SID,
        authToken: env.TWILIO_AUTH_TOKEN,
      };
      const smsResult = await sendSms({
        to: row.to,
        content: row.content,
        ...twilioConfig,
      });
      // Mark attempt as sent
      await DB.prepare(
        `UPDATE message_attempt SET status = 'sent', twilio_message_sid = ?, attempted_at = CURRENT_TIMESTAMP WHERE uuid = ?`
      ).bind(smsResult.sid, row.attemptUuid).run();
      // Update message status
      await DB.prepare(
        `UPDATE message SET current_status = 'sent', segments = ? WHERE uuid = ?`
      ).bind(smsResult.segments, row.messageUuid).run();
    } catch (err: any) {
      // Mark attempt as failed
      await DB.prepare(
        `UPDATE message_attempt SET status = 'failed', error_message = ?, attempted_at = CURRENT_TIMESTAMP WHERE uuid = ?`
      ).bind(err.message || String(err), row.attemptUuid).run();
      // Update message status
      await DB.prepare(
        `UPDATE message SET current_status = 'failed' WHERE uuid = ?`
      ).bind(row.messageUuid).run();
    }
  }
};
