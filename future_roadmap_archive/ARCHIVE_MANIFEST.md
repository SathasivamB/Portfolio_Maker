# Future Roadmap & Archived Features Manifest (Folio AI Full Version)

> **Archived Date:** October 2026  
> **Status:** Preserved for Future Version Expansion (v2 / Enterprise / Agency Edition)  
> **Purpose:** These features were developed and verified, but temporarily streamlined from the initial Developer-focused Beta to reduce bundle size, eliminate persona confusion (developer vs. video agency), and provide a rock-solid onboarding experience.

---

## 1. Archived Feature Modules

### 1. `Dashboard.jsx` (`future_roadmap_archive/Dashboard.jsx`)
- **Original Path:** `src/pages/Dashboard.jsx`
- **Purpose:** A centralized multi-portfolio control dashboard (matching Figma board `03_Dashboard.html`).
- **Features Included:**
  - Multi-portfolio management (switching between different personal and client portfolios).
  - High-level analytics cards (Total Views, Unique Visitors, Lead Conversion Rate, Average Session Time).
  - Project repository manager table with status tags.
  - Template preview switcher.
- **Why Archived from Beta:** In the Beta version, users enter directly into `CreatorStudio` to design and deploy their primary portfolio. Having an extra intermediate dashboard added an extra click before seeing their live portfolio.
- **How to Reintegrate in Full Version:**
  - Re-add to `src/pages/Dashboard.jsx`.
  - Add route `/dashboard` in `App.jsx` when users have multiple portfolios.

---

### 2. `PitchModal.jsx` (`future_roadmap_archive/PitchModal.jsx`)
- **Original Path:** `src/components/PitchModal.jsx`
- **Purpose:** 1-Click Confidential Client Pitch & Proposal Link Generator (`/pitch/:slug`).
- **Features Included:**
  - Client Name and Industry customization (e.g. "Tailored Commercial Works for Stripe").
  - Multi-select portfolio projects specific to a prospect.
  - Generates secure, unlisted proposal URLs powered by backend `POST /api/client-pitch` and `GET /api/pitch/:slug`.
- **Why Archived from Beta:** Beta users are focused on launching their main portfolio (`/u/:username`) for job applications and client inquiries. Private proposal generation is an agency/freelancer upsell feature for the full version.
- **How to Reintegrate in Full Version:**
  - Re-add to `src/components/PitchModal.jsx`.
  - Add "Generate Client Pitch" button in `CreatorStudio.jsx` top actions.
  - The backend endpoints `POST /api/client-pitch` and table `client_pitches` in SQLite remain fully functional and intact.

---

### 3. `CreatorDarkTheme.jsx` (`future_roadmap_archive/CreatorDarkTheme.jsx`)
- **Original Path:** `src/components/themes/CreatorDarkTheme.jsx`
- **Purpose:** Standalone dark theme component from initial Figma design prototype.
- **Why Archived from Beta:** Completely superseded by `UnifiedPortfolioView.jsx`, which dynamically handles all 12 Figma archetypes (Monolith, Prism Electric, Mono Swiss, Cyber Terminal, etc.) in a single, responsive component with 100% Studio-to-Public parity.
- **How to Reintegrate in Full Version:** Kept for reference or if a dedicated standalone dark layout is required.

---

### 4. `ParticleStarfield.jsx` (`future_roadmap_archive/ParticleStarfield.jsx`)
- **Original Path:** `src/components/ParticleStarfield.jsx`
- **Purpose:** HTML5 Canvas animated 3D particle starfield background with subtle wireframe nodes.
- **Why Archived from Beta:** The Neo-Brutalist design language of Folio AI v2 uses high-contrast paper textures (`#F3F4F8`), hard shadows (`shadow-neo`), and clean geometric borders (`#0A0A12`) rather than dark canvas particle starfields.
- **How to Reintegrate in Full Version:** Can be used as an optional interactive background toggle in themes like Cyber Terminal or 3D Spatial.

---

### 5. Video Proofing Drafts (`proofing_draft`)
- **Original Location:** `UnifiedPortfolioView.jsx` (proofing draft section)
- **Purpose:** Video client review player with interactive timestamp feedback markers (e.g., `0:14 Color grade adjusted`, `0:38 Sound transition`).
- **Why Archived from Beta:** Video review and frame-accurate proofing is a specialized tool for video post-production agencies (like Frame.io). Developer beta users were confused by seeing video proofing drafts on a software engineer portfolio.
- **How to Reintegrate in Full Version:** Introduce as a specialized module toggle under `selected_sections: ['proofing']` when a user selects the "Filmmaker / Video Agency" archetype in the future multi-persona version.

---

### 6. Omni-Scraper Bar (YouTube/Instagram Ingestion)
- **Original Location:** `CreatorStudio.jsx` (top bar)
- **Purpose:** Scraped YouTube video views, channel reels (`@mkbhd`, `@fireship`), and Instagram feeds via `server/scrapers/omniScraper.js`.
- **Why Archived from Beta:** Developers build portfolios using GitHub repositories, live demo URLs, and verified certifications, not YouTube handles. Removing it cleans up valuable vertical space in the Studio workspace.
- **Backend Status:** The backend scraper engine in `server/scrapers/omniScraper.js` and endpoint `POST /api/scrape/omni` remain preserved and available in the server.

---

## 2. Reintegration Checklist for Full Future Version
When you are ready to expand into the enterprise / agency edition:
1. Copy `future_roadmap_archive/Dashboard.jsx` back to `src/pages/Dashboard.jsx`.
2. Copy `future_roadmap_archive/PitchModal.jsx` back to `src/components/PitchModal.jsx`.
3. Add a persona switcher in `LandingPage.jsx` ("I am a Developer" vs. "I am a Filmmaker / Creative Agency").
4. Enable the Omni-Scraper and Proofing Drafts conditionally when the Creative Agency persona is selected.
5. All backend database tables (`client_pitches`, `client_inquiries`, `portfolios`, `users`, `portfolio_items`) already support these schemas out-of-the-box!
