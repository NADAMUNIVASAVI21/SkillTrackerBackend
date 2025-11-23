import express from "express";
import OpenAI from "openai";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ message: "Goal is required" });
    }

    // Create OpenAI client INSIDE the route (AFTER dotenv is loaded)
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Generate a roadmap for: ${goal}` },
      ],
    });

    const text = response.choices[0].message.content;

    res.json({ output: text });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ message: "AI request failed" });
  }
});

export default router;
