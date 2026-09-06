import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Printer,
  Download,
  Building2,
  Calendar,
  Coins,
  FileText,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import { getReport } from '../services/api';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function Report() {
  const { analysis } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';

  if (!analysis) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 gd-card text-center space-y-4">
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          {isHi ? 'कोई सक्रिय रिपोर्ट नहीं मिली' : 'No Active Report'}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
          {isHi ? 'कृपया पहले व्यवसाय मूल्यांकन पूर्ण करें।' : 'Please run an assessment first to view this proposal.'}
        </p>
        <button
          onClick={() => navigate('/assess')}
          className="gd-btn-primary mx-auto"
        >
          {isHi ? 'मूल्यांकन शुरू करें' : 'Start Assessment'}
        </button>
      </div>
    );
  }

  const {
    analysis_id,
    business_name,
    business_name_hi,
    location,
    financial,
    financial_health,
    business_analysis,
    viability,
    recommendation,
    quarterly_repayment,
    created_at,
  } = analysis;

  const displayName = isHi ? business_name_hi || business_name : business_name;
  const displayScheme = isHi ? financial.scheme_hi || financial.scheme : financial.scheme;
  const pdfUrl = getReport(analysis_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-xs print:hidden">
        <div>
          <h2 className="font-bold text-[var(--color-text)] text-sm sm:text-base">
            {isHi ? 'औपचारिक बैंक ऋण प्रस्ताव दस्तावेज' : 'Formal Bank Loan Proposal Document'}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            ID: <span className="font-mono font-bold text-[var(--color-text)]">{analysis_id}</span> • {new Date(created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="gd-btn-secondary text-xs px-3 py-2 min-h-[38px]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gd-btn-primary text-xs px-4 py-2 min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isHi ? 'पीडीएफ डाउनलोड (PDF)' : 'Download PDF'}</span>
          </a>
        </div>
      </div>

      {/* Main Document Canvas */}
      <div className="bg-[var(--color-surface)] rounded-xl p-6 sm:p-10 border border-[var(--color-border-strong)] shadow-xs space-y-7 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-[var(--color-positive)] pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-text)] font-extrabold text-xl sm:text-2xl">
              <span aria-hidden="true">🌾</span>
              <span className="text-[var(--color-positive)]">GramDisha AI</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] font-medium mt-1">
              {isHi
                ? 'ग्रामीण उद्यम वित्तीय व्यवहार्यता व ऋण संरचना प्रतिवेदन'
                : 'Rural Enterprise Viability Assessment & Bank Loan Proposal'}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-[var(--color-text-muted)] space-y-0.5 tabular-nums">
            <p><span className="font-semibold text-[var(--color-text)]">{isHi ? 'दस्तावेज क्रमांक' : 'Ref ID'}:</span> <span className="font-mono font-bold text-[var(--color-text)]">{analysis_id}</span></p>
            <p><span className="font-semibold text-[var(--color-text)]">{isHi ? 'दिनांक' : 'Date'}:</span> {new Date(created_at).toLocaleDateString()}</p>
            <p><span className="font-semibold text-[var(--color-text)]">{isHi ? 'योजना ढांचा' : 'Framework'}:</span> SIH 2026 (SIH26091)</p>
          </div>
        </div>

        {/* 1. Enterprise Profile */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              {isHi ? '1. उद्यम व उद्यमी प्रोफ़ाइल' : '1. Enterprise & Geographic Profile'}
            </h3>
            <ProvenanceBadge type="prototype" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[var(--color-surface-subtle)] rounded-xl border border-[var(--color-border)] text-xs">
            <div>
              <span className="text-[var(--color-text-subtle)] block text-[11px]">{isHi ? 'व्यवसाय' : 'Business'}</span>
              <span className="font-bold text-[var(--color-text)] text-sm">{displayName}</span>
            </div>
            <div>
              <span className="text-[var(--color-text-subtle)] block text-[11px]">{isHi ? 'स्थान' : 'Location'}</span>
              <span className="font-bold text-[var(--color-text)]">{location.village}, {location.block}</span>
            </div>
            <div>
              <span className="text-[var(--color-text-subtle)] block text-[11px]">{isHi ? 'जिला व राज्य' : 'District & State'}</span>
              <span className="font-bold text-[var(--color-text)]">{location.district}, {location.state}</span>
            </div>
            <div>
              <span className="text-[var(--color-text-subtle)] block text-[11px]">{isHi ? 'व्यवहार्यता' : 'Viability Score'}</span>
              <span className="font-extrabold text-[var(--color-positive)] text-sm tabular-nums">{viability.viability_score}/100</span>
            </div>
          </div>
        </div>

        {/* 2. Project Cost & Loan Structuring (10:90) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              {isHi ? '2. परियोजना लागत व ऋण संरचना (10:90 नियम)' : '2. Project Cost & Loan Structuring (10:90 Rule)'}
            </h3>
            <ProvenanceBadge type="calculated" />
          </div>

          <div className="overflow-x-auto border border-[var(--color-border)] rounded-xl">
            <table className="w-full text-xs sm:text-sm text-left min-w-[480px]">
              <thead className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)] font-bold uppercase text-[11px] text-[var(--color-text-muted)]">
                <tr>
                  <th className="p-3">{isHi ? 'घटक (Component)' : 'Component'}</th>
                  <th className="p-3">{isHi ? 'अनुपात' : 'Ratio'}</th>
                  <th className="p-3 text-right">{isHi ? 'राशि (INR)' : 'Amount (INR)'}</th>
                  <th className="p-3">{isHi ? 'साक्ष्य (Provenance)' : 'Provenance'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                <tr>
                  <td className="p-3 font-semibold text-[var(--color-text)]">
                    {isHi ? 'उद्यमी का अंशदान (मार्जिन पूंजी)' : 'Entrepreneur Margin Capital'}
                  </td>
                  <td className="p-3 text-[var(--color-text-muted)] tabular-nums">10.0%</td>
                  <td className="p-3 text-right font-bold text-[var(--color-text)] tabular-nums">
                    ₹{(financial.margin_capital || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3"><ProvenanceBadge type="calculated" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[var(--color-positive)]">
                    {isHi ? 'स्वीकृत बैंक ऋण (Term Loan)' : 'Sanctioned Term Loan'}
                  </td>
                  <td className="p-3 text-[var(--color-text-muted)] tabular-nums">90.0%</td>
                  <td className="p-3 text-right font-bold text-[var(--color-positive)] tabular-nums">
                    ₹{(financial.loan_amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3"><ProvenanceBadge type="calculated" /></td>
                </tr>
                <tr className="bg-[var(--color-surface-subtle)] font-bold">
                  <td className="p-3 text-[var(--color-text)]">
                    {isHi ? 'कुल परियोजना लागत (Total Project Cost)' : 'Total Project Cost'}
                  </td>
                  <td className="p-3 text-[var(--color-text-muted)] tabular-nums">100.0%</td>
                  <td className="p-3 text-right text-[var(--color-text)] font-extrabold text-sm sm:text-base tabular-nums">
                    ₹{(financial.project_cost || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3"><ProvenanceBadge type="calculated" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Scheme Guidelines & Terms */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              {isHi ? '3. लागू बैंक योजना व नियम' : '3. Applicable Scheme Terms'}
            </h3>
            <ProvenanceBadge type="official_rule" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 border border-[var(--color-rule-border)] bg-[var(--color-rule-bg)] rounded-xl text-xs">
            <div>
              <span className="text-[var(--color-text-muted)] block text-[11px]">{isHi ? 'योजना का नाम' : 'Scheme Name'}</span>
              <span className="font-bold text-[var(--color-text)] text-sm">{displayScheme}</span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)] block text-[11px]">{isHi ? 'ब्याज दर' : 'Interest Rate'}</span>
              <span className="font-bold text-[var(--color-text)] tabular-nums">{financial.interest_rate}% p.a.</span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)] block text-[11px]">{isHi ? 'ऋण अवधि' : 'Tenure'}</span>
              <span className="font-bold text-[var(--color-text)] tabular-nums">{financial.tenure_years} {isHi ? 'वर्ष' : 'Years'}</span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)] block text-[11px]">{isHi ? 'मासिक ईएमआई' : 'Monthly EMI'}</span>
              <span className="font-bold text-[var(--color-positive)] text-sm tabular-nums">₹{(financial.estimated_emi || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* 4. Cash Flow Feasibility */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              {isHi ? '4. नकदी प्रवाह व ऋण भुगतान क्षमता' : '4. Cash Flow & Repayment Feasibility'}
            </h3>
            <ProvenanceBadge type="calculated" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-3.5 bg-[var(--color-surface-subtle)] rounded-xl border border-[var(--color-border)]">
            <div>
              <span className="text-[var(--color-text-muted)] block text-[11px]">{isHi ? 'मासिक अनुमानित आय' : 'Est. Monthly Revenue'}</span>
              <span className="font-bold text-[var(--color-text)] tabular-nums text-sm">₹{(business_analysis.estimated_monthly_revenue || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)] block text-[11px]">{isHi ? 'मासिक परिचालन व्यय' : 'Est. Operating Cost'}</span>
              <span className="font-bold text-[var(--color-text)] tabular-nums text-sm">₹{(business_analysis.estimated_operating_cost || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)] block text-[11px]">{isHi ? 'मासिक शुद्ध बचत' : 'Net Surplus Post-EMI'}</span>
              <span className="font-bold text-[var(--color-positive)] tabular-nums text-sm">₹{(financial_health.monthly_surplus || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* 5. Year 1 Loan Amortization Schedule */}
        {quarterly_repayment && quarterly_repayment.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
                {isHi ? '5. प्रथम वर्ष ऋण चुकौती अनुसूची (त्रैमासिक)' : '5. First-Year Loan Repayment Milestones (Quarterly)'}
              </h3>
              <ProvenanceBadge type="calculated" />
            </div>

            <div className="overflow-x-auto border border-[var(--color-border)] rounded-xl">
              <table className="w-full text-xs text-left min-w-[480px]">
                <thead className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)] font-bold uppercase text-[11px] text-[var(--color-text-muted)]">
                  <tr>
                    <th className="p-2.5">{isHi ? 'तिमाही' : 'Quarter'}</th>
                    <th className="p-2.5 text-right">{isHi ? 'मूलधन (INR)' : 'Principal (INR)'}</th>
                    <th className="p-2.5 text-right">{isHi ? 'ब्याज (INR)' : 'Interest (INR)'}</th>
                    <th className="p-2.5 text-right">{isHi ? 'कुल किस्त (INR)' : 'Total Installment (INR)'}</th>
                    <th className="p-2.5 text-right">{isHi ? 'शेष ऋण (INR)' : 'Closing Balance (INR)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {quarterly_repayment.slice(0, 4).map((q) => (
                    <tr key={q.quarter} className="hover:bg-[var(--color-surface-subtle)]">
                      <td className="p-2.5 font-bold text-[var(--color-text)]">{q.quarter_number ? `Q${q.quarter_number} (${q.quarter})` : q.quarter}</td>
                      <td className="p-2.5 text-right text-[var(--color-positive)] font-semibold tabular-nums">₹{Math.round(q.principal).toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right text-[var(--color-caution)] font-semibold tabular-nums">₹{Math.round(q.interest).toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right font-bold text-[var(--color-text)] tabular-nums">₹{Math.round(q.total_payment).toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right text-[var(--color-text-muted)] font-medium tabular-nums">₹{Math.round(q.remaining_balance || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Strategic AI Recommendation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              {isHi ? '6. रणनीतिक निर्णय एवं एआई सलाह' : '6. Decision Intelligence & Advisory'}
            </h3>
            <ProvenanceBadge type="ai_advisory" />
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-advisory-border)] bg-[var(--color-advisory-bg)] space-y-1.5 text-xs sm:text-sm">
            <div className="font-bold text-[var(--color-text)]">
              {isHi ? recommendation.recommendation_hi : recommendation.recommendation_en}
            </div>
            {recommendation.ai_explanation && (
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                {recommendation.ai_explanation}
              </p>
            )}
          </div>
        </div>

        {/* 7. Provenance Disclosures & Statutory Disclaimer */}
        <div className="pt-4 border-t border-[var(--color-border)] space-y-4 text-xs text-[var(--color-text-muted)]">
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[var(--color-text)] text-[11px]">
              {isHi ? 'डेटा साक्ष्य एवं स्रोत विवरण (Data Provenance Legend)' : 'Data Provenance Legend'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 bg-[var(--color-positive-bg)] rounded-lg border border-[var(--color-positive-border)]">
                <ProvenanceBadge type="calculated" />
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{isHi ? 'शुद्ध वित्तीय सूत्रों द्वारा गणना' : 'Computed by deterministic formula'}</p>
              </div>
              <div className="p-2 bg-[var(--color-rule-bg)] rounded-lg border border-[var(--color-rule-border)]">
                <ProvenanceBadge type="official_rule" />
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{isHi ? 'सरकारी योजना व बैंकिंग नियम' : 'Official RBI / Scheme parameters'}</p>
              </div>
              <div className="p-2 bg-[var(--color-caution-bg)] rounded-lg border border-[var(--color-caution-border)]">
                <ProvenanceBadge type="prototype" />
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{isHi ? 'सांकेतिक स्थानीय ग्रामीण बेंचमार्क' : 'Curated local baseline data'}</p>
              </div>
              <div className="p-2 bg-[var(--color-advisory-bg)] rounded-lg border border-[var(--color-advisory-border)]">
                <ProvenanceBadge type="ai_advisory" />
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{isHi ? 'एआई रणनीतिक सारांश' : 'Contextual AI synthesis'}</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[var(--color-text-muted)] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-[var(--color-text-muted)]">
              <span className="font-bold text-[var(--color-text)]">{isHi ? 'वैधानिक अस्वीकरण:' : 'Statutory Disclaimer:'}</span>{' '}
              {isHi
                ? 'GramDisha AI ग्रामीण उद्यमियों और वित्तीय सलाहकारों के लिए एक निर्णय सहायता मंच है। वित्तीय अनुमान और व्यवहार्यता संकेतक मानक बैंकिंग सूत्रों और सांकेतिक स्थानीय मापदंडों का उपयोग करके तैयार किए जाते हैं। वास्तविक ऋण स्वीकृति, मार्जिन आवश्यकताएं, ब्याज दरें और संवितरण शर्तें ऋण देने वाले बैंक/वित्तीय संस्थान के स्वतंत्र क्रेडिट मूल्यांकन और सत्यापन के अधीन हैं।'
                : 'GramDisha AI is an advisory intelligence decision support platform for rural entrepreneurs and credit officers. Financial projections and viability indicators are computed using standard banking formulas and indicative local parameters. Actual loan sanction, margin requirements, interest rates, and disbursement terms are subject to independent credit appraisal and verification by the lending institution.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
