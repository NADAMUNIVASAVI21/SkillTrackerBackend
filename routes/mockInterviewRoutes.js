import express from "express";
import { OpenAI } from "openai";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// Generate questions
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { role } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert interviewer." },
        { role: "user", content: `Generate 5 interview questions for: ${role}` }
      ]
    });

    res.json({
      questions: response.choices[0].message.content.split("\n")
    });

  } catch (error) {
    console.error("MOCK GENERATE ERROR:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// Evaluate answer
router.post("/evaluate", authMiddleware, async (req, res) => {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { question, answer } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a senior HR evaluator." },
        {
          role: "user",
          content: `Question: ${question}\nAnswer: ${answer}\nEvaluate with score, strengths, weaknesses, improvements.`
        }
      ]
    });

    res.json({
      evaluation: response.choices[0].message.content
    });

  } catch (error) {
    console.error("MOCK EVALUATE ERROR:", error);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
});

export default router;
