import React, { useContext, useState } from 'react';
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
  Store,
  Compass,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import ProvenanceBadge from '../components/ProvenanceBadge';
import VoiceButton from '../components/VoiceButton';

export default function Market() {
  const { analysis } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';

  const [simRadius, setSimRadius] = useState(5);

  if (!analysis) {
    return (
      <div className="app-container my-16 max-w-md p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center text-lg font-bold">
          GD
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          {isHi ? 'कोई सक्रिय बाजार विश्लेषण नहीं मिला' : 'No Active Market Assessment Found'}
        </h3>
        <button
          onClick={() => navigate('/assess')}
          className="gd-btn-primary mx-auto font-bold"
        >
          {isHi ? 'नया मूल्यांकन शुरू करें' : 'Start Assessment'}
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
  const reach = business_analysis?.market_reach || { primary_km: 5, secondary_km: 15 };
  const customerSegments = isHi
    ? business_analysis?.customer_segments_hi || business_analysis?.customer_segments || []
    : business_analysis?.customer_segments || [];

  const insightText = typeof opportunity_insights === 'string'
    ? opportunity_insights
    : (isHi ? opportunity_insights?.insights_hi : null) || opportunity_insights?.insights || opportunity_insights?.insight || null;

  const estPopulation = Math.round(Math.PI * Math.pow(simRadius, 2) * 140);
  const estDailyHouseholds = Math.round(estPopulation / 5.2);

  const voiceMarketText = isHi
    ? `बाजार व ग्राहक विश्लेषण: प्राथमिक सेवा दायरा ${reach.primary_km} किलोमीटर है। इस क्षेत्र में प्रतियोगिता का स्तर संतुलित है और अवसर स्कोर ${opportunity?.score || opportunity?.opportunity_score || 80} है।`
    : `Market and demand analysis: Primary village catchment radius is ${reach.primary_km} kilometers. Regional competition level is moderate with viability opportunity index of ${opportunity?.score || opportunity?.opportunity_score || 80}/100.`;

  return (
    <div className="app-container py-8 sm:py-10 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
            {isHi ? 'अनुसूची II: बाजार सर्वेक्षण' : 'Annexure II: Market Demographics'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHi ? 'सेवा दायरा, ग्राहक वर्ग एवं बाजार मांग' : 'Catchment Radius, Demographics & Pricing'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isHi
              ? `स्थानीय मांग घनत्व, 5-15 किमी सेवा परिधि एवं प्रतिस्पर्धी बेंचमार्क • ${displayName}`
              : `Local demand density, 5–15 km service radius and pricing benchmarks • ${displayName}`}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <VoiceButton
            text={voiceMarketText}
            language={i18n.language}
            label={isHi ? 'बाजार विवरण सुनें' : 'Listen Summary'}
          />
          <ProvenanceBadge type="prototype" />
        </div>
      </div>

      {/* Catchment Radius & Competitor Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHi ? 'प्राथमिक सेवा परिधि' : 'Primary Footfall Radius'}
            </span>
            <ProvenanceBadge type="calculated" />
          </div>
          <div className="text-3xl font-bold text-emerald-700 tabular-nums">
            {reach.primary_km} {isHi ? 'किमी' : 'KM'}
          </div>
          <p className="text-xs text-slate-500">
            {isHi ? 'दैनिक ग्राहक व मुख्य गांव' : 'Core immediate village footfall'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHi ? 'विस्तारित सेवा परिधि' : 'Secondary Catchment'}
            </span>
            <ProvenanceBadge type="calculated" />
          </div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {reach.secondary_km} {isHi ? 'किमी' : 'KM'}
          </div>
          <p className="text-xs text-slate-500">
            {isHi ? 'साप्ताहिक हाट व नजदीकी मजरे' : 'Weekly haat-bazaar & satellite hamlets'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHi ? 'प्रतिस्पर्धा स्तर' : 'Competitor Density'}
            </span>
            <ProvenanceBadge type="prototype" />
          </div>
          <div className="text-3xl font-bold text-amber-700 tabular-nums">
            {competition?.competition_level || (isHi ? 'संतुलित' : 'Moderate')}
          </div>
          <p className="text-xs text-slate-500">
            {isHi ? 'स्थानीय क्षेत्र में स्वस्थ बाजार संतुलन' : 'Healthy supply-demand equilibrium'}
          </p>
        </div>
      </div>

      {/* Interactive Catchment Population Slider */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHi ? 'इंटरैक्टिव सेवा परिधि सिम्युलेटर' : 'Interactive Catchment Explorer'}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isHi ? 'दूरी बढ़ाने पर संभावित ग्राहक आधार की गणना' : 'Simulate Customer Base by Radius'}
            </h3>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            {simRadius} KM Catchment
          </span>
        </div>

        <div className="space-y-4 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-baseline justify-between">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {isHi ? 'सेवा परिधि (किलोमीटर):' : 'Operational Radius (KM):'}
            </label>
            <span className="font-mono text-xl font-bold text-emerald-700">
              {simRadius} KM
            </span>
          </div>

          <input
            type="range"
            min={2}
            max={25}
            step={1}
            value={simRadius}
            onChange={(e) => setSimRadius(Number(e.target.value))}
            className="interactive-slider"
            aria-label="Catchment radius slider"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                {isHi ? 'अनुमानित आबादी' : 'Estimated Population'}
              </span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                ~{estPopulation.toLocaleString('en-IN')} {isHi ? 'नागरिक' : 'People'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                {isHi ? 'संभावित ग्रामीण परिवार' : 'Target Household Base'}
              </span>
              <span className="text-xl font-bold text-emerald-700 tabular-nums">
                ~{estDailyHouseholds.toLocaleString('en-IN')} {isHi ? 'परिवार' : 'Households'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Segmentation & Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              {isHi ? 'लक्षित ग्राहक वर्ग' : 'Target Customer Profiles'}
            </h3>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
            {Array.isArray(customerSegments) && customerSegments.length > 0 ? (
              customerSegments.map((seg, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{seg}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-500 p-3">
                {isHi ? 'स्थानीय ग्रामीण परिवार, लघु किसान एवं नजदीकी कस्बाई उपभोक्ता।' : 'Local rural households, marginal farming families, and regional consumers.'}
              </li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isHi ? 'क्षेत्रीय बाजार परामर्श' : 'Market Advisory Insights'}
              </h3>
              <ProvenanceBadge type="ai_advisory" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {insightText || (isHi
                ? 'इस क्षेत्र में उत्पाद की मांग निरंतर बनी रहती है। गुणवत्ता और समयबद्ध सेवा बनाए रखने पर स्थानीय स्तर पर शीघ्र ग्राहक विश्वास स्थापित किया जा सकता है।'
                : 'Demand for this enterprise category remains consistent across seasonal cycles. Maintaining standard unit pricing and reliable delivery will secure steady baseline cash flow.')}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{isHi ? 'नियमित ग्राहकों हेतु खाता/क्रेडिट नीति को 15 दिवस तक सीमित रखें।' : 'Restrict trade receivables and informal credit cycles to 15 days.'}</span>
          </div>
        </div>
      </div>

      {/* Benchmark Pricing Table */}
      {pricing?.products && pricing.products.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isHi ? 'मानक इकाई मूल्य व उत्पाद बेंचमार्क' : 'Benchmark Unit Pricing & Product Schedule'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? 'स्थानीय हाट-बाजार के अनुसार अनुशंसित विक्रय मूल्य' : 'Indicative prevailing market rates for regional trade'}
              </p>
            </div>
            <ProvenanceBadge type="prototype" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">{isHi ? 'उत्पाद / सेवा' : 'Product / Service Item'}</th>
                  <th className="p-3 text-right">{isHi ? 'इकाई दर (₹)' : 'Unit Price (₹)'}</th>
                  <th className="p-3 text-right">{isHi ? 'मानक इकाई' : 'Unit Basis'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {pricing.products.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold">{isHi ? p.name_hi || p.name : p.name}</td>
                    <td className="p-3 text-right font-mono font-bold">₹{p.price}</td>
                    <td className="p-3 text-right text-slate-500">{isHi ? p.unit_hi || p.unit : p.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
