export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sdp, session } = req.body;

  // Use the 'form-data' style construction
  const formData = new URLSearchParams();
  formData.append("sdp", sdp);
  formData.append("session", JSON.stringify(session));

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/calls?model=gpt-realtime-mini", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        // IMPORTANT: Do NOT set Content-Type here. 
        // Fetch will set it to 'application/x-www-form-urlencoded' 
        // which is often accepted, or you can use the manual string builder below.
      },
      body: formData
    });

    const data = await response.text();
    // Forward the response (SDP string) to your frontend
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}