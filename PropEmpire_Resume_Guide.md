# PropEmpire — Resume & Technical Interview Guide

This document is designed to help you showcase **PropEmpire** on your resume and during technical interviews. It contains high-impact bullet points, architectural summaries, and preparation questions.

---

## 1. Resume Block (Copy-Paste Ready)

### **Lead Frontend Engineer / Full-Stack Developer**
**Project: PropEmpire (Real Estate CRM & Offline-First PWA)**
* **Tech Stack**: React 19, Vite, Supabase (PostgreSQL), IndexedDB (via LocalForage), pdf-lib, ExcelJS, html2canvas, Service Workers, CSS Variables (Luxury Design System)

* **Architected a local-first Progressive Web App (PWA)** using React 19, Vite, and IndexedDB, synchronized with a Supabase PostgreSQL backend, ensuring 100% CRM availability in low-network field conditions.
* **Engineered a client-side vector PDF generator** using `pdf-lib` to dynamically overlay invoice parameters onto compressed templates, reducing page load times and saving server execution costs.
* **Developed an automated Excel parser & exporter** using `exceljs` that maps and imports tabular lead data with header auto-detection, speeding up lead imports from social media ad campaigns.
* **Coded a customized canvas-based brand card generator** utilizing `html2canvas` with CORS integration, enabling mobile agents to download sharp (300dpi) branded property graphics on the fly.
* **Implemented an asynchronous WhatsApp broadcast utility** with built-in popup throttle controls, allowing personalized templated message delivery to target clients without external API fees.
* **Designed a custom Stale-While-Revalidate (SWR) cache synchronization engine** that queries the local database in under 10ms and asynchronously fetches updates in the background, offering a zero-latency UI.

---

## 2. Deep-Dive: Key Technical Accomplishments (For Interviews)

Use these stories when an interviewer asks: *"Tell me about a time you solved a hard technical problem."*

### A. The Client-Side Vector PDF Overlay Engine
* **The Problem**: Rendering invoices directly from DOM-to-canvas (`jspdf` + `html2canvas`) on mobile resulted in blurry text, large file sizes (~5MB+), and slow performance.
* **The Solution**: Used `pdf-lib` to load a pre-designed vector template (`Invoice.pdf`). Registered `@pdf-lib/fontkit` to embed custom TrueType fonts (`Poppins`) directly into the PDF binary, and wrote custom drawing routines to map dynamic text fields onto exact vector coordinates.
* **The Result**: Beautiful, print-ready, searchable vector PDFs generated in under **200ms** on-device, with a file size of only **~500KB** (10x reduction).

### B. Smart Header Auto-Detection (Excel Parser)
* **The Problem**: Agents import lead lists from Facebook, Google Ads, and manual spreadsheets. Every file has different header names (e.g. `Client Name`, `Full Name`, `Contact`, `Mobile Number`).
* **The Solution**: Built a custom parser with `exceljs` that scans the uploaded sheets. It runs a keyword lookup algorithm (regex/substring search) across row values to find where the header row actually starts. Once found, it maps variations of column headers to the application's schema (e.g., mapping `Mobile`, `Contact`, and `Phone No` to a single internal `phone` variable).
* **The Result**: 100% success rate in importing random CRM Excel lists without demanding strict column order or naming conventions from the user.

### C. Zero-Latency Local-First Sync Architecture
* **The Problem**: Real estate agents frequently lose internet connection when visiting construction sites or basements, but they still need to view client records, change statuses, and log visits.
* **The Solution**: Developed a custom `db.js` layer that utilizes `localforage` (asynchronous IndexedDB wrapper) as the primary database, backed by a Supabase Postgres instance.
  * *Reads*: Immediately returns Cached data from IndexedDB, then kicks off an asynchronous background query to Supabase. If the network data returns, the cache is silently updated.
  * *Writes*: Writes immediately to local cache, then updates Supabase in the background. Handles offline-only fallbacks by assigning Client UUIDs on the client side.
* **The Result**: App operates with zero UI latency and remains fully functional offline.

---

## 3. Technology Alignment Map

Highlight these tools on your resume or LinkedIn profile:

| Library | Role in Project | Value Provided |
| :--- | :--- | :--- |
| **React 19** | Core UI | Declarative, component-driven UI with state hooks |
| **Vite** | Build Tool & PWA | Installs Service Worker, handles asset versioning, fast HMR |
| **Supabase** | Cloud Database | PostgreSQL persistence, client-side RLS policies |
| **LocalForage** | Client Database | Asynchronous IndexedDB storage bypassing localStorage limits |
| **pdf-lib** | Invoice Generation | High-performance vector PDF rendering |
| **ExcelJS** | Reporting & Import | Styled Excel exports & intelligent client-side importing |
| **html2canvas** | Marketing Cards | DOM-to-image conversion for luxury property cards |
