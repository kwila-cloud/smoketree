// Twilio SMS sending utility for Cloudflare Workers
export async function sendSms({
  to,
  content,
  from,
  accountSid,
  authToken,
}: {
  to: string;
  content: string;
  from: string;
  accountSid: string;
  authToken: string;
}): Promise<{ sid: string; segments: number }> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const body = new URLSearchParams({
    To: to,
    From: from,
    Body: content,
  });
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + btoa(`${accountSid}:${authToken}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!resp.ok) {
    const error = await resp.text();
    throw new Error(error);
  }
  const data = await resp.json();
  return { sid: data.sid, segments: parseInt(data.num_segments, 10) };
}
