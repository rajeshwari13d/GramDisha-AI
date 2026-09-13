import { useState, createContext, useContext } from 'react';
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
  ClipboardCheck,
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
import VendorSurveyModal from './components/VendorSurveyModal';
import Button from './components/ui/Button';
import './services/firebase';

// Global analysis context
export const AnalysisContext = createContext(null);

function Navbar() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { setIsSurveyOpen } = useContext(AnalysisContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHi = i18n.language === 'hi';
  const hasAnalysis = location.pathname !== '/' && location.pathname !== '/assess' && location.pathname !== '/processing';

  const navLinks = [
    { to: '/dashboard', label: isHi ? 'मूल्यांकन' : 'Viability', icon: Landmark },
    { to: '/financial', label: isHi ? 'ऋण तालिका' : 'Loan Ledger', icon: Coins },
    { to: '/market', label: isHi ? 'बाजार मांग' : 'Market', icon: Store },
    { to: '/swot', label: isHi ? 'जोखिम' : 'SWOT & Risks', icon: FileSpreadsheet },
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

      <div className="app-container h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo Lockup */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="inline-flex items-center gap-2 sm:gap-3 select-none shrink-0 group min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs group-hover:bg-emerald-800 transition-colors shrink-0">
            GD
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none truncate">
                GramDisha <span className="text-emerald-700">AI</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 sm:py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                SIH'26
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5 hidden md:block truncate">
              {isHi ? 'ग्रामीण व्यवसाय व्यवहार्यता एवं ऋण परामर्श' : 'Rural Enterprise Viability & Loan Advisory'}
            </span>
          </div>
        </Link>

        {/* Right-Side Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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

          {/* Ground Survey Button */}
          <button
            type="button"
            onClick={() => setIsSurveyOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all cursor-pointer shrink-0"
            title={isHi ? 'ज़मीनी व्यापारी डेटा सर्वेक्षण' : 'Local Vendor Ground Survey'}
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">{isHi ? 'व्यापारी सर्वेक्षण' : 'Survey'}</span>
          </button>

          {/* New Appraisal Button */}
          <Link
            to="/assess"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{isHi ? 'नया मूल्यांकन' : 'New'}</span>
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
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer text-xs ${
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
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer text-xs ${
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
              className="lg:hidden inline-flex items-center justify-center p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
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

function MobileBottomNav() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isHi = i18n.language === 'hi';
  const hasAnalysis = location.pathname !== '/' && location.pathname !== '/assess' && location.pathname !== '/processing';

  if (!hasAnalysis) return null;

  const navLinks = [
    { to: '/dashboard', label: isHi ? 'मूल्यांकन' : 'Viability', icon: Landmark },
    { to: '/financial', label: isHi ? 'ऋण' : 'Ledger', icon: Coins },
    { to: '/market', label: isHi ? 'बाजार' : 'Market', icon: Store },
    { to: '/swot', label: isHi ? 'जोखिम' : 'SWOT', icon: FileSpreadsheet },
    { to: '/report', label: isHi ? 'DPR' : 'DPR', icon: FileCheck },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-1 py-1.5 flex items-center justify-around no-print">
      {navLinks.map((n) => {
        const isActive = location.pathname === n.to;
        const Icon = n.icon;
        return (
          <Link
            key={n.to}
            to={n.to}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all min-w-[54px] ${
              isActive
                ? 'text-emerald-700 font-bold bg-emerald-50/80'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight leading-none">{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

function AppContent() {
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const location = useLocation();
  const hasAnalysis = location.pathname !== '/' && location.pathname !== '/assess' && location.pathname !== '/processing';

  return (
    <AnalysisContext.Provider
      value={{
        analysis,
        setAnalysis,
        formData,
        setFormData,
        isSurveyOpen,
        setIsSurveyOpen,
        openSurvey: () => setIsSurveyOpen(true),
      }}
    >
      <div className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className={`flex-1 w-full ${hasAnalysis ? 'pb-16 lg:pb-0' : ''}`}>
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
        <footer className={`no-print border-t border-slate-200 bg-white py-8 text-xs text-slate-500 ${hasAnalysis ? 'mb-14 lg:mb-0' : ''}`}>
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
              <button
                type="button"
                onClick={() => setIsSurveyOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold cursor-pointer transition-colors"
              >
                <ClipboardCheck className="w-3 h-3 text-emerald-700" />
                <span>Ground Vendor Survey (Firebase)</span>
              </button>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">PMMY</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">NABARD</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">SMAM</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">NRLM</span>
            </div>
          </div>
        </footer>

        {analysis && <FloatingChat />}
        <MobileBottomNav />
        <VendorSurveyModal isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} />
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


