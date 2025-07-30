app.post('/compete', async (req, res) => {
  const prompt = req.body.prompt;
  const models = [
    'openai/gpt-4o',
    'anthropic/claude-3-haiku',
    'meta-llama/llama-3-70b-instruct',
    'mistralai/mistral-7b-instruct',
    'google/gemini-pro'
  ];

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'HTTP-Referer': 'https://yourdomain.com',  // update with your actual domain
    'X-Title': 'Storyline Integration'
  };

  const messages = [{ role: 'user', content: prompt }];

  try {
    const responses = await Promise.all(models.map(async model => {
      try {
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers,
          body: JSON.stringify({ model, messages })
        });
        const data = await resp.json();
        return { model, content: data.choices[0]?.message?.content || "No response" };
      } catch (err) {
        return { model, content: `Error: ${err.message}` };
      }
    }));

    const result = {};
    responses.forEach(r => {
      result[r.model] = r.content;
    });

    res.json(result);
  } catch (error) {
    console.error('Error in /compete:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});
