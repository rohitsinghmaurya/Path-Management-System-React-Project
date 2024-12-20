import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));

const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error("Gemini API key is missing. Please check your .env file.");
  process.exit(1); 
}

app.get('/api/v1/shortest-path', async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).json({ error: 'Source and destination parameters are required.' });
  }

  try {
   
    const parsedSource = JSON.parse(source); 
    const parsedDestination = JSON.parse(destination); 

    const response = await axios.get('https://api.gemini.com/api/v1/shortest-path', {
      params: { source: parsedSource, destination: parsedDestination },
      headers: {
        "Authorization": `Bearer ${geminiApiKey}`,
      },
    });

    if (!response.data || !response.data.path) {
      return res.status(404).json({ error: 'Shortest path not found.' });
    }

    return res.json(response.data); 
  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    console.error('Request config:', error.config);

    
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || 'An error occurred while processing your request.',
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
