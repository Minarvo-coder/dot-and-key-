# KAIROS / Proof2Pitch AI: Frontend Design Specification
**Market Intelligence that Creates Marketing**  
*Built for Dot & Key | Hackathon Edition: Vibe Coders Hackathon Edition 3*  
*Team: kairos*  
*Document Version: 1.0.0 (Phase 2 Implementation)*

---

## 1. Product Design Philosophy

1. **Editorial Studio, Not Generic SaaS**  
   Interface layouts draw inspiration from luxury beauty journals and creative agency decks. Typography is intentional, hierarchies are authoritative, and page layouts balance dense analytical data with generous breathing room.
2. **Clay and Ink Materiality**  
   Warm, tactile surfaces replace sterile whites and stark dark modes. Layers sit upon tinted paper surfaces (#EDE6DD background, #F8F3EC cards) with fine hairline borders (#D9CFC3) and soft, diffuse ambient shadows.
3. **Data Integrity and Traceability (Non-Negotiable)**  
   Every insight, customer sentiment cluster, and generated campaign asset provides provenance. Users can inspect the exact customer review excerpts, competitor pricing points, or ingredient claims that led to a recommendation using stable evidence IDs.
4. **Intentional Motion and Restraint**  
   Zero decorative bouncing, no neon glow animations, no glassmorphism blur traps. Animations are strictly functional: state transitions (150ms to 200ms ease-out), collapsible drawers, and subtle progress bars.
5. **Desktop-First Command Center with Full Mobile Resilience**  
   Designed for brand managers and growth marketers working on desktop screens, with seamless, fully responsive adaptation for tablets and mobile devices.

---

## 2. Design Tokens: The Clay and Ink Token System

### Color Palette and Semantic Mapping
- **Canvas / Root Background (`bg-app`)**: `#EDE6DD` (Warm clay-tinted canvas)
- **Elevated Card Surface (`surface-card`)**: `#F8F3EC` (Warm ceramic paper)
- **Secondary Surface (`surface-subtle`)**: `#F2EAE1` (Subtle container fill, table headers)
- **Primary Text (`text-primary`)**: `#231F20` (High contrast, deep ink, WCAG AAA compliant)
- **Muted Text (`text-muted`)**: `#81776F` (Captions, timestamps, secondary labels)
- **Primary Accent (`accent-terracotta`)**: `#B4532A` (Primary CTAs, active indicators, key highlights)
- **Primary Accent Hover (`accent-terracotta-hover`)**: `#9C431F`
- **Secondary Accent (`accent-sage`)**: `#6B7F73` (Positive sentiment, ingredient tags)
- **Secondary Soft (`accent-sage-soft`)**: `#E3E8E5` (Positive badge backgrounds)
- **Highlight (`highlight-sand`)**: `#D9C7AE` (Neutral metrics, accent dividers)
- **Subtle Border (`border-subtle`)**: `#D9CFC3` (Card outlines, table dividers)
- **Strong Border (`border-strong`)**: `#BAAEA0` (Active inputs, focus boundaries)
- **Status Success (`status-success`)**: Text `#4F7359`, Background `#EAF1EC`
- **Status Warning (`status-warning`)**: Text `#B87B28`, Background `#F7F2E7`
- **Status Error (`status-error`)**: Text `#A63A2A`, Background `#F7EAE8`

---

## 3. Typography Hierarchy

- **Headings and Display**: Serif font family (Playfair Display, DM Serif Display, Georgia) for editorial distinction.
- **Body and Controls**: Clean sans-serif font family (Inter, DM Sans, system-ui) for data legibility.
- **Evidence Links and Metrics**: Monospace font family (JetBrains Mono, Courier New) for tabular codes and sources.
- **Copywriting Constraint**: Never use the em dash symbol. Use commas, periods, colons, or parentheses instead.

---

## 4. Component Standards

1. **Buttons**:
   - Primary: Terracotta fill (`#B4532A`), inverted text (`#F8F3EC`), subtle hover lift, accessible focus ring.
   - Secondary: Ceramic surface (`#F8F3EC`), charcoal text (`#231F20`), border `#D9CFC3`.
   - Ghost: Transparent background, muted text, subtle hover tint.
2. **Citation Source Badges**:
   - Monospace font, 11px uppercase, font-weight 600.
   - Background `#E3E8E5` or `#F2EAE1`, text `#231F20`, border `#D9CFC3`.
   - Cursor pointer with hover highlight: clicking opens the Evidence Drawer inspector.
3. **Data Display Cards**:
   - Rounded corners (`rounded-xl` / 12px), subtle hairline border (`#D9CFC3`), no heavy artificial dropshadows.
4. **Copy Controls**:
   - One-click copy with instant 2-second visual feedback (`Copied!` with checkmark icon).

---

## 5. UI States and Resilience

- **Empty State**: Explicit message with icon and action button. Never leave blank white areas.
- **Loading State**: Restrained skeleton shimmer or spinner with descriptive progress message.
- **Demo Data Notice**: Clearly labels demonstration research fixtures. No fabricated claims or fake AI disclosures.
