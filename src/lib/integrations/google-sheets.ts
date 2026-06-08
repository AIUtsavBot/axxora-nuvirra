export async function appendToGoogleSheet(sheetName: "Orders" | "Support" | "Content", rowData: string[]) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !privateKey || !sheetId) {
    console.log(`[Google Sheets Mock] Appending to ${sheetName} sheet:`, rowData);
    return;
  }

  try {
    const { google } = await import("googleapis");
    const auth = new google.auth.JWT({
      email,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    const sheets = google.sheets({ version: "v4", auth });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: "RAW",
      requestBody: {
        values: [rowData],
      },
    });
    console.log(`[Google Sheets] Successfully appended row to ${sheetName} sheet`);
  } catch (error) {
    console.error("[Google Sheets Error]", error);
  }
}
