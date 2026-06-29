export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sdp, session } = req.body;

  // Manually construct the multipart/form-data payload
  const boundary = 'boundary-' + Date.now();
  const body = 
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="sdp"\r\n\r\n` +
    `${sdp}\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="session"\r\n\r\n` +
    `${JSON.stringify(session)}\r\n` +
    `--${boundary}--\r\n`;

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/calls?model=gpt-realtime-mini", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      },
      body: body
    });

    const data = await response.text();
    
    if (!response.ok) {
        return res.status(response.status).send(data);
    }

    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
