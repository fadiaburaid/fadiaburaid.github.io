// api/chat.js (Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const response = await fetch("https://api.openai.com/v1/realtime/calls?model=gpt-realtime-mini", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.text();
  res.status(response.status).send(data);
}