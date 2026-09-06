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
        ? 'नमस्ते! मैं GramDisha AI सहायक हूँ। इस विश्लेषण या योजना के बारे में मुझसे कोई भी प्रश्न पूछें।'
        : 'Hello! I am your GramDisha AI assistant. Ask me anything about this business analysis or loan scheme.',
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
        'How can I lower my monthly EMI?',
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
          className="flex items-center gap-2 bg-[var(--color-positive)] hover:bg-[#1A4931] text-white px-4 py-2.5 rounded-full shadow-md transition-colors border border-[var(--color-positive-border)] min-h-[44px] focus-visible:outline-2"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
          <span className="font-semibold text-xs sm:text-sm">
            {isHi ? 'GramDisha AI सहायक' : 'Ask AI Advisor'}
          </span>
        </button>
      )}

      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] h-[490px] max-h-[80vh] bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[var(--color-positive)] text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Bot className="w-5 h-5 text-amber-200 shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold text-sm tracking-wide truncate">
                  {isHi ? 'GramDisha AI सहायक' : 'GramDisha AI Assistant'}
                </h3>
                <p className="text-xs text-emerald-100 truncate">
                  {analysis ? `${analysis.business_name} • ₹${(analysis.financial?.margin_capital || 0).toLocaleString('en-IN')}` : 'Business Advisor'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-md text-emerald-100 transition-colors"
                title="Close"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Badge */}
          <div className="bg-[var(--color-surface-subtle)] px-3 py-1.5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0 text-[11px] text-[var(--color-text-muted)]">
            <span>{isHi ? 'संदर्भ-सचेत सलाह' : 'Context-aware advisory'}</span>
            <ProvenanceBadge type="ai_advisory" />
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[var(--color-bg)] text-xs sm:text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[var(--color-positive-bg)] text-[var(--color-positive)] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-xl px-3 py-2.5 leading-relaxed shadow-2xs ${
                    m.role === 'user'
                      ? 'bg-[var(--color-positive)] text-white rounded-br-none'
                      : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-6 h-6 rounded-full bg-[var(--color-positive-bg)] text-[var(--color-positive)] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-xl px-3 py-2 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive)] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive)] animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive)] animate-pulse delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="p-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex gap-1.5 overflow-x-auto text-[11px]">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="whitespace-nowrap bg-[var(--color-surface-subtle)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] border border-[var(--color-border)] px-2.5 py-1 rounded-md transition-colors font-medium shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-2.5 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isHi ? 'प्रश्न लिखें...' : 'Type your question...'}
              disabled={loading}
              className="flex-1 border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs sm:text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-positive)] bg-[var(--color-surface)]"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-[var(--color-positive)] hover:bg-[#1A4931] disabled:opacity-40 text-white p-2.5 rounded-lg transition-colors shrink-0"
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
