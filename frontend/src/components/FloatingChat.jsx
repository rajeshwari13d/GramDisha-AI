import React, { useState, useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, X, Send, Sparkles, Bot, User, Minimize2 } from 'lucide-react';
import { AnalysisContext } from '../App';
import { chatWithAssistant } from '../services/api';
import ProvenanceBadge from './ProvenanceBadge';

export default function FloatingChat() {
  const { analysis } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: isHi
        ? 'नमस्ते! मैं GramDisha AI ऋण सलाहकार सहायक हूँ। इस विश्लेषण या योजना के बारे में कोई भी प्रश्न पूछें।'
        : 'Welcome! I am your GramDisha Credit Advisory Assistant. Ask any question regarding this viability appraisal or loan scheme.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = isHi
    ? [
        'क्या इस योजना में सब्सिडी उपलब्ध है?',
        'मासिक ईएमआई कम करने का क्या तरीका है?',
        'इस व्यवसाय में प्रमुख जोखिम क्या हैं?',
      ]
    : [
        'Is subsidy available under this scheme?',
        'How can I optimize my monthly EMI?',
        'What are the primary operational risks?',
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userMsg = null) => {
    const text = userMsg || input;
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    if (!userMsg) setInput('');
    setLoading(true);

    try {
      const res = await chatWithAssistant({
        message: text,
        analysis_id: analysis?.analysis_id,
        language: i18n.language === 'hi' ? 'hi' : 'en',
        context: analysis ? {
          business_name: analysis.business_name,
          capital: analysis.financial?.margin_capital,
          project_cost: analysis.financial?.project_cost,
          loan_amount: analysis.financial?.loan_amount,
          scheme: analysis.financial?.scheme,
          emi: analysis.financial?.estimated_emi,
          viability_score: analysis.viability?.viability_score,
        } : null,
      });

      if (res.data?.success && (res.data?.reply || res.data?.response)) {
        const replyText = res.data.reply || res.data.response;
        setMessages([...newMessages, { role: 'assistant', text: replyText }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            text: isHi
              ? 'माफ़ कीजिए, उत्तर प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।'
              : 'Could not fetch a response. Please try again.',
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: isHi
            ? 'सर्वर से जुड़ने में त्रुटि हुई।'
            : 'Connection error while contacting AI assistant.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end print:hidden">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all border border-emerald-600 min-h-[44px] cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="font-bold text-xs sm:text-sm">
            {isHi ? 'GramDisha AI सहायक' : 'Ask Credit Advisor'}
          </span>
        </button>
      )}

      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[390px] md:w-[420px] h-[520px] max-h-[82vh] doc-card-elevated shadow-2xl flex flex-col overflow-hidden bg-white border border-slate-200">
          {/* Header */}
          <div className="bg-emerald-800 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Bot className="w-5 h-5 text-amber-300 shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold text-sm tracking-wide truncate">
                  {isHi ? 'GramDisha AI सहायक' : 'GramDisha Credit Advisor'}
                </h3>
                <p className="text-[11px] text-emerald-100 truncate">
                  {analysis ? `${analysis.business_name} • ₹${(analysis.financial?.margin_capital || 0).toLocaleString('en-IN')}` : 'Rural Enterprise Decision Support'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                title="Close"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Badge */}
          <div className="bg-slate-50 px-3.5 py-1.5 border-b border-slate-200 flex items-center justify-between shrink-0 text-[11px] text-slate-500">
            <span className="font-semibold">{isHi ? 'क्रेडिट संदर्भ-सचेत सलाह' : 'Context-aware appraisal advisory'}</span>
            <ProvenanceBadge type="ai_advisory" />
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[84%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 font-medium rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 text-slate-500 rounded-xl px-3 py-2 text-xs flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="p-2 border-t border-slate-200 bg-white flex gap-1.5 overflow-x-auto text-[11px]">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="whitespace-nowrap bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors font-medium shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isHi ? 'प्रश्न लिखें...' : 'Type your query...'}
              disabled={loading}
              className="flex-1 doc-input py-2 text-xs bg-slate-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
