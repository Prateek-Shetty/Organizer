require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let pendingWorks = [];

// Add Pending Subject
app.post("/add", (req, res) => {
    pendingWorks.push(req.body.subject);
    res.json({ message: "Added" });
});

// Get Pending Works
app.get("/pending", (req, res) => {
    res.json(pendingWorks);
});

// Delete Pending Work
app.delete("/delete/:index", (req, res) => {
    pendingWorks.splice(req.params.index, 1);
    res.json({ message: "Deleted" });
});

// Fetch YouTube Videos
app.get("/youtube", async (req, res) => {
    let query = req.query.query;
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=5&type=video&key=${process.env.YOUTUBE_API_KEY}`;

    let response = await fetch(url);
    let data = await response.json();

    let videos = data.items.map(item => ({
        title: item.snippet.title,
        id: item.id.videoId
    }));

    res.json(videos);
});

// Fetch Books
app.get("/books", async (req, res) => {
    let query = req.query.query;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

    let response = await fetch(url);
    let data = await response.json();

    let books = data.items.map(item => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Unknown"
    }));

    res.json(books);
});

module.exports = app;
