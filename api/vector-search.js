import { OpenAI } from "openai";

// Initialize OpenAI client using your secure environment variable
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  // Only allow GET requests for reading information
  if (req.method !== 'GET') return res.status(405).end();

  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  try {
    // Query your target OpenAI Vector Store directly using semantic search
    const searchResponse = await openai.beta.vectorStores.search({
      vector_store_id: "vs_6a40d0dee08c8191811c00a2457adbd7",
      query: query,
      max_num_results: 3 // Restricts output footprint to optimize response speed
    });

    // Extract text snippets from the returned search chunk results
    if (searchResponse && searchResponse.data) {
      const textChunks = searchResponse.data.map(item => {
        if (item.chunk && item.chunk.text) {
          return item.chunk.text;
        }
        return "";
      }).filter(Boolean);

      const consolidatedContext = textChunks.join("\n\n");
      
      return res.status(200).json({ results: consolidatedContext });
    }

    return res.status(200).json({ results: "No matching context found in the vector store." });

  } catch (error) {
    console.error("OpenAI Vector Store search failure:", error);
    return res.status(500).json({ error: error.message });
  }
}
