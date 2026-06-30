// /api/vector-search.js
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') return res.status(405).end();

  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  try {
    // Correct Beta API call targeting your exact vector store ID
    const searchResponse = await openai.beta.vectorStores.search(
      "vs_6a40d0dee08c8191811c00a2457adbd7",
      { 
        query: query,
        max_num_results: 5 // Pull a few extra chunks for richer context matching
      }
    );

    // Parse out data according to the official schema format
    if (searchResponse && searchResponse.data && searchResponse.data.length > 0) {
      const textChunks = searchResponse.data.flatMap(item => {
        if (item.content) {
          // Map out the internal structural parts array containing type: "text"
          return item.content
            .filter(part => part.type === 'text')
            .map(part => part.text);
        }
        return [];
      }).filter(Boolean);

      const consolidatedContext = textChunks.join("\n\n");
      
      return res.status(200).json({ results: consolidatedContext });
    }

    return res.status(200).json({ results: "No matching background data found in knowledge base files." });

  } catch (error) {
    console.error("OpenAI Vector Store runtime retrieval error:", error);
    return res.status(500).json({ error: error.message });
  }
}
