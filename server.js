// const express = require("express");
// const app = express();
// const PORT = 5000;

// // Define a simple route
// app.get("/", (req, res) => {
//   res.send("Hello, Express!");
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config(); // Load environment variables

const API_KEY = process.env.API_KEY;
// const API_KEY = 'AIzaSyBShWuq3-XNtDWCGJDR9tQsk083mfAUNe0';

if (!API_KEY) {
  console.error("API_KEY is missing in the .env file.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// API Route to process user input
app.post("/api", async (req, res) => {
  try {
    const { prompt } = req.body;
// console.log(req.body);
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
    const aiResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";
//    console.log(aiResponse);
    res.json({ message: aiResponse });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
