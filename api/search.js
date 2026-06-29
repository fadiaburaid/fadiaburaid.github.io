import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { query } = JSON.parse(req.body);
  
  // 1. Create a thread
  const thread = await openai.beta.threads.create();
  
  // 2. Add the user's question
  await openai.beta.threads.messages.create(thread.id, { role: "user", content: query });
  
  // 3. Run the Assistant with File Search
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: process.env.ASSISTANT_ID
  });

  // 4. Get the response
  const messages = await openai.beta.threads.messages.list(thread.id);
  const answer = messages.data[0].content[0].text.value;
  
  res.status(200).send(answer);
}