import { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  ChevronRight,
  Landmark,
  FileSpreadsheet,
  Coins,
  Store,
  FileCheck,
  Plus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import Processing from './pages/Processing';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Financial from './pages/Financial';
import SWOT from './pages/SWOT';
import Recommendations from './pages/Recommendations';
import Comparison from './pages/Comparison';
import Report from './pages/Report';
import FloatingChat from './components/FloatingChat';
import Button from './components/ui/Button';
import './services/firebase';

// Global analysis context
export const AnalysisContext = createContext(null);

function Navbar() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHi = i18n.language === 'hi';
  const hasAnalysis = location.pathname !== '/' && location.pathname !== '/assess' && location.pathname !== '/processing';

  const navLinks = [
    { to: '/dashboard', label: isHi ? 'मूल्यांकन' : 'Viability', icon: Landmark },
    { to: '/financial', label: isHi ? 'ऋण तालिका' : 'Loan Ledger', icon: Coins },
    { to: '/market', label: isHi ? 'बाजार मांग' : 'Market', icon: Store },
    { to: '/swot', label: isHi ? 'जोखिम विश्लेषण' : 'SWOT & Risks', icon: FileSpreadsheet },
    { to: '/report', label: isHi ? 'बैंक DPR' : 'DPR Proposal', icon: FileCheck },
  ];

  const setLang = (newLang) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('gramdisha-lang', newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <nav className="no-print sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Subtle Gov Tricolor Indicator Hairline */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-blue-600" />

      <div className="app-container h-16 flex items-center justify-between gap-4">
        {/* Brand Logo Lockup */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="inline-flex items-center gap-3 select-none shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-emerald-800 transition-colors">
            GD
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                GramDisha <span className="text-emerald-700">AI</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                SIH'26
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5 hidden sm:block">
              {isHi ? 'ग्रामीण व्यवसाय व्यवहार्यता एवं ऋण परामर्श' : 'Rural Enterprise Viability & Loan Advisory'}
            </span>
          </div>
        </Link>

        {/* Right-Side Controls */}
        <div className="flex items-center gap-2.5">
          {hasAnalysis && (
            <div className="hidden lg:flex items-center gap-1 mr-1 border-r border-slate-200 pr-2">
              {navLinks.map((n) => {
                const isActive = location.pathname === n.to;
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* New Appraisal Button */}
          <Link
            to="/assess"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHi ? 'नया मूल्यांकन' : 'New Appraisal'}</span>
          </Link>

          {/* Segmented Language Toggle */}
          <div
            className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 select-none shrink-0 text-xs font-semibold"
            role="group"
            aria-label="Language selector"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                !isHi
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                isHi
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Mobile Menu Button */}
          {hasAnalysis && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {hasAnalysis && mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-md">
          {navLinks.map((n) => {
            const isActive = location.pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                  isActive ? 'bg-emerald-700 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{n.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

function AppContent() {
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState(null);

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis, formData, setFormData }}>
      <div className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/assess" element={<Assessment />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/market" element={<Market />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/swot" element={<SWOT />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
        
        {/* Modern Clean Footer */}
        <footer className="no-print border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
          <div className="app-container flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                GD
              </span>
              <div>
                <span className="font-bold text-slate-900">GramDisha AI</span>
                <span className="mx-2 text-slate-300">•</span>
                <span>Rural Enterprise Viability & Credit Appraisal Platform</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">PMMY</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">NABARD</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">SMAM</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">NRLM</span>
              <span className="mx-1 text-slate-300">•</span>
              <span>100% Deterministic Financial Mathematics</span>
            </div>
          </div>
        </footer>

        {analysis && <FloatingChat />}
      </div>
    </AnalysisContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
