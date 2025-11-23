import express from "express";
import Skill from "../models/Skill.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router = express.Router();

// Get all skills for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Error loading skills" });
  }
});

// Add a new skill
router.post("/", authMiddleware, async (req, res) => {
  const { name, level, notes } = req.body;

  if (!name) return res.status(400).json({ message: "Skill name is required" });

  try {
    const newSkill = await Skill.create({
      userId: req.user.id,
      name,
      level: level || 50,
      notes: notes || "",
    });

    res.json(newSkill);
  } catch (err) {
    res.status(500).json({ message: "Error adding skill" });
  }
});

// Update skill (progress or notes)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Skill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating skill" });
  }
});

// Delete skill
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Skill.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting skill" });
  }
});

export default router;
