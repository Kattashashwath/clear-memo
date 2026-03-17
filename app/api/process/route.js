import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// POST /api/process
// Receives: { meetingName: string, notes: string }
// Returns:  { meetingName, summary, actions, email }
export async function POST(req) {
  const { meetingName, notes } = await req.json();

  // Validate notes
  if (!notes || typeof notes !== "string" || notes.trim().length < 10) {
    return Response.json(
      { error: "Please paste at least a sentence of meeting notes." },
      { status: 400 }
    );
  }

  // Validate meetingName
  if (!meetingName || typeof meetingName !== "string" || !meetingName.trim()) {
    return Response.json(
      { error: "Meeting name is required." },
      { status: 400 }
    );
  }

  // Gemini prompt — forces JSON-only response, no markdown or extra text
  const prompt = `
You are a professional executive assistant. A user has pasted raw notes from a meeting called "${meetingName}".
Produce three outputs that sound natural and human — not robotic or bullet-heavy.

MEETING NOTES:
${notes}

Return ONLY a valid JSON object (no markdown, no code fences, no extra text) with this exact structure:
{
  "summary": [
    "First key takeaway in one clear sentence.",
    "Second key takeaway.",
    "Third key takeaway.",
    "Fourth key takeaway.",
    "Fifth key takeaway."
  ],
  "actions": [
    "1. Owner: Task description by deadline.",
    "2. Owner: Task description by deadline."
  ],
  "email": "Subject: Meeting Recap — ${meetingName}\\n\\nHi [Name],\\n\\n...\\n\\nBest,\\n[Your name]"
}

Rules:
- summary must have EXACTLY 5 items. Each must be a complete, conversational sentence.
- actions must be numbered. List every concrete next step with owner and deadline where mentioned.
- email must be polished, warm, and ready to send with minimal editing. Use \\n for line breaks.
`;

  let result;
  try {
    const geminiResult = await model.generateContent(prompt);
    const text = geminiResult.response.text().trim();
    result = JSON.parse(text);
  } catch (err) {
    console.error("[/api/process] Gemini error:", err);
    return Response.json(
      { error: "Something went wrong processing your notes. Please try again." },
      { status: 500 }
    );
  }

  // ── Silent fire-and-forget log to Google Apps Script webhook ──────────────
  // No await — the user gets their response immediately regardless of sheet outcome
  const webhookUrl = process.env.SHEET_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toLocaleDateString("en-US"),
        meetingName,
        actionItems: result.actions.length,
        summary: result.summary.join(" ").substring(0, 120),
      }),
    }).catch((err) => console.error("[/api/process] Sheet log failed:", err));
  }

  // Return all 3 Gemini outputs + meetingName
  return Response.json({
    meetingName,
    summary: result.summary,
    actions: result.actions,
    email: result.email,
  });
}

// GET /api/process — health check
export async function GET() {
  return Response.json({ status: "Clear Memo /api/process is live." });
}
