# 🌾 GramDisha AI

> **"Your village. Your business. Your smartest financial plan."**  
> *Problem Statement SIH26091 — Smart India Hackathon (SIH 2026)*

GramDisha AI is a rural business decision-support tool that bridges grassroots entrepreneurial ambition with bank-approved financial feasibility. It operates on a strict three-tier intelligence architecture:

1. **Local Intelligence**: Catchment radius mapping, customer segmentation, and surveyed rural price benchmarks.
2. **Financial Intelligence**: 100% deterministic banking math ($10:90$ capital split, official PMMY/NABARD scheme routing, reducing-balance EMI formula, 28-quarter amortization schedule). Zero financial hallucinations.
3. **Decision Intelligence**: 5-factor weighted viability engine, contextual AI strategic SWOT analysis, 90-day execution roadmap, and formal bank proposal PDF generation.

---

## 🏛️ System Architecture

- **Backend**: FastAPI (Python 3.11+), NumPy, Pydantic, ReportLab, PyTest.
- **Frontend**: React 18, Vite, TailwindCSS, Recharts, Lucide Icons, i18next (Full English & Hindi parity).
- **Compliance**: Adheres strictly to official Reserve Bank of India (RBI) reducing-balance amortization and Pradhan Mantri Mudra Yojana (PMMY) guidelines.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Web interface available at: `http://localhost:5173`

### 4. Running Test Suite
```bash
cd backend
pytest tests/ -v
```
All 43 unit and integration tests verify deterministic 10:90 math, loan limit clamping, and amortization closing balances.

---

## 📋 Standard 10:90 Capital Model

$$\text{Project Cost} = \text{Margin Capital} \times 10$$
$$\text{Theoretical Loan} = \text{Margin Capital} \times 9$$
$$\text{EMI} = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$$

*All financial calculations are strictly mathematical with zero LLM generation for numeric figures.*
