// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // 1. Receive data from your frontend
  const { sdp, session } = req.body;

  // 2. Reconstruct the FormData as required by OpenAI
  const formData = new URLSearchParams();
  formData.append("sdp", sdp);
  formData.append("session", JSON.stringify(session));

  // 3. Forward to OpenAI
  const response = await fetch("https://api.openai.com/v1/realtime/calls?model=gpt-realtime-mini", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      // Do NOT set Content-Type manually; let fetch set it automatically 
      // with the correct boundary for multipart/form-data
    },
    body: formData
  });

  const data = await response.text();
  res.status(response.status).send(data);
}