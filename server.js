require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Add axios for making API calls
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
console.log('API Key:', process.env.GEMINI_API_KEY);
// Add Gemini integration here
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;

// Route to handle Gemini API requests
app.post("/api/ai/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }else{
    console.log(prompt);
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${GEMINI_API_URL}?key=${API_KEY}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }
    });

    const output = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    res.json({ output });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Existing routes
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
