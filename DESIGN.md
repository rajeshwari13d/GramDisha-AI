# 🌾 GramDisha AI — Design System Specification & UI/UX Standards

## 1. Product Identity & Design Thesis

- **Subject:** A financial decision-support tool used by a rural Indian entrepreneur, predominantly on a mid-range Android smartphone (often in Hindi), to evaluate the viability of a real business and bank loan application.
- **Audience:** Someone with practical local business acumen but potentially limited formal financial literacy, making a high-stakes, life-changing financial decision.
- **Primary Design Goal:** Make figures, repayment obligations, and recommendations feel **clear, calm, and trustworthy**. No "flashy fintech," no dark-mode SaaS dashboard tropes, no decorative rainbow cards, and no confusing clutter. The visual tone is warm, dignified, and authoritative—comparable to a modern institutional banking portal.

---

## 2. Design Tokens & Palette Rules

### 2.1 Color Palette

Semantic colors are strictly limited and used **exclusively for meaningful outcome states** (viability verdict, risk level, health assessment), never for neutral factual data display (like EMI amount, loan amount, project cost).

| Token | CSS Variable | Value | Role / Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `--color-bg` | `#FAF8F5` | Warm, calm off-white / light wheat canvas. |
| **Surface (Card) Base** | `--color-surface` | `#FFFFFF` | Primary card and panel background. |
| **Surface Subtle** | `--color-surface-subtle` | `#F4EFEB` | Alternating section containers, fieldset groupings, neutral data chips. |
| **Surface Muted** | `--color-surface-muted` | `#EBE3D7` | Form inputs background, subtle dividers. |
| **Border Default** | `--color-border` | `#DCD3C5` | Consistent card, table, and panel borders. |
| **Border Strong** | `--color-border-strong` | `#BCB09F` | Focused elements, prominent separators. |
| **Text Primary** | `--color-text` | `#1C1917` | Deep earthen near-black; primary copy, headings, and numbers. |
| **Text Muted** | `--color-text-muted` | `#57534E` | Explanatory labels, subtitles, metadata. |
| **Text Subtle** | `--color-text-subtle` | `#857E75` | Hints, units, timestamps. |
| **Brand Primary / Accent** | `--color-positive` | `#1B5E20` | Deep forest green for primary CTA buttons, active tabs, wordmark. |
| **Positive / Viable** | `--color-positive` | `#1B5E20` | High viability, profitable surplus, calculated accuracy. (Bg: `#E8F5E9`, Border: `#A5D6A7`) |
| **Caution / Moderate** | `--color-caution` | `#B45309` | Moderate viability, tight cashflow, conditional approval. (Bg: `#FEF3C7`, Border: `#FDE68A`) |
| **Negative / High Risk** | `--color-negative` | `#B91C1C` | Unviable state, deficit cashflow, critical risk alert. (Bg: `#FEE2E2`, Border: `#FCA5A5`) |
| **Scheme / Official Rule** | `--color-rule` | `#0F52BA` | Official government scheme parameter / RBI banking rule. (Bg: `#EFF6FF`, Border: `#BFDBFE`) |

### 2.2 Neutral Data Display Rule (Non-Negotiable)
- All factual data (Monthly Profit, Loan Amount, Monthly EMI, Margin Capital, Project Cost) must share **one calm, unified neutral card style** (white surface `#FFFFFF`, subtle border `#DCD3C5`, neutral numbers in `#1C1917`).
- Never color-code neutral figures with pastel green/blue/yellow/purple rainbow chips.

### 2.3 Iconography Standards
- **Business Model Categories:** Culturally-legible high-contrast emoji shorthand (🥛 🏪 🐔 🌾 🧵 🚜 🔧 🎨) embedded in clean, uniform neutral circular/rounded avatars (never inconsistent colored square boxes).
- **UI / Controls / Navigation:** Standardized Lucide SVG icons (`w-4 h-4` / `w-5 h-5`), vertically centered with `leading-none` text labels.

### 2.4 Selection & Active States
- Selected cards must **never** invert to a solid dark fill.
- Selection is indicated via a **2–3px border in `#1B5E20`** plus a `ring-3 ring-[#1B5E20]/15`, preserving the clean white background and text contrast, with a discrete check indicator at the top right.

### 2.5 Typography & Spacing Rhythm
- **Font Family:** `font-sans: 'Inter', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, sans-serif;`
- **Headlines:** Set entirely in one consistent color/weight. No mid-sentence single-word coloring tricks.
- **Section Spacing:** Generous `py-16 sm:py-20` vertical rhythm with subtle alternating backgrounds (`#FAF8F5` canvas and `#FFFFFF` / `#F4EFEB` containers).
- **Language Toggle:** Prominent segmented control (`English | हिन्दी`) visible directly in the header.
