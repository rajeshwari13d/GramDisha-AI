import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronRight, Home, FileText, TrendingUp, BarChart3, PlusCircle } from 'lucide-react';
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
    <nav className="no-print sticky top-0 z-40 bg-white border-b border-[#DCD3C5] shadow-xs">
      <div className="app-container h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Logo Lockup */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="inline-flex items-center gap-2.5 sm:gap-3 select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F4EFEB] border border-[#DCD3C5] flex items-center justify-center text-2xl shrink-0 shadow-xs">
            🌾
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-gray-900 font-black text-lg sm:text-xl leading-tight">
              GramDisha AI
            </span>
            <span className="text-[11px] font-semibold text-gray-500 leading-tight">
              {isHi ? 'ग्रामीण व्यवसाय योजना' : 'Rural Enterprise Intel'}
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
                    className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#1B5E20] text-white shadow-xs'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-[#F4EFEB]'
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
            className="shrink-0 shadow-xs"
          >
            {isHi ? 'नया व्यापार' : 'New Plan'}
          </Button>

          {/* Two-Segment Language Toggle */}
          <div
            className="inline-flex items-center p-1 rounded-xl bg-[#F4EFEB] border border-[#DCD3C5] select-none shrink-0 gap-1"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3.5 py-1.5 min-h-[34px] text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center ${
                !isHi
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-3.5 py-1.5 min-h-[34px] text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center ${
                isHi
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
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
              className="md:hidden inline-flex items-center justify-center p-2 min-h-[38px] min-w-[38px] rounded-xl text-gray-700 hover:bg-[#F4EFEB] border border-[#DCD3C5] cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {hasAnalysis && mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DCD3C5] bg-white px-4 py-3 space-y-1.5">
          {navLinks.map((n) => {
            const isActive = location.pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                  isActive ? 'bg-[#1B5E20] text-white' : 'text-gray-800 hover:bg-[#F4EFEB]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
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
      <div className="min-h-screen w-full flex flex-col bg-[#FAF8F5] text-[#1C1917]">
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
