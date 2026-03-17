import { GoogleGenerativeAI } from "@google/generative-ai";

// The shape of data we get back from Gemini
export type MemoResult = {
  summary: string[];   // exactly 5 bullet points
  actions: string[];   // numbered action items
  email: string;       // ready-to-send follow-up email
};

// Initialize the Gemini client once — reused across requests
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// We use gemini-1.5-flash: fast, cheap, and more than capable for text summarisation
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function processNotes(notes: string): Promise<MemoResult> {
  const prompt = `
You are a professional executive assistant. A user has pasted raw meeting notes below.
Your job is to produce three outputs that sound natural and human — not robotic or bullet-heavy.

---
MEETING NOTES:
${notes}
---

Return ONLY a valid JSON object (no markdown, no code fences) with this exact structure:
{
  "summary": [
    "First key takeaway in one clear sentence.",
    "Second key takeaway.",
    "Third key takeaway.",
    "Fourth key takeaway.",
    "Fifth key takeaway."
  ],
  "actions": [
    "Owner: Task description by deadline.",
    "Owner: Task description by deadline."
  ],
  "email": "Subject: Meeting Recap — [Topic]\\n\\nHi [Name],\\n\\nThank you for your time today...\\n\\nBest,\\n[Your name]"
}

Rules:
- summary must have EXACTLY 5 items. Each bullet should be a complete, conversational sentence.
- actions should list every concrete next step with a clear owner and deadline where mentioned.
- email should be polished, warm, and ready to send with minimal editing. Use \\n for line breaks inside the JSON string.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Parse the JSON response from Gemini
  const parsed: MemoResult = JSON.parse(text);

  return parsed;
}
