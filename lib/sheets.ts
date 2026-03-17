import { google } from "googleapis";
import type { MemoResult } from "./gemini";

// One job: append a single row to the Google Sheet after each successful memo

export async function logToSheet(result: MemoResult): Promise<void> {
  // Authenticate using the service account credentials from .env.local
  // A service account is like a robot user — it has its own email and key,
  // and you grant it "Editor" access to your Google Sheet.
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // unescape newlines stored in env
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Format values as a flat row: timestamp | summary | actions | email
  const row = [
    new Date().toISOString(),                        // when it was processed
    result.summary.join(" | "),                      // 5 bullets joined by pipe
    result.actions.join(" | "),                      // action items joined by pipe
    result.email.replace(/\n/g, " "),               // email on one line
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A:D",                             // columns A through D
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}
