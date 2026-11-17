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
  const orders = new Map<string, any>([
    ['GBY-98421', {
      orderId: 'GBY-98421',
      items: [{ name: 'Heavy Cotton Raw Denim Cargo Hoodie', price: 185, qty: 1 }],
      total: 185,
      status: 'Shipped',
      estimatedDelivery: 'Nov 20, 2026',
      shippingAddress: '742 Evergreen Terrace, Springfield',
      date: '2026-11-14'
    }],
    ['GBY-44120', {
      orderId: 'GBY-44120',
      items: [{ name: 'Artisanal Botanical Serum No. 3', price: 68, qty: 2 }],
      total: 136,
      status: 'Processing',
      estimatedDelivery: 'Nov 22, 2026',
      shippingAddress: '100 Market St, San Francisco, CA',
      date: '2026-11-16'
    }]
  ]);

  // API Routes
  app.post('/api/ai/concierge', async (req, res) => {
    try {
      const { prompt, history } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const systemInstruction = `You are Gebyian AI, an expert, sophisticated, and warm personal shopping concierge for Gebyian Network, an elite curated multi-category e-commerce platform featuring artisanal goods, streetwear apparel, precision tech gear, and luxury lifestyle items. Help customers discover products, advise on sizing, materials, styling, and gift recommendations with refined taste and concise answers.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      res.json({ text: response.text || "I'm here to help you navigate our curated collections at Gebyian Network." });
    } catch (error: any) {
      console.error('Gemini AI Concierge Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate concierge response' });
    }
  });

  app.post('/api/orders', (req, res) => {
    try {
      const { items, total, shippingAddress, customerName, email, phone } = req.body;
      const orderId = `GBY-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder = {
        orderId,
        items,
        total,
        shippingAddress,
        customerName,
        email,
        phone,
        status: 'Confirmed & Processing',
        estimatedDelivery: '3-5 Business Days',
        date: new Date().toISOString().split('T')[0]
      };
      orders.set(orderId, newOrder);
      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id.toUpperCase();
    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found in Gebyian Network records.' });
    }
    res.json(order);
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
