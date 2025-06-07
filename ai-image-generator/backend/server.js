require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables for API keys
const UNSPLASH_API = process.env.UNSPLASH_API;
const PIXABAY_API = process.env.PIXABAY_API;
const RUNWARE_API = process.env.RUNWARE_API;

// Proxy route for Unsplash
app.post('/api/unsplash', async (req, res) => {
    try {
        const { query, page } = req.body;
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_API}&page=${page}&per_page=6`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy route for Pixabay
app.post('/api/pixabay', async (req, res) => {
    try {
        const { query } = req.body;
        const response = await fetch(
            `https://pixabay.com/api/?key=${PIXABAY_API}&q=${encodeURIComponent(query)}&image_type=photo&per_page=6`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy route for Runware
app.post('/api/runware', async (req, res) => {
    try {
        const { query } = req.body;
        const rawData = [
            {
                taskType: "authentication",
                apiKey: RUNWARE_API,
            },
            {
                taskType: "imageInference",
                taskUUID: "39d7207a-87ef-4c93-8082-1431f9c1dc97",
                positivePrompt: query,
                width: 512,
                height: 512,
                model: "civitai:102438@133677",
                numberResults: 1,
            },
        ];

        const response = await fetch('https://api.runware.ai/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rawData),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
