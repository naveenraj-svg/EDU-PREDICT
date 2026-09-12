import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Sparkles, User, Bot, HelpCircle, 
  ArrowRight, RefreshCw, ShieldAlert, BarChart2, GraduationCap
} from 'lucide-react';
import { ChatMessage } from '../types';

const ADMIN_QUICK_QUESTIONS = [
  "Identify all students currently at high academic risk and explain why",
  "How can we raise our projected cohort pass rate to above 90%?",
  "Recommend remedial interventions for students with low attendance",
  "Suggest practical lab and assignment adjustments for lagging students"
];

export const AdminChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'admin-welcome',
      sender: 'bot',
      text: "### Admin AI Academic Advisor \n\nHello Administrator & Faculty! 👋 I am your **Institutional AI Advisor**.\n\nI continuously monitor student attendance, marks, study habits, and predictive risk categories across the institution.\n\n**Ask me anything about:**\n- At-risk student diagnostics & remediation plans\n- Strategic actions to elevate cohort pass rates\n- Attendance intervention workflows\n\n*Select a quick query below or type your question!*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.id !== 'admin-welcome')
        .map(m => ({
          sender: m.sender,
          text: m.text
        }));

      const res = await fetch('/api/faculty/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch advisor response');
      }

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "**Connection Timeout**\n\nUnable to connect with the Advisor model. Please verify your connection and retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'admin-welcome',
        sender: 'bot',
        text: "### Admin AI Academic Advisor \n\nHello Administrator & Faculty! 👋 I am your **Institutional AI Advisor**.\n\nI continuously monitor student attendance, marks, study habits, and predictive risk categories across the institution.\n\n**Ask me anything about:**\n- At-risk student diagnostics & remediation plans\n- Strategic actions to elevate cohort pass rates\n- Attendance intervention workflows\n\n*Select a quick query below or type your question!*",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div id="admin-floating-ai-advisor" className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 text-white rounded-2xl shadow-xl hover:shadow-indigo-500/25 border border-indigo-500/30 transition-all cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-2 ring-slate-950 animate-ping" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-2 ring-slate-950" />
        </div>
        <div className="text-left">
          <span className="block text-[9px] font-black uppercase tracking-widest text-indigo-300">Admin Hub</span>
          <span className="font-black text-sm tracking-tight">AI Academic Advisor</span>
        </div>
      </motion.button>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-96 sm:w-[440px] h-[590px] bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden relative"
          >
            {/* Top neon glow line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent z-10" />

            {/* Header */}
            <div className="bg-slate-950/80 text-white p-4.5 px-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-white">Admin AI Advisor</h3>
                    <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Cohort Intelligence & Remediation Engine</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleClearHistory}
                  title="Clear Conversation"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  title="Close Advisor"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isBot 
                        ? 'bg-slate-900 border border-indigo-500/30 text-indigo-400' 
                        : 'bg-indigo-600 text-white shadow-indigo-600/30'
                    }`}>
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="max-w-[82%] space-y-1">
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isBot 
                          ? 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-sm' 
                          : 'bg-indigo-600 text-white shadow-sm'
                      }`}>
                        {msg.text.split('\n').map((line, i) => {
                          if (line.startsWith('###')) {
                            return <h4 key={i} className="font-bold text-sm text-white mt-2 mb-1">{line.replace('###', '').trim()}</h4>;
                          }
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <h5 key={i} className="font-bold text-slate-100 mt-1.5 mb-0.5">{line.replace(/\*\*/g, '').trim()}</h5>;
                          }
                          if (line.startsWith('* ') || line.startsWith('- ')) {
                            return (
                              <div key={i} className="flex gap-1.5 items-start ml-1 my-0.5">
                                <span className={isBot ? "text-indigo-400 font-bold" : "text-indigo-200"}>•</span>
                                <span>{line.substring(2)}</span>
                              </div>
                            );
                          }
                          if (line.match(/^\d+\./)) {
                            return (
                              <div key={i} className="flex gap-1.5 items-start ml-1 my-0.5">
                                <span className="font-bold text-indigo-400">{line.match(/^\d+\./)?.[0]}</span>
                                <span>{line.replace(/^\d+\.\s*/, '')}</span>
                              </div>
                            );
                          }
                          return <p key={i} className={line.trim() === '' ? 'h-1.5' : 'my-0.5'}>{line}</p>;
                        })}
                      </div>
                      <span className={`text-[9px] text-slate-500 block px-1 ${isBot ? 'text-left' : 'text-right'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200" />
                    <span className="text-[11px] ml-1">Analyzing cohort data...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Consultation Chips */}
            <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 overflow-x-auto whitespace-nowrap flex gap-1.5">
              {ADMIN_QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isTyping}
                  className="text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 hover:border-indigo-500/40 hover:text-white text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 shadow-2xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span className="truncate max-w-[200px]">{q}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3 bg-slate-950/90 border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about students, risk levels, or pass rates..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-slate-800 cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
