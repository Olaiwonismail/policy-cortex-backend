import express from "express";
import bodyParser from "body-parser";
import Groq from "groq-sdk";

const app = express();
app.use(bodyParser.json());

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // set in your .env file
});

// AI summarization function for text
async function analyzePolicyText(text) {
  const chatCompletion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b", // or try "llama3-70b-8192" for better reasoning
    temperature: 0,               // deterministic JSON
    max_completion_tokens: 800,   // keeps output concise
    messages: [
      {
        role: "user",
        content: `Return ONLY valid JSON. No explanations, no markdown.

The JSON must follow this structure exactly:
{
  "provisions": [ "..." ],
  "supporters": [ "..." ],
  "opponents": [ "..." ],
  "impacts": [ "..." ]
}

Policy text:
${text}`
      }
    ]
  });

  const output = chatCompletion.choices[0]?.message?.content || "";
  try {
    return output;
  } catch (err) {
    console.error("Invalid JSON from model:", output);
    throw new Error("Model did not return valid JSON");
  }
}

// Endpoint to summarize raw text
app.post("/analyze", async (req, res) => {
  const { text } = req.body;
  console.log("Analyzing text with Groq...");
  try {
    const jsonOutput = await analyzePolicyText(text);
    res.send(jsonOutput);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
