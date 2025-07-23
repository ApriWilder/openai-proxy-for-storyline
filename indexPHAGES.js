import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://yourdomain.com', // Replace with your actual domain
        'X-Title': 'Storyline Integration'
      },
      body: JSON.stringify({
        model: req.body.model || 'openai/gpt-4',  // Allow client to choose model
        messages: req.body.messages
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Something went wrong.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
