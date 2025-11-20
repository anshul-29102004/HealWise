import express from "express";
import OpenAI from "openai";

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/symptom-checker", async (req, res) => {
  const { symptoms } = req.body;

  // Validate input
  if (!symptoms || !symptoms.trim()) {
    return res.status(400).json({ message: "Please provide symptoms." });
  }

  try {
    // 🧠 Strict prompt for short doctor specialty response
    const prompt = `
You are a medical assistant AI.

Your job is to read the user's symptoms or disease name and identify
the single most appropriate doctor specialty that they should consult.

Respond ONLY with the doctor's specialty name (e.g., "Cardiologist", "Dermatologist", "Orthopedic", "Psychiatrist", "General Physician").
Do NOT include any explanations or additional text.

User input: ${symptoms}
Answer:
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast + smart
      messages: [{ role: "user", content: prompt }],
      temperature: 0, // deterministic output
    });

    const specialty = completion.choices[0].message.content.trim();

    // Return clean JSON
    res.json({ specialty });
  } catch (error) {
    console.error("❌ OpenAI Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ message: "AI service error. Please try again later." });
  }
});

export default router;
