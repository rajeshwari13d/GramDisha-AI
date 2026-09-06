import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronRight } from 'lucide-react';
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

// Global analysis context
export const AnalysisContext = createContext(null);

function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hasAnalysis = location.pathname !== '/' && location.pathname !== '/assess' && location.pathname !== '/processing';

  const navLinks = [
    { to: '/dashboard', label: t('nav.dashboard') },
    { to: '/financial', label: t('nav.financial') },
    { to: '/market', label: t('nav.market') },
    { to: '/report', label: t('nav.report') },
  ];

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('gramdisha-lang', newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <nav className="no-print sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 text-[var(--color-text)] font-bold text-base sm:text-lg focus-visible:outline-2"
        >
          <span className="text-2xl" aria-hidden="true">🌾</span>
          <span className="tracking-tight text-[var(--color-positive)] font-extrabold">GramDisha AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-2">
          {hasAnalysis && (
            <div className="hidden lg:flex items-center gap-1 text-xs sm:text-sm">
              {navLinks.map((n) => {
                const isActive = location.pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      isActive
                        ? 'bg-[var(--color-positive-bg)] text-[var(--color-positive)] font-bold'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]'
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-subtle)] text-[var(--color-text)]"
            aria-label="Toggle language between English and Hindi"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span>{i18n.language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          {hasAnalysis && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] transition-colors border border-[var(--color-border)]"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {hasAnalysis && mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-lg space-y-1">
          {navLinks.map((n) => {
            const isActive = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[var(--color-positive-bg)] text-[var(--color-positive)]'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]'
                }`}
              >
                <span>{n.label}</span>
                <ChevronRight className="w-4 h-4 text-[var(--color-text-subtle)]" />
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
      <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <Navbar />
        <main className="flex-1">
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
