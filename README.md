# 🗳️ Policy Cortex

**Policy Cortex** is a hackathon project built for the **Hack the Vote** theme.  
It helps voters **understand complex legislation** at a glance by transforming long, unreadable policy documents into **interactive mind maps**.

---

## 🚀 Features

- **Paste a Policy Link**  
  Paste a link to a policy summary (Wikipedia, government site, ballot measure) and let the app analyze it.

- **AI-Powered Summaries**  
  Extracts:
  - 📜 Key Provisions  
  - ✅ Supporters  
  - ❌ Opponents  
  - 📈 Impacts  

- **Interactive Mind Map**  
  Explore policies visually with expandable nodes. Clicking a node shows details and sources.

- **Personalized Impacts (Bonus)**  
  Enter your occupation, location, or community, and the app suggests how the policy *could affect you*.  
  *(Safely worded: no overpromises, only cautious impacts.)*

- **Demo Mode**  
  Includes a preloaded example (California Proposition 22) for reliable live demos.

---

## 🛠️ Tech Stack

- **Frontend:** React + D3.js (interactive mind map)  
- **Backend:** Node.js + Express  
- **AI Processing:** OpenAI / Groq (via OpenRouter API)  
- **File Handling:** Multer for uploads (optional for PDFs)  

---

## ⚡ How It Works

1. **User Input**: Paste a link or text → click "Analyze".  
2. **Processing**: Backend sends the text to the LLM with a structured JSON prompt.  
3. **Structured Output**:  
   ```json
   {
     "provisions": [ "..." ],
     "supporters": [ "..." ],
     "opponents": [ "..." ],
     "impacts": [ "..." ]
   }
