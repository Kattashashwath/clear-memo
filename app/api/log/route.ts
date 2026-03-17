import { NextRequest, NextResponse } from "next/server";
import { logToSheet } from "@/lib/sheets";
import type { MemoResult } from "@/lib/gemini";

// POST /api/log
// Receives: { summary, actions, email } (the full MemoResult)
// Returns:  { ok: true } or { error: string }
export async function POST(req: NextRequest) {
  const body: MemoResult = await req.json();

  if (!body.summary || !body.actions || !body.email) {
    return NextResponse.json(
      { error: "Missing required fields to log." },
      { status: 400 }
    );
  }

  try {
    await logToSheet(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/log] Sheets error:", err);
    return NextResponse.json(
      { error: "Could not log to Google Sheets. Check your credentials." },
      { status: 500 }
    );
  }
}
