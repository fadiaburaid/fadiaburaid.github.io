export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sdp, session } = req.body;

  // We use FormData to automatically handle the multipart/form-data boundaries
  // This is the standard way to do this in Vercel/Node.js
  const formData = new FormData();
  formData.append("sdp", sdp);
  formData.append("session", JSON.stringify(session));

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/calls?model=gpt-realtime-mini", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        // DO NOT set Content-Type here. FormData will set the correct
        // 'multipart/form-data; boundary=...' header for you automatically.
      },
      body: formData
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}