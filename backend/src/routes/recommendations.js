const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

// AI Recommendations endpoint
router.post("/recommendations", async (req, res) => {
  try {
    const { preferences, orderHistory } = req.body;

    // Simple recommendation logic (can be enhanced with OpenAI later)
    const recommendations = [
      {
        name: "Chicken Biryani",
        reason: "Popular choice for first-time visitors",
        confidence: 0.85,
      },
      {
        name: "Mutton Biryani",
        reason: "Highly rated by customers",
        confidence: 0.78,
      },
      {
        name: "Parotta",
        reason: "Perfect side dish",
        confidence: 0.65,
      },
    ];

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Voice to text endpoint (placeholder for Whisper integration)
router.post("/voice-order", async (req, res) => {
  try {
    const { audioData } = req.body;

    // Placeholder response (integrate OpenAI Whisper API later)
    const transcription = "I want chicken biryani and parotta";
    const parsedOrder = {
      items: ["chicken biryani", "parotta"],
      quantity: [1, 2],
    };

    res.json({ transcription, parsedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
