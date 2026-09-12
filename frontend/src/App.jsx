import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronRight, Home, FileText, TrendingUp, BarChart3, PlusCircle, Sparkles } from 'lucide-react';
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
    { to: '/dashboard', label: isHi ? 'नतीजा' : 'Results', icon: BarChart3 },
    { to: '/financial', label: isHi ? 'लोन व किस्त' : 'Loan & EMI', icon: TrendingUp },
    { to: '/market', label: isHi ? 'बाजार मांग' : 'Market Demand', icon: Home },
    { to: '/report', label: isHi ? 'बैंक फाइल' : 'Bank Proposal', icon: FileText },
  ];

  const setLang = (newLang) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('gramdisha-lang', newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <nav className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="app-container h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo Lockup */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="inline-flex items-center gap-3 select-none shrink-0 group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0 shadow-xs transition-transform group-hover:scale-105">
            🌾
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-slate-950 font-black text-lg sm:text-xl tracking-tight leading-tight flex items-center gap-1.5">
              <span>GramDisha AI</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 uppercase tracking-wider">
                Govt Schemes
              </span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500 leading-tight">
              {isHi ? 'ग्रामीण व्यवसाय व बैंक ऋण योजना' : 'Rural Enterprise Intel & Loan Advisory'}
            </span>
          </div>
        </Link>

        {/* Right-Side Controls */}
        <div className="flex items-center gap-3">
          {hasAnalysis && (
            <div className="hidden md:flex items-center gap-1.5 mr-2">
              {navLinks.map((n) => {
                const isActive = location.pathname === n.to;
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* New Assessment Button */}
          <Button
            to="/assess"
            size="sm"
            variant="primary"
            icon={PlusCircle}
            iconPosition="left"
            className="shrink-0 shadow-sm"
          >
            {isHi ? 'नया व्यापार' : 'New Plan'}
          </Button>

          {/* Two-Segment Language Toggle */}
          <div
            className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 select-none shrink-0 gap-1"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 sm:px-3.5 py-1.5 min-h-[34px] text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center ${
                !isHi
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-3 sm:px-3.5 py-1.5 min-h-[34px] text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center ${
                isHi
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
              className="md:hidden inline-flex items-center justify-center p-2 min-h-[40px] min-w-[40px] rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {hasAnalysis && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-lg">
          {navLinks.map((n) => {
            const isActive = location.pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{n.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
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
      <div className="min-h-screen w-full flex flex-col bg-slate-50/70 text-slate-900">
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
        
        {/* Subtle Modern Footer */}
        <footer className="no-print border-t border-slate-200/80 bg-white py-10 text-center text-xs text-slate-500 space-y-2">
          <div className="app-container flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-base">🌾</span>
              <span className="font-bold text-slate-800">GramDisha AI</span>
              <span>— Rural Business Intelligence & Banking Assistant</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
              <span>PMMY • NABARD • SMAM • NRLM</span>
              <span>•</span>
              <span>100% Deterministic Banking Rules</span>
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
