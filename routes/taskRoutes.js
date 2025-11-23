import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router = express.Router();

// Get all tasks for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error loading tasks" });
  }
});

// Add task
router.post("/", authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Task cannot be empty" });

  try {
    const newTask = await Task.create({
      userId: req.user.id,
      text,
      completed: false,
    });

    res.json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Task removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

export default router;
