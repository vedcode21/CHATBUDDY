const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 6000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// RapidAPI Credentials
const RAPIDAPI_HOST = 'chatgpt-vision1.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // Store your key in .env

// Chat Route
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            `https://${RAPIDAPI_HOST}/gpt4`, // gpt4 endpoint as per your curl request
            {
                messages: [
                    { role: 'user', content: message },
                ],
                web_access: false, // as per your curl request
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-rapidapi-host': RAPIDAPI_HOST,
                    'x-rapidapi-key': RAPIDAPI_KEY, // API key from .env
                },
            }
        );

        // Check if 'result' exists in the response
        if (response.data && response.data.result) {
            const reply = response.data.result || "No reply from API.";
            res.json({ reply });
        } else {
            console.error('No result in the response:', response.data);
            res.status(500).json({ error: 'No response from API.' });
        }
    } catch (error) {
        console.error('Error with RapidAPI OpenAI:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch response from RapidAPI.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
