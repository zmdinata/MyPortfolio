# Graph Report - MyWebPortfolio  (2026-09-06)

## Corpus Check
- 75 files · ~958,168 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 363 nodes · 571 edges · 32 communities (23 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `403da769`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `useLang()` - 21 edges
2. `Progress Website Portfolio ZMDINATA` - 19 edges
3. `supabase` - 16 edges
4. `Memory Perubahan per Tanggal` - 12 edges
5. `getDisplayType()` - 9 edges
6. `Storyboard` - 9 edges
7. `mergePortfolioItems()` - 8 edges
8. `getPreviewForItem()` - 8 edges
9. `ZMDINATA | AI Engineer & Full-Stack Portfolio` - 8 edges
10. `✨ Fitur-Fitur Utama` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Chatbot()` --calls--> `useLang()`  [EXTRACTED]
  src/components/Chatbot/Chatbot.jsx → src/context/LangContext.jsx
- `makeItemPayload()` --calls--> `getDisplayType()`  [EXTRACTED]
  src/components/admin/PortfolioCrudManager.jsx → src/lib/portfolioMedia.js
- `PortfolioCrudManager()` --calls--> `normalizeIconName()`  [EXTRACTED]
  src/components/admin/PortfolioCrudManager.jsx → src/lib/categoryIcons.jsx
- `Footer()` --calls--> `useLang()`  [EXTRACTED]
  src/components/layout/Footer.jsx → src/context/LangContext.jsx
- `Navbar()` --calls--> `useLang()`  [EXTRACTED]
  src/components/layout/Navbar.jsx → src/context/LangContext.jsx

## Import Cycles
- None detected.

## Communities (32 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (23): skills, CategoryIcon(), iconRegistry, isValidLucideIcon(), normalizeIconName(), cursorSpring, fadeLeft, fadeRight (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (21): certificates, honors, projectCategories, projects, getCachedCertificates(), getCachedHonors(), getCachedProjects(), memoryCache (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (25): ThemeContext, ThemeProvider(), useTheme(), pageVariants, linkVariants, Navbar(), overlayVariants, exitTransition (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (30): 22 November 2025, 24 April 2026, 25 November 2025, 26 April 2026, 30-31 Oktober 2025, 6 Mei 2026, 6 September 2026, 8 Mei 2026 (+22 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (7): ALL_ICONS, LATEST_CV_EDUCATION, LATEST_CV_EXPERIENCE, LATEST_CV_PROFILE, LATEST_CV_PROJECTS, LATEST_CV_SKILLS, supabase

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (23): dependencies, framer-motion, lucide-react, pdfjs-dist, react, react-dom, react-icons, react-parallax-tilt (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (22): 1. Kloning Repositori, 1. 🍱 Linear & Vercel-Grade Bento Grid (`HomePage.jsx`), 2. 💻 Interactive AI Terminal (`InteractiveTerminal.jsx`), 2. Konfigurasi Environment Variables, 3. Eksekusi Skrip Database (Supabase), 3. ⚡ Zero-Lag & High-Performance Engine, 4. Jalankan Development Server, 4. 📄 Zero-Lag Single-Page PDF Viewer (`PdfPreview.jsx` & `PreviewModal.jsx`) (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (16): blankCategory, contentLabels, getBlankItem(), getStaticSourceKey(), isUuid(), makeItemPayload(), PortfolioCrudManager(), resolveCategory() (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (13): LangContext, LangProvider(), useLang(), translations, Footer(), CertificatesPage(), HomePage(), HonorsPage() (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.35
Nodes (8): Chatbot(), usePortfolioContext(), generateChatResponse(), clearMemory(), getMemoryMessages(), loadMemory(), refreshMemoryTTL(), saveMemory()

### Community 10 - "Community 10"
Cohesion: 0.42
Nodes (9): assertSafeUrl(), decodeHtml(), getImage(), getMetaContent(), getTitle(), handler(), isPrivateIp(), json() (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (9): namedAnimations, representativeAnimations, scrollTriggeredElements, summary, canvases, cdpAnimations, cssDeclarations, scrollTargets (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.20
Nodes (9): Colors, Components, Design System, Do's, Do's and Don'ts, Don'ts, Elevation, Overview (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (9): Asset Audit, BEAT 1 - SIGNAL OPENER (0:00-0:06), BEAT 2 - PROJECT PROOF (0:06-0:12), BEAT 3 - AI ENGINEER TRAJECTORY (0:12-0:19), BEAT 4 - SKILL SYSTEM (0:19-0:25), BEAT 5 - CTA CLOSE (0:25-0:30), Global Direction, Production Architecture (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.61
Nodes (7): buildSystemPrompt(), callGemini(), callGroq(), callOpenRouter(), handler(), isQuotaError(), quotaMessage()

### Community 15 - "Community 15"
Cohesion: 0.36
Nodes (5): enableDarkMode(), enableLightMode(), setLanguage(), toggleLanguage(), toggleTheme()

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Brand Summary, What's in This Capture, Zacky Muhammad Dinata — Portfolio

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (3): Brand Summary, What's in This Capture, Zacky Muhammad Dinata — Portfolio

### Community 18 - "Community 18"
Cohesion: 0.50
Nodes (3): Notes, Script, Voiceover

## Knowledge Gaps
- **139 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+134 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `supabase` connect `Community 4` to `Community 0`, `Community 1`, `Community 2`, `Community 7`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `useLang()` connect `Community 8` to `Community 0`, `Community 9`, `Community 2`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _139 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1014799154334038 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10338680926916222 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06818181818181818 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._