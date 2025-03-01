require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

const API_KEY = process.env.GEMINI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const TRIVIA_API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";

app.use(cors());
app.use(bodyParser.json());

let pendingWorks = []; // Stores pending subjects
let savedSessions = []; // Stores whiteboard sessions

// ✅ AI Content Generation (If API Key Available)
if (API_KEY) {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    app.post("/generate", async (req, res) => {
        try {
            const userPrompt = req.body.prompt;
            const result = await model.generateContent(userPrompt);
            let responseText = result.response.candidates[0].content.parts[0].text;

            // Formatting Response
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
}

// ✅ Generate MCQ Quiz from Open Trivia Database
app.post("/get-mcq", async (req, res) => {
    console.log("Incoming request to /get-mcq:", req.body);

    const { category } = req.body;
    if (!category) return res.status(400).json({ error: "Category is required" });

    try {
        const response = await axios.get(`${TRIVIA_API_URL}&category=${category}`);
        const data = response.data;

        if (!data.results || data.results.length === 0) {
            return res.status(500).json({ error: "No questions found" });
        }

        const formattedQuestions = data.results.map(q => ({
            question: q.question,
            options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
            correct_answer: q.correct_answer
        }));

        res.json(formattedQuestions);
    } catch (error) {
        console.error("Error fetching questions:", error.message);
        res.status(500).json({ error: "Failed to fetch MCQs" });
    }
});

// Function to shuffle MCQ answers
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

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
    const index = parseInt(req.params.index);
    if (index >= 0 && index < pendingWorks.length) {
        pendingWorks.splice(index, 1);
        res.json({ message: "Deleted successfully", pendingWorks });
    } else {
        res.status(400).json({ error: "Invalid index" });
    }
});

// ✅ Fetch YouTube Videos (If API Key Available)
if (YOUTUBE_API_KEY) {
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
}

// ✅ Fetch Books from Google Books API (If API Key Available)
if (GOOGLE_BOOKS_API_KEY) {
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
}

// ✅ Save Whiteboard Session
app.post("/save", (req, res) => {
    const { sessionData } = req.body;
    savedSessions.push(sessionData);
    res.json({ message: "Session saved successfully" });
});

// ✅ Get All Saved Sessions
app.get("/sessions", (req, res) => {
    res.json(savedSessions);
});

// ✅ Recognize Handwritten Text (Simulated)
app.post("/recognize-text", (req, res) => {
    const { text } = req.body;
    const recognizedText = text.toUpperCase();
    res.json({ recognizedText });
});

// ✅ Detect Simple Shapes (Local Processing)
app.post("/detect-shape", (req, res) => {
    const { shapeData } = req.body;
    if (shapeData.includes("circle")) {
        res.json({ shape: "Circle detected" });
    } else if (shapeData.includes("rectangle")) {
        res.json({ shape: "Rectangle detected" });
    } else {
        res.json({ shape: "No recognizable shape" });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
