// require("dotenv").config(); // Load environment variables

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const app = express();
// const PORT = 3000;

// const API_KEY = process.env.GEMINI_API_KEY; // Load API key securely
// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// app.use(cors());
// app.use(bodyParser.json());

// app.post("/generate", async (req, res) => {
//     try {
//         const userPrompt = req.body.prompt;
//         const result = await model.generateContent(userPrompt);
//         const responseText = result.response.candidates[0].content.parts[0].text;

//         res.json({ response: responseText });
//     } catch (error) {
//         console.error("Error generating response:", error);
//         res.status(500).json({ error: "Failed to generate response" });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

const API_KEY = process.env.GEMINI_API_KEY; // Load API key securely
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        const result = await model.generateContent(userPrompt);
        let responseText = result.response.candidates[0].content.parts[0].text;

        // Ensure proper formatting of code blocks
        responseText = responseText
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert bold text
            .replace(/```(\w+)?\n([\s\S]+?)\n```/g, (match, lang, code) => {
                return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
            })
            .replace(/\n/g, "<br>"); // Preserve line breaks in normal text

        res.json({ response: responseText });
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
