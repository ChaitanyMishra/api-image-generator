require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Compression for faster asset delivery
const compression = require('compression');
app.use(compression());
// Serve static files with cache headers
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api', limiter);

// Environment variables
const {
    UNSPLASH_API,
    PIXABAY_API,
    RUNWARE_API,
    RUNWARE_UUID,
    RUNWARE_MODEL,
    PORT = 10000
} = process.env;

// ======================== ROUTES ========================

// Unsplash Proxy
app.post('/api/unsplash', async (req, res) => {
    try {
        const { query, page = 1 } = req.body;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Invalid query for Unsplash' });
        }

        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_API}&page=${page}&per_page=6`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Unsplash API error:', error);
        res.status(500).json({ error: 'Failed to fetch from Unsplash' });
    }
});

// Pixabay Proxy
app.post('/api/pixabay', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Invalid query for Pixabay' });
        }

        const url = `https://pixabay.com/api/?key=${PIXABAY_API}&q=${encodeURIComponent(query)}&image_type=photo&per_page=6`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Pixabay API error:', error);
        res.status(500).json({ error: 'Failed to fetch from Pixabay' });
    }
});

// Runware Proxy
app.post('/api/runware', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Invalid prompt for Runware' });
        }

        const requestBody = [
            {
                taskType: "authentication",
                apiKey: RUNWARE_API,
            },
            {
                taskType: "imageInference",
                taskUUID: RUNWARE_UUID,
                positivePrompt: query,
                width: 512,
                height: 512,
                model: RUNWARE_MODEL,
                numberResults: 1,
            },
        ];

        const response = await fetch('https://api.runware.ai/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Runware API error:', error);
        res.status(500).json({ error: 'Failed to fetch from Runware' });
    }
});

// Send index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ======================== START SERVER ========================
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
