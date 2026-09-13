import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Store,
  MapPin,
  TrendingUp,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { submitVendorSurvey } from '../services/firebase';

const BUSINESS_CATEGORIES = [
  { id: 'kirana', en: 'Grocery & Kirana Store', hi: 'किराना / जनरल स्टोर' },
  { id: 'mill', en: 'Flour / Oil / Processing Mill', hi: 'आटा / तेल चक्की एवं प्रसंस्करण' },
  { id: 'dairy_poultry', en: 'Dairy / Livestock / Poultry', hi: 'डेयरी / पशुपालन / पोल्ट्री' },
  { id: 'custom_hiring', en: 'Agri Implements / Tractor Hiring', hi: 'कृषि यंत्र / ट्रैक्टर कस्टम हायरिंग' },
  { id: 'handloom_craft', en: 'Handloom / Handicraft / Tailoring', hi: 'हथकरघा / हस्तशिल्प / सिलाई' },
  { id: 'inputs_hardware', en: 'Fertilizer / Seeds / Hardware', hi: 'खाद-बीज / हार्डवेयर दुकान' },
  { id: 'vegetable_mandi', en: 'Vegetable / Fruit Trader', hi: 'सब्जी / फल विक्रेता' },
  { id: 'repair_workshop', en: 'Automobile / Repair Workshop', hi: 'ऑटोमोबाइल / वेल्डिंग वर्कशॉप' },
  { id: 'other', en: 'Other Micro-Enterprise', hi: 'अन्य सूक्ष्म उद्यम' },
];

const CHALLENGES = [
  { id: 'working_capital', en: 'High Working Capital Shortage', hi: 'कार्यशील पूंजी (कैश) की कमी' },
  { id: 'informal_debt', en: 'High Interest on Moneylender Loans', hi: 'साहूकार के कर्ज पर अधिक ब्याज' },
  { id: 'footfall', en: 'Seasonal / Unstable Customer Demand', hi: 'ग्राहकों की अस्थिर मांग / मौसमी मंदी' },
  { id: 'logistics', en: 'High Transport & Logistics Costs', hi: 'परिवहन व माल ढुलाई की अधिक लागत' },
  { id: 'no_bank_credit', en: 'Lack of Collateral for Bank Loans', hi: 'बैंक ऋण हेतु गारंटी / कागजात का अभाव' },
  { id: 'power_infra', en: 'Power Cuts / Storage Issues', hi: 'बिजली कटौती / कोल्ड स्टोरेज की कमी' },
];

export default function VendorSurveyModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
    phone: '',
    category: 'kirana',
    years_operating: '1-3',
    monthly_sales: '',
    monthly_expenses: '',
    current_credit_source: 'none',
    primary_challenge: 'working_capital',
    village: '',
    district: '',
    state: 'Uttar Pradesh',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.monthly_sales || isNaN(Number(formData.monthly_sales))) {
      setErrorMsg(isHi ? 'कृपया मासिक बिक्री की सही राशि दर्ज करें।' : 'Please enter a valid monthly sales amount.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        monthly_sales: Number(formData.monthly_sales),
        monthly_expenses: Number(formData.monthly_expenses || 0),
        timestamp_client: new Date().toISOString(),
      };

      const result = await submitVendorSurvey(payload);
      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(isHi ? 'डेटा सहेजने में समस्या आई। पुनः प्रयास करें।' : 'Failed to submit survey. Please try again.');
      }
    } catch (err) {
      setErrorMsg(isHi ? 'सर्वर से संपर्क नहीं हो पाया।' : 'Unable to reach database service.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {isHi ? 'स्थानीय व्यापारी ज़मीनी सर्वेक्षण' : 'Local Vendor Ground Intelligence'}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Firebase Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHi
                  ? 'वास्तविक व्यापारिक आंकड़े साझा करें ताकि AI ग्रामीण ऋण मॉडल्स को सटीक बना सके।'
                  : 'Help calibrate rural AI viability benchmarks with real local ground data.'}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-lg font-bold text-slate-900">
                  {isHi ? 'धन्यवाद! आपका डेटा दर्ज हुआ।' : 'Thank You! Vendor Data Saved.'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isHi
                    ? 'आपका इनपुट हमारे क्रेडिट एल्गोरिदम को ग्रामीण व्यवसायों की वास्तविक नकदी स्थिति समझने में मदद करेगा।'
                    : 'Your ground inputs have been securely synced to our research dataset to improve rural cash flow modeling.'}
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 max-w-md text-left flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  {isHi
                    ? 'GramDisha AI इस डेटा का उपयोग केवल सांख्यिकीय बेंचमार्क सुधारने और बैंक क्रेडिट रिपोर्ट सटीकता के लिए करता है।'
                    : 'GramDisha AI anonymizes field metrics to generate realistic credit limits and working capital norms for village clusters.'}
                </span>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="mt-4 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {isHi ? 'समाप्त करें' : 'Close Survey'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Business Profile */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  {isHi ? '1. उद्यम विवरण' : '1. Business Details'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'व्यवसाय का प्रकार *' : 'Enterprise Category *'}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    >
                      {BUSINESS_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {isHi ? c.hi : c.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'कार्य अनुभव (वर्ष)' : 'Years in Business'}
                    </label>
                    <select
                      name="years_operating"
                      value={formData.years_operating}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    >
                      <option value="<1">{isHi ? '1 वर्ष से कम (नया उद्यम)' : 'Less than 1 year (New)'}</option>
                      <option value="1-3">{isHi ? '1 से 3 वर्ष' : '1 - 3 years'}</option>
                      <option value="3-5">{isHi ? '3 से 5 वर्ष' : '3 - 5 years'}</option>
                      <option value="5+">{isHi ? '5 वर्ष से अधिक' : 'More than 5 years'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'दुकान / उद्यम का नाम (वैकल्पिक)' : 'Trade Name (Optional)'}
                    </label>
                    <input
                      type="text"
                      name="business_name"
                      placeholder={isHi ? 'जैसे: किसान सेवा केंद्र' : 'e.g., Sharma Grocery Store'}
                      value={formData.business_name}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'स्वामी का नाम (वैकल्पिक)' : 'Owner Name (Optional)'}
                    </label>
                    <input
                      type="text"
                      name="owner_name"
                      placeholder={isHi ? 'जैसे: रमेश कुमार' : 'e.g., Ramesh Kumar'}
                      value={formData.owner_name}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Real Monthly Financials */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  {isHi ? '2. वास्तविक वित्तीय आंकड़े (मासिक)' : '2. Real Monthly Financials (₹)'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'औसत मासिक बिक्री / आमदनी (₹) *' : 'Avg Monthly Sales / Revenue (₹) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      name="monthly_sales"
                      placeholder="e.g., 65000"
                      value={formData.monthly_sales}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'मासिक खर्च (सामान + किराया + बिजली) (₹)' : 'Monthly Operating Costs (₹)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="monthly_expenses"
                      placeholder="e.g., 42000"
                      value={formData.monthly_expenses}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'वर्तमान ऋण स्रोत' : 'Current Credit Source'}
                    </label>
                    <select
                      name="current_credit_source"
                      value={formData.current_credit_source}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    >
                      <option value="none">{isHi ? 'कोई ऋण नहीं (खुद की पूंजी)' : 'Self Funded / No Debt'}</option>
                      <option value="shg">{isHi ? 'स्वयं सहायता समूह (SHG / MFI)' : 'SHG / Microfinance Group'}</option>
                      <option value="bank">{isHi ? 'बैंक ऋण / KCC' : 'Formal Bank Loan / KCC'}</option>
                      <option value="moneylender">{isHi ? 'स्थानीय साहूकार / व्यापारी' : 'Local Moneylender (Informal)'}</option>
                      <option value="supplier_credit">{isHi ? 'थोक विक्रेता उधारी' : 'Wholesaler / Supplier Credit'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'सबसे बड़ी चुनौती / बाधा' : 'Major Operational Bottleneck'}
                    </label>
                    <select
                      name="primary_challenge"
                      value={formData.primary_challenge}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    >
                      {CHALLENGES.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {isHi ? ch.hi : ch.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Location Details */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {isHi ? '3. स्थान विवरण' : '3. Location Details'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'गाँव / ब्लॉक' : 'Village / Block'}
                    </label>
                    <input
                      type="text"
                      name="village"
                      placeholder={isHi ? 'जैसे: सिसवां' : 'e.g. Siswa'}
                      value={formData.village}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'जिला' : 'District'}
                    </label>
                    <input
                      type="text"
                      name="district"
                      placeholder={isHi ? 'जैसे: वाराणसी' : 'e.g. Varanasi'}
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isHi ? 'राज्य' : 'State'}
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    >
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isHi ? 'डेटा सुरक्षित रूप से क्लाउड पर सहेजा जाता है' : 'Stored securely in Firebase Cloud'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {isHi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{isHi ? 'सहेज रहे हैं...' : 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{isHi ? 'सर्वेक्षण डेटा भेजें' : 'Submit Ground Data'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}