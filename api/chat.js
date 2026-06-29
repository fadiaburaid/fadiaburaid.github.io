// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sdp, session } = req.body;

  // Use a unique boundary string for multipart
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substring(2);

  const body = 
    `--${boundary}\r\nContent-Disposition: form-data; name="sdp"\r\n\r\n${sdp}\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="session"\r\n\r\n${JSON.stringify(session)}\r\n` +
    `--${boundary}--\r\n`;

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/calls?model=gpt-realtime-mini", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        // IMPORTANT: The content-type MUST include the boundary
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      },
      body: body
    });

    const responseText = await response.text();
    
    // Forward the status and response from OpenAI back to your frontend
    res.status(response.status).send(responseText);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}