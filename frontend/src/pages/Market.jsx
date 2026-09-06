import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  Users,
  Target,
  MapPin,
  Tag,
  Sparkles,
  Info,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import ProvenanceBadge from '../components/ProvenanceBadge';
import VoiceButton from '../components/VoiceButton';

export default function Market() {
  const { analysis } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';

  if (!analysis) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 my-16 max-w-md p-8 gd-card text-center space-y-4">
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          {isHi ? 'कोई सक्रिय विश्लेषण नहीं मिला' : 'No Active Analysis'}
        </h3>
        <button
          onClick={() => navigate('/assess')}
          className="gd-btn-primary mx-auto"
        >
          {isHi ? 'नया विश्लेषण शुरू करें' : 'Start Assessment'}
        </button>
      </div>
    );
  }

  const {
    business_name,
    business_name_hi,
    business_analysis,
    competition,
    opportunity,
    opportunity_insights,
    pricing,
  } = analysis;

  const displayName = isHi ? business_name_hi || business_name : business_name;
  const reach = business_analysis.market_reach || { primary_km: 5, secondary_km: 15 };
  const customerSegments = isHi
    ? business_analysis.customer_segments_hi || business_analysis.customer_segments
    : business_analysis.customer_segments;

  const insightText = typeof opportunity_insights === 'string'
    ? opportunity_insights
    : (isHi ? opportunity_insights?.insights_hi : null) || opportunity_insights?.insights || opportunity_insights?.insight || null;

  const voiceMarketText = isHi
    ? `बाजार व ग्राहक विश्लेषण: प्राथमिक सेवा दायरा ${reach.primary_km} किलोमीटर है। इस क्षेत्र में प्रतियोगिता का स्तर संतुलित है और अवसर स्कोर ${opportunity?.score || 80} है।`
    : `Market analysis: Primary catchment radius is ${reach.primary_km} km. Opportunity score is ${opportunity?.score || 80}.`;

  return (
    <div className="app-container py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)] tracking-tight">
            {isHi ? '🏪 बाजार मांग, ग्राहक व प्रतियोगिता' : '🏪 Market Demand & Competition'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1 font-medium">
            {isHi ? 'स्थानीय ग्राहक क्षेत्र, मूल्य निर्धारण और प्रतियोगिता का विश्लेषण' : 'Local footfall catchment radius and benchmark pricing'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <VoiceButton
            text={voiceMarketText}
            language={i18n.language}
            label={isHi ? 'बाजार विवरण सुनें 🔊' : 'Listen 🔊'}
          />
          <ProvenanceBadge type="calculated" />
        </div>
      </div>

      {/* Grid: Reach & Customer Segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Market Reach Radius */}
        <div className="gd-card p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
              <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
                <MapPin className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
                <span>{isHi ? 'भौगोलिक बाजार पहुंच त्रिज्या' : 'Market Reach Radius'}</span>
              </div>
              <ProvenanceBadge type="prototype" />
            </div>

            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              {isHi
                ? 'स्थानीय ग्रामीण जनसांख्यिकी और आवागमन मॉडल के आधार पर अनुमानित बाजार पहुंच।'
                : 'Estimated customer catchment radius based on rural mobility and enterprise category.'}
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {t('market.primary_market')}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[var(--color-text)] tabular-nums">
                  {reach.primary_km || 5} <span className="text-xs font-bold text-[var(--color-text-muted)]">km</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  {isHi ? 'पैदल व स्थानीय ग्राहक' : 'Direct walk-in footfall'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {t('market.secondary_market')}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[var(--color-text)] tabular-nums">
                  {reach.secondary_km || 15} <span className="text-xs font-bold text-[var(--color-text-muted)]">km</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  {isHi ? 'साप्ताहिक हाट व समीपवर्ती गांव' : 'Weekly haats & feeder villages'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="gd-card p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
              <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
                <Users className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
                <span>{t('market.customer_segments')}</span>
              </div>
              <ProvenanceBadge type="prototype" />
            </div>

            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              {isHi
                ? 'प्रमुख लक्षित उपभोक्ता समूह जो इस उद्यम की निरंतर मांग को संचालित करते हैं:'
                : 'Primary target audience segments that drive recurring demand for this enterprise:'}
            </p>

            <div className="space-y-2 pt-1">
              {customerSegments && customerSegments.length > 0 ? (
                customerSegments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-xs sm:text-sm font-semibold text-[var(--color-text)] flex items-center gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive)] shrink-0" />
                    <span className="leading-snug">{seg}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--color-text-subtle)]">No segment data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Demand & Competition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Demand Score Card */}
        <div className="gd-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
            <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
              <span>{t('market.demand_score')}</span>
            </div>
            <ProvenanceBadge type="prototype" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text)] tabular-nums">
              {business_analysis.demand_score}
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-subtle)]">/ 100</span>
          </div>

          <div className="w-full bg-[var(--color-surface-subtle)] rounded-full h-2.5 overflow-hidden border border-[var(--color-border)]">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${business_analysis.demand_score}%`,
                backgroundColor: 'var(--color-positive)',
              }}
            />
          </div>

          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            {isHi
              ? 'इस क्षेत्र में उत्पाद/सेवा के प्रति उच्च उपभोग मांग सूचकांक दर्ज किया गया है। दैनिक व आवर्ती मांग स्थिर बनी रहती है।'
              : 'Strong local consumption demand index indicates steady recurring buyer interest within the catchment area.'}
          </p>
        </div>

        {/* Competition Score Card */}
        <div className="gd-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
            <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
              <Target className="w-4 h-4 text-[var(--color-caution)] shrink-0" />
              <span>{isHi ? 'स्थानीय प्रतिस्पर्धा विश्लेषण' : 'Local Competition Analysis'}</span>
            </div>
            <ProvenanceBadge type="prototype" />
          </div>

          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--color-caution-bg)',
                color: 'var(--color-caution)',
                borderColor: 'var(--color-caution-border)',
              }}
            >
              {isHi ? competition.competition_level_hi || competition.competition_level : competition.competition_level}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] tabular-nums font-semibold">
              {isHi ? `स्कोर: ${competition.score}/100` : `Intensity Score: ${competition.score}/100`}
            </span>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            {isHi ? competition.description_hi : competition.description_en}
          </p>
        </div>
      </div>

      {/* AI Opportunity Insights Banner if present */}
      {insightText && (
        <div className="p-4 sm:p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-positive)]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{isHi ? 'रणनीतिक बाजार अंतर्दृष्टि' : 'Strategic Market Insights'}</span>
            </div>
            <ProvenanceBadge type="ai_advisory" />
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed">
            {insightText}
          </p>
        </div>
      )}

      {/* Pricing Benchmarks Table */}
      <div className="gd-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-2.5">
          <div>
            <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
              <Tag className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
              <span>{isHi ? 'स्थानीय मूल्य बेंचमार्क (बाजार दरें)' : 'Local Pricing Benchmarks'}</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {isHi
                ? 'इस व्यवसाय श्रेणी के लिए एकत्रित प्रतिनिधि स्थानीय बाजार मूल्य दरें।'
                : 'Indicative benchmark unit prices surveyed across rural and semi-urban markets.'}
            </p>
          </div>
        </div>

        {pricing && pricing.length > 0 ? (
          <div className="overflow-x-auto border border-[var(--color-border)] rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm min-w-[500px]">
              <thead className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)] text-xs font-bold uppercase text-[var(--color-text-muted)]">
                <tr>
                  <th className="py-2.5 px-4">{isHi ? 'उत्पाद / सेवा' : 'Item / Service'}</th>
                  <th className="py-2.5 px-4">{isHi ? 'इकाई' : 'Unit'}</th>
                  <th className="py-2.5 px-4 text-right">{isHi ? 'न्यूनतम दर (₹)' : 'Min Rate (₹)'}</th>
                  <th className="py-2.5 px-4 text-right">{isHi ? 'औसत दर (₹)' : 'Avg Rate (₹)'}</th>
                  <th className="py-2.5 px-4 text-right">{isHi ? 'अधिकतम दर (₹)' : 'Max Rate (₹)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {pricing.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-[var(--color-text)]">
                      {isHi ? item.item_hi || item.item : item.item}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--color-text-muted)] text-xs">
                      {item.unit}
                    </td>
                    <td className="py-2.5 px-4 text-right text-[var(--color-text-muted)] tabular-nums">
                      ₹{item.min_price}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[var(--color-positive)] tabular-nums">
                      ₹{item.avg_price}
                    </td>
                    <td className="py-2.5 px-4 text-right text-[var(--color-text-muted)] tabular-nums">
                      ₹{item.max_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[var(--color-text-subtle)] py-4 text-center">
            {isHi ? 'इस व्यवसाय हेतु विशिष्ट मूल्य डेटा उपलब्ध नहीं है।' : 'No benchmark pricing data available.'}
          </p>
        )}
      </div>

      {/* Strategic SWOT Assessment (4 Quadrants) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
              {isHi ? 'रणनीतिक SWOT विश्लेषण' : 'Strategic SWOT Analysis'}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {isHi ? 'ताकत, कमजोरी, अवसर और जोखिम का 4-आयामी मूल्यांकन' : '4-quadrant strategic matrix for business viability'}
            </p>
          </div>
          <ProvenanceBadge type="ai_advisory" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Strengths */}
          <div className="gd-card p-4 sm:p-5 space-y-3 border-l-4 border-l-[var(--color-positive)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-positive)] block">
              {isHi ? 'ताकत (Strengths)' : 'Strengths (Internal)'}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--color-text)]">
              {(analysis.swot?.strengths || []).map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive)] mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="gd-card p-4 sm:p-5 space-y-3 border-l-4 border-l-[var(--color-caution)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-caution)] block">
              {isHi ? 'कमजोरियां (Weaknesses)' : 'Weaknesses (Internal)'}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--color-text)]">
              {(analysis.swot?.weaknesses || []).map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-caution)] mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="gd-card p-4 sm:p-5 space-y-3 border-l-4 border-l-[var(--color-advisory)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-advisory)] block">
              {isHi ? 'अवसर (Opportunities)' : 'Opportunities (External)'}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--color-text)]">
              {(analysis.swot?.opportunities || []).map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-advisory)] mt-1.5 shrink-0" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="gd-card p-4 sm:p-5 space-y-3 border-l-4 border-l-[var(--color-negative)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-negative)] block">
              {isHi ? 'जोखिम व चुनौतियां (Threats)' : 'Threats (External)'}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--color-text)]">
              {(analysis.swot?.threats || []).map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-negative)] mt-1.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
