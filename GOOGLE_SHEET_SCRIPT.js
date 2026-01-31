
// ==========================================
// GOOGLE SHEETS BACKEND SCRIPT
// ==========================================
// 1. Go to your Google Sheet
// 2. Click Extensions > Apps Script
// 3. Delete any code there and paste this entire file
// 4. Click Deploy > New Deployment
// 5. Select type: "Web App"
// 6. Description: "Contact Form"
// 7. Execute as: "Me"
// 8. Who has access: "Anyone" (IMPORTANT)
// 9. Click Deploy, Authorize access, and Copy the "Web App URL"
// 10. Send the URL to the AI assistant or paste it in main.js

function doPost(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const data = JSON.parse(e.postData.contents);

        // Append row: [Date, Parent Name, Email, Contact, Child Name, Child Age, Comments]
        sheet.appendRow([
            new Date(),
            data.parentName,
            data.email,
            data.contact,
            data.learnerName || "N/A",
            data.learnerAge || "N/A",
            data.comments || "N/A"
        ]);

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Handle CORS (pre-flight checks) for external access
function doGet(e) {
    return ContentService.createTextOutput("Active");
}
