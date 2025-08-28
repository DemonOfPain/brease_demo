# AI CMS Demo Guide

## Overview
This demo showcases how AI transforms content management from complex navigation into simple conversations. The assistant understands natural language, previews all changes, and maintains complete safety through confirmation steps.

## Quick Start
```bash
npm run dev
```
Open **http://localhost:3000/dashboard**

**Toggle AI Assistant:** Press `Ctrl+K` (or click the purple bot icon in bottom-right)

---

## Demo Scenarios

### 1️⃣ Update Team Member Bio
**Command:** `update john's bio`

**What it demonstrates:** Natural language content editing with semantic search

**Steps:**
1. Navigate to **Dashboard → Teams**
2. Open AI Assistant (Ctrl+K)
3. Type: `update john's bio`
4. Click "John Doe" from search results
5. Review old vs new bio in preview
6. Click **Approve & Apply** (white button with green border)
7. ✅ Bio updates automatically in the table

---

### 2️⃣ Create Page from Document
**Command:** `upload company profile`

**What it demonstrates:** AI converts documents into structured CMS pages

**Steps:**
1. Go to **Dashboard → Sites → Brease Demo Site → Pages**
2. Open AI Assistant
3. Type: `upload company profile`
4. Click the upload area
5. Watch 5-stage processing animation
6. Review the 5 sections that will be created
7. Click **Approve & Apply**
8. ✅ "Company Profile" page appears in Pages list
9. **Bonus:** Click 3-dot menu → "Edit page details" to see the sections

**What gets created:**
- Hero Section: Welcome message with CTA
- About Us: Company history and mission
- Our Services: Detailed service offerings
- Meet the Team: 4 team member profiles
- Get in Touch: Contact form with company info

---

### 3️⃣ Rename a Page
**Command:** `rename contact page to get in touch`

**What it demonstrates:** Complex updates (URLs, redirects, links) made simple

**Steps:**
1. In AI Assistant, type: `rename contact page to get in touch`
2. Review the changes:
   - Old: "Contact" → New: "Get in Touch"
   - URL: /contact → /get-in-touch
3. Click "Apply Page Rename" button
4. Click **Approve & Apply**
5. ✅ Page renamed with automatic redirects

**What gets updated automatically:**
- Page title in CMS
- URL slug with redirects from old URL
- Navigation menu text
- All internal links
- Search index and sitemap

---

### 4️⃣ Add Google Analytics
**Command:** `add google analytics`

**What it demonstrates:** Technical integrations via conversation

**Steps:**
1. Type: `add google analytics`
2. See "Brease Demo Site" highlighted as target
3. Review the GA4 tracking code
4. Click "Embed Tracking Code"
5. Click **Approve & Apply**
6. ✅ Analytics added to all pages

---

### 5️⃣ Remove Team Member
**Command:** `remove john from team`

**What it demonstrates:** Safe deletion with preview and confirmation

**Steps:**
1. Go to **Dashboard → Teams**
2. Type: `remove john from team`
3. Click "John Doe" to confirm selection
4. Review red warning message
5. Click **Approve & Apply**
6. ✅ John disappears from table (3 members remain)

---

## Key Features

### 🎯 Natural Language Understanding
- No need to navigate complex menus
- AI understands context and intent
- Works with variations (e.g., "update", "change", "modify")

### 👁️ Always Preview First
- Every change is shown before applying
- Clear before/after comparisons
- Confidence scores show AI's certainty

### 🛡️ Enterprise Safety
- Nothing happens without approval
- Cancel button always available (bottom-left)
- All actions are reversible
- Full audit trail

### ⚡ Instant Updates
- Changes appear immediately
- Auto-refresh every second
- No manual page reloads needed

### 🎨 Enhanced UI
- 420px wide sidebar (10% wider than before)
- Preview modal centered on full window
- Proper text wrapping and overflow handling
- Clean white/green approve button styling

---

## Technical Details

### Architecture
- **Frontend:** Next.js 14 with App Router
- **State:** Zustand stores with mock data persistence
- **UI:** Tailwind CSS with custom components
- **AI Logic:** Pattern matching with demo responses

### File Structure
```
/src/components/
  /assistant/
    AISidebar.tsx         # Main sidebar (420px wide)
  /demo/
    DemoChat.tsx          # Chat interface
    DemoPreviewModal.tsx  # Preview modal (z-index: 10000)
    DemoSearchResults.tsx # Search with semantic matching
    DemoDocumentUpload.tsx # Document processing
    DemoPageRename.tsx    # Page renaming
    DemoScriptEmbed.tsx   # Script embedding
/src/lib/
  mockData.ts            # Centralized demo data store
```

### Mock Data
- 4 team members with full profiles
- 3 initial pages (Home, Team, Contact)
- Company Profile page created during demo
- All changes persist in memory during session

---

## Troubleshooting

### Port Issues
If port 3000 is busy, the app will try 3001, then 3002. Check console output for actual port.

### Preview Modal Position
The modal uses React Portal to render at document.body level, ensuring it appears centered regardless of sidebar state.

### Content Overflow
All components use proper width constraints:
- Messages: max-w-[85%] with break-words
- Components: w-full with overflow-x-auto
- Search results: truncate with proper flex-shrink

---

## Demo Script

### Opening
"Let me show you how AI transforms content management from a maze of forms into a conversation."

### For Each Scenario
- **Bio Update:** "Traditionally, you'd search through forms. Now just say what you want."
- **Document Upload:** "Hours of copying becomes instant page creation with structured sections."
- **Page Rename:** "What seems simple touches URLs, redirects, and links. AI handles it all."
- **Analytics:** "Technical tasks become natural requests."
- **Team Removal:** "Even deletions are safe with preview and confirmation."

### Closing
"This isn't about replacing your CMS - it's about making it conversational. Every task becomes a simple request, while maintaining complete control and safety."

---

## Summary

The demo showcases production-ready AI assistance that:
- Understands natural language for any CMS task
- Always previews changes before applying
- Handles complex operations automatically
- Maintains enterprise-level safety
- Provides instant visual feedback

All within a clean, responsive interface that feels like chatting with a knowledgeable colleague who never makes mistakes without your approval.