require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

// Load API keys securely
const API_KEY = process.env.GEMINI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(bodyParser.json());

let pendingWorks = []; // Stores pending subjects

// ✅ Generate AI Response
app.post("/generate", async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        const result = await model.generateContent(userPrompt);
        let responseText = result.response.candidates[0].content.parts[0].text;

        // Formatting
        responseText = responseText
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
            .replace(/```(\w+)?\n([\s\S]+?)\n```/g, (match, lang, code) => {
                return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
            })
            .replace(/\n/g, "<br>");

        res.json({ response: responseText });
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

// ✅ Add Subject to Pending Work
app.post("/add", (req, res) => {
    const { subject } = req.body;
    if (!subject) return res.status(400).json({ error: "Subject is required" });

    pendingWorks.push(subject);
    res.json({ message: "Added successfully", pendingWorks });
});

// ✅ Get Pending Works
app.get("/pending", (req, res) => {
    res.json(pendingWorks);
});

// ✅ Delete Subject from Pending Work
app.delete("/delete/:index", (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < pendingWorks.length) {
        pendingWorks.splice(index, 1);
        res.json({ message: "Deleted successfully", pendingWorks });
    } else {
        res.status(400).json({ error: "Invalid index" });
    }
});

// ✅ Fetch YouTube Videos
app.get("/youtube", async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}&maxResults=5&type=video`;
        const response = await axios.get(url);

        const videos = response.data.items.map(item => ({
            title: item.snippet.title,
            id: item.id.videoId,
            link: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));

        res.json(videos);
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// ✅ Fetch Books from Google Books API (Only Book Names)
app.get("/books", async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=5`;
        const response = await axios.get(url);

        const books = response.data.items.map(item => ({
            title: item.volumeInfo.title || "Unknown Title"
        }));

        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
