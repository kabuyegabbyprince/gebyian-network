import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize GoogleGenAI server-side client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // In-memory order store for demo
  const orders = new Map<string, any>();

  // API Routes
  app.post('/api/ai/concierge', async (req, res) => {
    try {
      const { prompt, language } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const langContext = language === 'rw' 
        ? 'Respond in Kinyarwanda.' 
        : language === 'fr' 
        ? 'Respond in French.' 
        : 'Respond in English.';

      const systemInstruction = `You are Gebyian Agro AI, an expert veterinary and agricultural advisor for Gebyian Network, a premier e-commerce platform specializing in live livestock (cows, goats, pigs, chickens), processed meat, and animal feeds (maize bran, broiler mash, cattle concentrates). Help farmers and buyers with livestock selection, feeding ratios, veterinary advice, and cold-chain purchasing in Rwanda and East Africa. ${langContext}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      res.json({ text: response.text || "I am here to assist you with livestock and animal feeds." });
    } catch (error: any) {
      console.error('Gemini AI Concierge Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI response' });
    }
  });

  app.post('/api/orders', (req, res) => {
    try {
      const { items, total, shippingAddress, customerName, phone } = req.body;
      const orderId = `GBY-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = {
        orderId,
        items,
        total,
        shippingAddress,
        customerName,
        phone,
        status: 'Confirmed & Dispatching via Cold-Chain',
        estimatedDelivery: '24-48 Hours',
        date: new Date().toISOString().split('T')[0]
      };
      orders.set(orderId, newOrder);
      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Gebyian Network server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
