# Form Strat — User Manual

Form Strat turns a plain-English description into a ready-to-use form, then
helps you understand every response with AI-powered analytics and reports.

This guide covers how to **use the app** as a form owner. For setup/deployment
docs, see the comments in `.env.example` and the backend's own README.

---

## 1. Getting started

1. Go to the site and click **Sign up** (or **Continue with Google**) to create
   an account. Already have one? Use **Log in**.
2. After signing in you land on the **Dashboard** — your home base.

---

## 2. The Dashboard

The Dashboard answers *"what happened since I last looked?"*

- **Stat cards** — total forms, total responses, how many forms are Live vs.
  Draft.
- **Recent activity** — the latest responses across all your forms, each
  linking straight to that form's responses.
- **Your forms** — your most recently updated forms, with **View all** to see
  every form.
- **New Form** (top right) opens the AI prompt — see [Section 3](#3-creating-a-form).

Clicking a form card behaves differently depending on its state:

| Form state | Click opens | Why |
|---|---|---|
| **Live** | The form's Responses tab | You almost always want to check how it's doing |
| **Draft** | The Builder | Nothing to analyze yet — editing is the useful default |

---

## 3. Creating a form

Click **New Form** from the Dashboard, Forms page, or Builder topbar. You get
two choices:

- **Describe it and let AI build it** — type a plain-English description (e.g.
  *"A customer feedback survey with a star rating, what they liked, and an
  email field"*) and click **Generate**. The AI returns a complete form —
  title, description, and fields — ready to fine-tune.
- **Start blank** — opens an empty form in the Builder.

---

## 4. The Builder

The Builder is a three-pane editor: a field palette on the left, the form
canvas in the middle, and a properties panel on the right for whatever field
is selected.

### Field types

| Group | Fields |
|---|---|
| Text | Short text, Paragraph, Email, Phone |
| Choice | Multiple choice (radio), Checkboxes, Dropdown, Rating (stars) |
| Advanced | Date, File upload, Number |

For each field you can set its **label**, **help text**, whether it's
**required**, and — for choice fields — its list of **options**.

### Working with fields

- **Add** a field from the palette (click, or drag to a specific position).
- **Reorder** fields by dragging them in the canvas.
- **Duplicate** or **delete** a field from its hover controls.
- Add a **cover banner image** at the top of the form from the canvas.

### Preview

Switch the **Build / Preview** toggle in the topbar to try the form exactly as
a respondent would see it, without leaving the Builder.

### Saving, publishing, and sharing

- **Save** stores your draft. A form only accepts public responses once it's
  **published**.
- **Publish** makes the form Live and takes you to its **Share** tab so you can
  grab the link right away.
- **Unpublish** takes a Live form back to Draft — it stops accepting new
  responses, but existing responses and analytics are untouched.
- **Share** (topbar) copies the public fill-in link at any time.
- **Back** returns you to the form's detail hub (or the Forms list, for a
  form you haven't saved yet).

---

## 5. The Form Detail Hub

Click into any form (from the Dashboard, Forms list, or Builder's Back button)
to reach its hub — three tabs: **Responses**, **Insights**, **Share**.

The header shows the form's title, Live/Draft status, response count, field
count, and last-updated time, plus quick **Copy link** and **Edit form**
buttons.

### Responses tab

A table of every submission, showing your first few fields as columns. Click
any row to expand it and see every answer in full. If there are no responses
yet, you'll see a prompt to share your form.

### Insights tab

Instant, computed statistics for every question:

- **Choice questions** (multiple choice, checkboxes, dropdown) — a bar chart
  of how many times each option was picked. Hover (or tab to) a bar for the
  exact count.
- **Rating questions** — the distribution across the star scale plus the
  average.
- **Number questions** — a binned distribution plus min / average / max.
- **Text questions** — a handful of sample answers.
- **Responses over time** — a small bar chart of responses per day; hover any
  bar to see the exact count and date.

If AI is enabled for your deployment, click **Generate AI insights** for a
written summary, key findings, and recommendations grounded in your actual
numbers. The result is saved — it loads instantly next time, and only asks to
be regenerated once new responses have come in since it was written.

### Share tab

Your form's public link, ready to copy, plus an **Open live form** shortcut.
If the form is still a draft, this tab reminds you to publish it first.

---

## 6. Reports

From a form's **Insights** tab (or `/forms/:id/report`), generate a full
written **Response Analysis Report** — a formal, multi-section document:

- Executive summary, methodology, response trends
- Question-by-question analysis with charts
- Cross-cutting themes, key findings (with severity), and recommendations
- An appendix with full data tables

Reports are AI-written narrative *grounded in* statistics computed directly
from your response data — every chart and table is computed, not generated, so
you can verify any claim against the accompanying figures.

- **Generate report** creates the first version.
- If new responses arrive afterward, a banner tells you the report is based on
  fewer responses than the form now has — click **Regenerate report** for an
  up-to-date version.
- **Print / PDF** opens your browser's print dialog, formatted for a clean
  printout or PDF export.

---

## 7. Managing your forms

The **Forms** page lists every form you own, with tabs to filter by **All /
Live / Drafts** and a search box.

Each row's **⋮** menu gives you:
- **View responses** — jump to the hub's Responses tab
- **Edit** — open the Builder
- **Copy link** / **Open live form** — for published forms
- **Delete** — permanently removes the form and all its responses

The **Responses** count in each row is also a shortcut straight to that form's
responses.

---

## 8. Filling out a form (the respondent's view)

Anyone with a published form's link can open it and fill it out — no account
required. After submitting, they see a simple thank-you confirmation. Answers
are recorded immediately and appear in your Responses tab and Insights.

A form that isn't published yet shows respondents a friendly "not accepting
responses" message instead of the form.

---

## 9. Tips

- **Draft first, publish when ready.** You can build and preview a form fully
  before it's ever visible to respondents.
- **Unpublishing is reversible.** It stops new responses without deleting
  anything you've already collected.
- **Insights and Reports both read live data** — deleting or adding responses
  is reflected the next time you view or regenerate them.
- **AI features require the deployment to have AI configured.** If you don't
  see AI buttons (Generate insights / Generate report), ask whoever manages
  your deployment to set the AI provider key.
