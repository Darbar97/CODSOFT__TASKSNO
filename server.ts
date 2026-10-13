import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini initialization as mandated by gemini-api skill
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.5-flash', projectContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const systemInstruction = `You are Master, an elite agile project manager, Scrum Master, and technical delivery architect for Planning Master (a high-velocity Project Management Tool developed by Prem Parmar).
Your mission:
- Help users break down project features and epics into concrete Kanban tasks with titles, descriptions, priorities (urgent, high, medium, low), and deadlines.
- Estimate delivery timelines, milestone dependencies, and sprint burndown.
- Draft clear technical acceptance criteria and test cases.
- Provide practical advice on workload balance, scope management, and agile velocity.
- Keep answers formatted crisply with markdown bullet points, bold key takeaways, and numbered actionable steps.

Current workspace project context:
${projectContext ? JSON.stringify(projectContext, null, 2) : 'Active Project: Project Management Tool'}`;

    // Format contents for @google/genai multi-turn history
    const contents = messages.map((m: { role: 'user' | 'assistant'; text: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Selected model from request or fallback
    const selectedModel = model === 'gemini-3.1-flash-lite' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash';

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I processed your request, but could not generate a response. Please try asking again.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate AI response. Please ensure GEMINI_API_KEY is configured.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PlanPulse server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
