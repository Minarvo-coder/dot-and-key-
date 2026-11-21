# Proof2Pitch AI (KAIROS)
**Market Intelligence that Creates Marketing**  
*Built for Dot & Key Skincare | Vibe Coders Hackathon Edition 3*  
*Team: kairos*

---

## 1. Project Overview

Proof2Pitch AI bridges real, verified skincare market research with marketing content generation. Built according to the **Clay and Ink** design philosophy, every insight, competitor comparison, and creative asset anchors directly to persistent, traceable evidence IDs.

### Hackathon Challenge
**Dot & Key: Market Intelligence to Marketing Content**

---

## 2. Phase 3 Architecture: Coordinated Implementation

Phase 3 introduces the **Verified Market Research Pipeline (Workstream A)** and the **Deterministic Research Data Engine (Workstream B)** as one cohesive system.

### Workstream A: Verified Market Research
- **Primary Product (`P001`)**: Dot & Key Vitamin C + E Super Bright Sunscreen SPF 50+ PA++++
  - Official starting source: [Dot & Key Official Store](https://www.dotandkey.com/products/dot-key-vitamin-c-e-spf-50-pa-face-sunscreen-for-glowing-skin-uv-protection-for-dull-skin)
  - Pack size: 50g (mass unit)
  - Listed MRP: ₹445 INR (online discounted price: ₹388 INR)
  - Key ingredients: Triple Vitamin C (Ascorbyl Glucoside, Kakadu Plum, Sicilian Blood Orange), Vitamin E, Niacinamide, UV filters (Tinosorb S, Uvinul A Plus, Titanium Dioxide)
  - Claims: Zero white cast, water-light fluid texture, activates Vitamin D receptors, fades dullness
- **Competitor 1 (`C001`)**: The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++ (50g, ₹499 MRP, 4.3 rating, flaw: dewy finish turns into an oily film on high-sebum skin)
- **Competitor 2 (`C002`)**: Dr. Sheth's Ceramide & Vitamin C Sunscreen SPF 50+ PA++++ (50g, ₹699 MRP / ₹499 sale, 4.3 rating, flaw: rich ceramide vehicle can feel heavy and occlusive in summer humidity)
- **Competitor 3 (`C003`)**: Aqualogica Radiance+ Dewy Sunscreen SPF 50+ PA++++ (50g, ₹449 MRP, 4.2 rating, flaw: excessive dewy sheen can read as greasy on combination T-zones)
- **Verified Customer Feedback (`R001` to `R005`)**: Attributable buyer transcripts from Nykaa and Purplle verifying texture, absorption, makeup compatibility, and weather longevity.
- **Source Manifest**: Structured audit trail in `data/research/manifest.json` verifying data points, timestamps, and public URLs without automated anti-bot bypass.

### Workstream B: Research Data Engine
- **Deterministic Price Normalization**: Computes price per unit (e.g. ₹8.90 / g for Dot & Key vs ₹9.98 / g for The Derma Co) without reliance on non-deterministic AI.
- **Unit Compatibility Gate**: Prevents invalid comparisons between mass (g) and volume (ml) without liquid density verification.
- **Missing Field Resilience**: Treats unlisted data points as unknown rather than zero or negative evidence.
- **Duplicate Evidence ID Detection**: Rejects duplicate IDs across products and reviews to maintain evidentiary integrity.
- **JSON and CSV Ingestion Engine**: Live browser modal supporting dataset switching, custom JSON import, and CSV customer reviews upload.
- **Automated Validation Test Suite**: 18 automated unit tests covering all required edge cases.

---

## 3. Directory Layout

```text
proof2pitch-ai/
├── app/
│   ├── layout.js                     # Root layout with Clay & Ink tokens
│   ├── page.js                       # Main application orchestrator & dataset state
│   └── globals.css                   # Tailwind styles and custom variables
├── components/
│   ├── Navbar.js                     # Application navigation & review counter
│   ├── StatusBanner.js               # Data integrity status notice
│   ├── ResearchSection.js            # Phase 3 Market Research Dashboard
│   ├── CompetitorComparisonTable.js  # Deterministic 4-product benchmark matrix
│   ├── DataIngestionModal.js         # JSON / CSV import & manifest inspector
│   ├── InsightsSection.js            # Phase 2 Market Intelligence & SWOT
│   ├── CreativeStudioSection.js      # Phase 2 Creative Studio Campaign Assets
│   └── EvidenceDrawer.js             # Traceable Evidence ID Slide-over Drawer
├── data/
│   ├── research/
│   │   ├── schema.js                 # Shared canonical data schema contract
│   │   ├── verifiedSunscreenData.json# Grounded Phase 3 sunscreen category records
│   │   ├── manifest.json             # Source verification audit manifest
│   │   ├── unifiedData.js            # Unified data loader across Phase 2 and 3
│   │   └── dataEngine.js             # Normalization, validation & parser logic
│   └── researchFixtures.js           # Phase 2 demonstration archive fixtures
├── tests/
│   └── dataEngine.test.mjs           # Deterministic test runner (18 test cases)
└── DESIGN.md                         # Frontend Design Specification
```

---

## 4. Running the Project

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live dashboard.

### Run Automated Data Engine Tests
```bash
npm test
```
Executes the 18 deterministic test cases for missing prices, duplicate IDs, invalid CSV/JSON, unit incompatibility, empty datasets, and URL validation.

### Production Build
```bash
npm run build
```

---

## 5. Verification Policy & Phase 4 Transition
- **Strict Evidence Guarantee**: Proof2Pitch AI refuses to fabricate synthetic review quotes or clinical claims.
- **Empty State Integrity**: When a newly selected product has no compiled SWOT or creative assets, the system displays an honest empty state with a link to compiled fixtures.
- **Ready for Phase 4**: The verified Dot & Key Vitamin C + E Sunscreen dataset (`P001`, `C001-C003`, `R001-R005`) is cleanly structured and ready for Phase 4 AI sentiment clustering and opportunity angle generation.
