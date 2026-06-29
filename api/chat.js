export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { sdp, session } = req.body;

  const boundary = 'boundary-' + Date.now();
  const body = 
    `--${boundary}\r\nContent-Disposition: form-data; name="sdp"\r\n\r\n${sdp}\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="session"\r\n\r\n${JSON.stringify(session)}\r\n` +
    `--${boundary}--\r\n`;

  const response = await fetch("https://api.openai.com/v1/realtime/calls?model=gpt-realtime-mini", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`
    },
    body: body
  });
  res.status(response.status).send(await response.text());
}