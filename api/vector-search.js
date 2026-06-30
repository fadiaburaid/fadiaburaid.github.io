// /api/vector-search.js
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') return res.status(405).end();

  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  const vectorStoreId = "vs_6a40d0dee08c8191811c00a2457adbd7";

  try {
    // Make a direct REST call to OpenAI's Vector Store search backend endpoint
    const response = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/search`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2" // Vital required header for beta endpoints
      },
      body: JSON.stringify({
        query: query,
        max_num_results: 5
      })
    });

    const searchResponse = await response.json();

    if (!response.ok) {
      console.error("OpenAI Endpoint responded with error:", searchResponse);
      return res.status(response.status).json({ error: searchResponse.error?.message || "OpenAI error" });
    }

    // Safely unpack text chunks matching OpenAI's structural search payload schema
    if (searchResponse && searchResponse.data && searchResponse.data.length > 0) {
      const textChunks = searchResponse.data.flatMap(item => {
        if (item.content) {
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
    console.error("OpenAI Vector Store native network retrieval error:", error);
    return res.status(500).json({ error: error.message });
  }
}
