import express from "express";
import Resource from "../models/Resource.js";
import authMiddleware from "../middleware/authMiddleware.js";




const router = express.Router();

// Get all resources for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const resources = await Resource.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: "Error loading resources" });
  }
});

// Add resource
router.post("/", authMiddleware, async (req, res) => {
  const { title, link } = req.body;

  if (!title || !link)
    return res.status(400).json({ message: "Title and link are required" });

  try {
    const newResource = await Resource.create({
      userId: req.user.id,
      title,
      link,
    });

    res.json(newResource);
  } catch (err) {
    res.status(500).json({ message: "Error adding resource" });
  }
});

// Delete resource
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Resource.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting resource" });
  }
});

export default router;
