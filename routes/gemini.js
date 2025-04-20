const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const output = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    res.json({ output });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

module.exports = router;
