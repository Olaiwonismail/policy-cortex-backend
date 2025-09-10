import express from "express";
import bodyParser from "body-parser";
import Groq from "groq-sdk";

const app = express();
import cors from "cors";



app.use(bodyParser.json());
app.use(cors({
  origin: "*", // frontend origin
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
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
    // console.error("Invalid JSON from model:", output);
    throw new Error("Model did not return data");
  }
}

async function personalization(policy_json, user_input) {
  const chatCompletion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b", // or try "llama3-70b-8192" for better reasoning
    temperature: 0,               // deterministic JSON
    max_completion_tokens: 800,   // keeps output concise
    messages: [
      {
        role: "user",
        content: `You are given a policy summary in JSON format.

Policy JSON:
${policy_json}

User context:
${user_input} 
(e.g., "gig driver in California", "teacher in New York", "Muslim small-business owner")

Task:
Explain how this policy *could affect* someone with this background. 
Be cautious and do not invent details. 
If no clear impacts exist, say so. 

Return ONLY valid JSON in this format:
{
  "personalImpacts": [
    "Short bullet point impact here",
    "Another impact here"
  ]
}`
      }
    ]
  });

  const output = chatCompletion.choices[0]?.message?.content || "";
  try {
    return output;
  } catch (err) {
    // console.error("Invalid JSON from model:", output);
    throw new Error("Model did not return data");
  }
}

var policy;
// Endpoint to summarize raw text
app.post("/analyze", async (req, res) => {
  const { text } = req.body;
  policy = text;
  console.log("Analyzing text with Groq...");
  try {
    console.log(text+'dddddddd');
    const Output = await analyzePolicyText(text);
    console.log(Output+'oooooooooo');
    res.send(Output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/personalization", async (req, res) => {
  const {  user_input } = req.body;
  console.log("Personalizing policy with Groq...");
  try {
    const Output = await personalization(policy, user_input);
    res.send(Output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
