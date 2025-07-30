// pages/api/chat.js
export default async function handler(req, res) {
  const { message } = req.body;

  const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
      'HTTP-Referer': 'https://nextjs-ai-chatbot-gules-tau-35.vercel.app/',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1:free",
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await openRouterRes.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}
