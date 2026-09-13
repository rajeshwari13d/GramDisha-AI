# 🏛️ GramDisha AI — Master Design System Specification

## 1. Product Thesis & Visual Identity

**GramDisha AI** is a rural enterprise viability calculator and bank-loan structuring platform (SIH 2026 Hackathon prototype). It operates as a credible hybrid between an **official Indian bank credit appraisal document** (SBI, NABARD, PMMY) and a **modern Indian e-governance service portal** (such as JanSamarth / GeM / PM-KMY).

### Key Directives:
* **No AI/SaaS Tropes:** No generic Silicon Valley SaaS dashboards, no stark white-on-white card clusters, and no casual emoji.
* **Warm Parchment & Charcoal Ink:** Rooted in physical Indian document/bond-paper aesthetics with deep institutional forest green and terracotta accents.
* **Formal Typography:** Editorial serif/slab typography for certificate-like headings, hero viability figures, and official ledger tables, paired with crisp humanist sans for form controls.
* **Monoline Iconography:** 100% SVG monoline vector iconography across all 8 rural trade models, navigation, and badges.

---

## 2. Color Palette & Semantic Assignment Rules

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **Canvas Paper Background** | `#F9F8F5` | Warm off-white parchment paper texture. |
| **Document Card Surface** | `#FFFFFF` | Primary white document sheet with subtle parchment border. |
| **Parchment Subtle Surface** | `#F2EEE5` | Alternating section containers, ledger header bands, data chips. |
| **Parchment Border Default** | `#E1D9CC` | Fine document ruling line (0.75px–1px). |
| **Parchment Border Strong** | `#C7BCA9` | Prominent division rules, active input focus bounds. |
| **Charcoal Ink (Primary Text)**| `#1B221E` | High-contrast deep carbon black ink (>13:1 contrast). |
| **Muted Ink (Secondary Text)** | `#4C5751` | Explanatory labels, bank terms, methodology subtitles. |
| **Subtle Ink (Captions/Units)** | `#77837C` | Ledger units, footnotes, quiet metadata. |
| **Institutional Bank Green** | `#144A38` | **Brand & Primary Action ONLY.** High-prestige Nationalised Bank green. |
| **Terracotta Accent** | `#C25E00` | **Hero Viability Score & Agri Highlights.** Warm Indian terracotta clay. |
| **Semantic: Recommended** | `#157347` | Reserved exclusively for "Highly Viable / Approved" state (`bg: #EBF7EE`, `border: #B7E4C7`). |
| **Semantic: Caution** | `#B45309` | Reserved exclusively for "Conditional / Moderate Risk" state (`bg: #FEF7E6`, `border: #FCDA9C`). |
| **Semantic: High Risk** | `#BA1A1A` | Reserved exclusively for "High Risk / Not Recommended" state (`bg: #FDF2F2`, `border: #F8B6B6`). |
| **Official Scheme / Directive**| `#1B4965` | Official RBI / Ministry scheme parameters (`bg: #EFF6FB`, `border: #C1DCEE`). |

---

## 3. Typography Hierarchy

* **Headings & Hero Numbers:** `'Source Serif 4', 'Merriweather', 'Noto Serif Devanagari', Georgia, serif`
* **Body & Form UI:** `'Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', -apple-system, sans-serif`
* **Tabular Figures:** `font-variant-numeric: tabular-nums` strictly enabled for currency columns, amortization ledgers, and EMI calculations.
* **No ALL-CAPS Hierarchy:** Hierarchy is achieved through distinct type scale steps, serif styling, and font weights.

---

## 4. Iconography Standards (Zero Emoji)

Monoline SVG stroke icons (1.5px–1.75px stroke) for all rural trades:
* **Dairy & Milk:** Milk canister / milk bucket line art (`Milk`, `Droplets`)
* **Retail & Kirana:** Village storefront / shop outline (`Store`, `ShoppingBag`)
* **Poultry:** Bird farming / egg line art (`Egg`, `Feather`)
* **Flour Mill & Spices:** Grain sheaf / flour mill cog (`Wheat`, `UtensilsCrossed`)
* **Tailoring & Garments:** Stitching needle / apparel line (`Scissors`, `Shirt`)
* **Tractor & Agro:** Farm machinery / tractor outline (`Tractor`, `Wrench`)
* **Motor & Bike Workshop:** Vehicle repair spanner / gear (`Wrench`, `Settings`)
* **Handicraft & Pottery:** Clay vase / artisan craftwork (`Palette`, `Hammer`)

---

## 5. Screen Breakdown & Flow Architecture

1. **Enterprise Selection:** 8 monoline trade cards with sector profiles, capital thresholds, and quiet selection state.
2. **Location Selection:** Regional catchment mapper with cascading State &rarr; District &rarr; Block &rarr; Village selector and demographic catchment preview.
3. **Capital Structuring:** Dynamic 10% promoter equity vs. 90% bank loan ratio slider + live borrowing power ledger.
4. **Viability Dashboard:** Grand **Radial Viability Gauge** (Hero Focal Point), 4 formal KPI summary boxes, RBI scheme mandate, and quick action pathways.
5. **Loan & Repayment Ledger (Financial):** 28-Quarter amortization schedule, DSCR debt coverage calculation, and interactive quarterly loan balance chart.
6. **Market Catchment & SWOT:** Primary (5km) and secondary (15km) radius demand, customer demographics, and 4-quadrant SWOT matrix.
7. **Official Bank Proposal (DPR):** Formal printable Project Appraisal Dossier ready for submission to branch credit managers.
