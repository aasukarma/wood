# Motion Woods — Consent & Lead Logging Setup

This turns your enquiry forms into a **tamper-resistant consent log**. When someone
ticks the Privacy Policy box and submits, three things happen:

1. The lead still opens in **WhatsApp** as before (nothing changes for your team).
2. In the background the form calls **`/api/lead`** — a small server function on Vercel.
3. That function stamps its **own server-side timestamp** (a trusted clock the visitor
   can't edit), records the visitor's IP and browser, and appends everything to a
   **Google Sheet you own**.

The server timestamp is the audit-grade record. The timestamp shown in the WhatsApp
message is only for your team's convenience.

---

## What's already done (in code)

- `api/lead.js` — the serverless function (deployed automatically by Vercel).
- Both forms (`/contact` and the interiors demo) now POST to `/api/lead` on submit.
- Works even before you finish the steps below — it will log to Vercel's function
  logs. Completing the steps adds the permanent Google Sheet record.

You only need to do the one-time setup below to switch on the Google Sheet.

---

## Step 1 — Create the Google Sheet

1. Go to Google Sheets and create a new blank sheet. Name it e.g. **"Motion Woods — Consent Log"**.
2. Rename the first tab (bottom-left) to exactly: **`Leads`**
3. In row 1, paste these headers across columns A–M:

```
Received | Server Timestamp (UTC) | Client Timestamp | Form | Name | Phone | City | Requirement | Details | Consent | Privacy Version | IP | User Agent
```

## Step 2 — Add the Apps Script

1. In the sheet menu: **Extensions → Apps Script**.
2. Delete anything in the editor and paste this:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    sheet.appendRow([
      new Date(),            // Received (sheet's own time)
      d.serverTimestamp || '',
      d.clientTimestamp || '',
      d.form || '',
      d.name || '',
      d.phone || '',
      d.city || '',
      d.requirement || '',
      d.details || '',
      d.consent === true ? 'YES' : 'NO',
      d.privacyVersion || '',
      d.ip || '',
      d.userAgent || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Click **Save**.

## Step 3 — Deploy the Apps Script as a Web App

1. Top-right: **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" → choose **Web app**.
3. Set:
   - **Description:** Motion Woods lead logger
   - **Execute as:** Me
   - **Who has access:** **Anyone**
4. Click **Deploy**, authorise access when prompted (choose your Google account,
   click Advanced → Go to project → Allow).
5. Copy the **Web app URL** (it looks like `https://script.google.com/macros/s/AKfy.../exec`).

## Step 4 — Give the URL to Vercel

1. Open your project on **vercel.com** → the project that hosts motionwoods.com.
2. **Settings → Environment Variables**.
3. Add a new variable:
   - **Name:** `SHEET_WEBHOOK_URL`
   - **Value:** the Web app URL you copied in Step 3
   - Environments: tick Production (and Preview if you want).
4. Save, then **redeploy** the site (Deployments → ⋯ → Redeploy) so the variable
   takes effect.

## Step 5 — Test

1. Open `/contact` on the live site, fill the form, tick the consent box, submit.
2. WhatsApp should open as usual.
3. Within a few seconds a new row should appear in your Google Sheet with a
   server timestamp, the consent = YES, and the visitor's details.

If no row appears: in Vercel open the deployment → **Functions → Logs**, submit
again, and look for a line starting `MW_LEAD` — that confirms the function ran and
tells you whether the sheet forward failed.

---

## Notes & honest limitations

- **This is not legal advice.** Have the Privacy Policy, Terms and this consent flow
  reviewed by a lawyer / company secretary before relying on them in a dispute.
- The **server timestamp + IP** make this far stronger than a browser-only timestamp,
  but it is still your own record, not a third-party notarised one.
- The Google Sheet is the log. Restrict who can edit it, and consider periodic
  read-only backups if you need stronger integrity.
- If you later move off WhatsApp to a proper CRM, the same `/api/lead` function can
  forward to that instead — only `api/lead.js` changes.
