# 🌾 GramDisha AI — Design System Specification & UI/UX Standards

## 1. Product Identity & Design Thesis

- **Subject:** A financial decision-support tool used by a rural Indian entrepreneur, predominantly on a mid-range Android smartphone (often in Hindi), to evaluate the viability of a real business and bank loan application.
- **Audience:** Someone with practical local business acumen but potentially limited formal financial literacy, making a high-stakes, life-changing financial decision.
- **Primary Design Goal:** Make figures, repayment obligations, and recommendations feel **clear, calm, and trustworthy**. No "flashy fintech," no dark-mode SaaS dashboard tropes, no decorative gradient hero walls, and no confusing clutter. The visual tone is warm, dignified, and authoritative—comparable to a modern, beautifully designed institutional banking form.

---

## 2. Design Tokens

### 2.1 Color Palette
Semantic colors are strictly limited. Color is **never** used alone to convey meaning; it is always accompanied by an explicit text label and an icon.

| Token | CSS Variable | Value | Role / Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `--color-bg` | `#FAF8F5` | Warm, calm off-white / light wheat canvas. Eliminates screen glare. |
| **Surface (Card) Base** | `--color-surface` | `#FFFFFF` | Primary card and panel background. |
| **Surface Subtle** | `--color-surface-subtle` | `#F3EFEA` | Secondary container, fieldset groupings, table headers. |
| **Surface Muted** | `--color-surface-muted` | `#EAE4DC` | Form inputs background, subtle dividers. |
| **Border Default** | `--color-border` | `#DDD6CA` | Consistent card, table, and panel borders. |
| **Border Strong** | `--color-border-strong` | `#C4BBAE` | Focused elements, prominent separators. |
| **Text Primary** | `--color-text` | `#1F1B16` | Deep earthen near-black; primary copy, headings, and numbers. |
| **Text Secondary** | `--color-text-muted` | `#5C5549` | Explanatory labels, subtitles, metadata. |
| **Text Tertiary** | `--color-text-subtle` | `#8C8273` | Hints, units, timestamps. |
| **Positive / Viable** | `--color-positive` | `#235C3F` | High viability, profitable surplus, calculated accuracy. |
| **Positive Surface** | `--color-positive-bg` | `#EDF5F0` | Background tint for positive indicators and badges. |
| **Caution / Moderate** | `--color-caution` | `#9A5B0B` | Moderate viability, tight cashflow, conditional approval. |
| **Caution Surface** | `--color-caution-bg` | `#FCF6EC` | Background tint for warning/caution indicators. |
| **Negative / High Risk**| `--color-negative` | `#A32A2A` | Unviable state, deficit cashflow, critical risk alert. |
| **Negative Surface** | `--color-negative-bg` | `#FDF2F2` | Background tint for negative indicators. |
| **Scheme / Official Rule**| `--color-rule` | `#1E4E79` | Official government scheme parameter / RBI banking rule. |
| **Scheme Surface** | `--color-rule-bg` | `#EDF3F8` | Background tint for official scheme badges. |
| **AI Advisory Accent** | `--color-advisory` | `#4E3875` | AI strategic analysis and commentary provenance. |
| **AI Advisory Surface**| `--color-advisory-bg`| `#F3EFF9` | Background tint for AI advisory badges. |

### 2.2 Typography Scale
All body text and headings use an explicit, deliberate scale based on Inter (for Latin/English) paired seamlessly with **Noto Sans Devanagari** (for Hindi).

- **Font Family:** `font-sans: 'Inter', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, sans-serif;`
- **Tabular Numbers:** Applied to all figures, percentages, and currencies via `font-variant-numeric: tabular-nums;` to prevent layout jitter.
- **Devanagari Line-Height:** Elements with `lang="hi"` or containing Devanagari script are assigned an expanded `line-height: 1.6` to accommodate vertical matras cleanly.

| Scale Token | Size (px) | Line Height | Usage |
| :--- | :--- | :--- | :--- |
| `text-hero` | 36px (mob) / 44px (desk) | 1.15 | Primary Landing headline, Viability Hero score |
| `text-display` | 28px (mob) / 32px (desk) | 1.20 | Major page headers, Section 1st tier titles |
| `text-title` | 20px (mob) / 24px (desk) | 1.25 | Card titles, modal headers, major KPI values |
| `text-subtitle`| 16px (mob) / 18px (desk) | 1.40 | Subsection headings, prominent form labels |
| `text-body` | 15px (mob) / 16px (desk) | 1.50 (en) / 1.65 (hi) | Standard paragraph copy, table data |
| `text-caption` | 13px (mob) / 14px (desk) | 1.45 (en) / 1.55 (hi) | Input helper text, secondary descriptions |
| `text-label` | 11px (mob) / 12px (desk) | 1.30 | Field uppercase tags, badges, table headers |

### 2.3 Spacing & Layout Grid
- **Scale:** Strict 4px/8px multiples (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`). No arbitrary one-off pixel values in inline styles.
- **Breakpoints:**
  - **Mobile (`< 641px`):** Target screen 375px. Single-column flow. Minimum touch targets 44x44px. Bottom-anchored or high-visibility CTA. 16px side padding.
  - **Tablet (`641px – 1024px`):** 2-column content pairing (e.g. SWOT 2x2 grid, Location 2x2 grid). 24px side padding.
  - **Desktop (`≥ 1025px`):** 12-column Grid with max container `1200px`. Multi-column dashboard layouts with Viability Hero side panel and structured KPI grids. 32px side padding.

---

## 3. Component Consistency Audit & Standards

| Component | Audit Flaws Identified | Standardized Unified Treatment |
| :--- | :--- | :--- |
| **Cards** | Mixed padding (`p-3`, `p-5`, `p-8`), mismatched border radii and inconsistent drop shadows. | Standardized `rounded-xl`, border `1px solid var(--color-border)`, background `var(--color-surface)`, shadow `0 1px 3px rgba(31,27,22,0.05)`, padding: `p-4` (mobile) / `p-6` (tablet/desktop). |
| **Primary Buttons** | Variable padding, conflicting gradients, and floating off-screen on phone. | Solid earthen green (`#235C3F`), hover `#1B4A32`, text `#FFFFFF`, font-weight 600, radius `rounded-lg`, height `min-h-[44px]`, touch target padding `px-5 py-3`. Full width on mobile. |
| **Secondary Buttons**| Ad-hoc borders, inconsistent gray tones. | White surface, border `1px solid var(--color-border)`, text `var(--color-text)`, hover `var(--color-surface-subtle)`. |
| **Form Inputs** | Inconsistent heights, misaligned labels, loose validation text. | Unified label above input (`text-caption font-semibold`), fixed height `44px`, background `var(--color-surface)`, border `1px solid var(--color-border)`, focus ring `2px solid var(--color-positive)`. |
| **Location Grouping**| 4 disjointed separate inputs. | Grouped into a single bordered fieldset (`var(--color-surface-subtle)` bg), 1-col on mobile, 2x2 grid on desktop. |
| **Badges** | Free-form color combinations and sizing. | Standardized pill `px-2.5 py-1 text-label font-medium rounded-full border flex items-center gap-1.5`. Always icon + label. |
| **Viability Score** | Sized identically to standard sub-cards. | Dedicated **Visual Hero** card commanding top position; large score gauge + clear verdict label and guidance text. |
| **Data Tables** | Horizontal blowouts on 375px screens. | Clean responsive cards on mobile; tabular data tables with vertical alignment and sticky/scroll hints on desktop. |
| **Floating Chat** | Overlapped primary action buttons on mobile screens. | Fixed z-index position with mobile-safe bottom clearance (`bottom-20 md:bottom-6`), responsive popup dimensions. |

---

## 4. Motion & Reduced-Motion Rules
- Decorative slide/fade animations on static page load are removed to provide an immediate, stable, reliable feel.
- One deliberate progress ticker on the `Processing` screen.
- All transitions respect `@media (prefers-reduced-motion: reduce)`.
