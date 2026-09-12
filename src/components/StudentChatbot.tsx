import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Sparkles, User, Bot, HelpCircle, ArrowRight 
} from 'lucide-react';
import { StudentProfile, ChatMessage } from '../types';

interface Props {
  student: StudentProfile;
}

const QUICK_QUESTIONS = [
  "How can I improve my academic status?",
  "Analyze my current attendance risk",
  "Is my current study hour target sufficient?",
  "What is my expected percentage prediction?"
];

export const StudentChatbot: React.FC<Props> = ({ student }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${student.name}! 👋 I am your AI Academic Advisor. Ask me anything about your attendance, study habits, performance predictions, or how to elevate your scores!`,
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
      // Map message history for multi-turn capability
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          sender: m.sender,
          text: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registerNumber: student.registerNumber,
          message: textToSend,
          history
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch chatbot response');
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
      console.error("Chatbot response error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I apologize, I'm experiencing a brief connection issue. Please try asking again in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        id="chatbot-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all z-40 flex items-center gap-2 cursor-pointer border border-indigo-500/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
        <span className="text-xs font-bold tracking-wider uppercase pr-1 hidden sm:inline-block">AI Advisor</span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
        </span>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col h-[520px]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600/30 p-2 rounded-xl border border-indigo-500/30">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide">AI Academic Advisor</h3>
                  <p className="text-[10px] text-slate-400">Powered by Gemini AI • Active Session</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-700/50 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    <div className={`p-1.5 rounded-xl h-8 w-8 flex items-center justify-center shrink-0 border ${
                      isBot 
                        ? 'bg-indigo-100 border-indigo-200 text-indigo-600' 
                        : 'bg-emerald-100 border-emerald-200 text-emerald-600'
                    }`}>
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Bubble Content */}
                    <div className="space-y-1">
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                        isBot 
                          ? 'bg-white text-slate-800 border-slate-100 rounded-tl-none' 
                          : 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                      }`}>
                        {/* Preserve newline formatting for rich lists from LLM */}
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                      <p className={`text-[9px] text-slate-400 px-1 ${!isBot && 'text-right'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2.5 max-w-[80%] mr-auto">
                  <div className="p-1.5 rounded-xl h-8 w-8 flex items-center justify-center shrink-0 bg-indigo-100 border border-indigo-200 text-indigo-600">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Pane */}
            {messages.length === 1 && (
              <div className="px-4 py-3 bg-white border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Suggested Queries
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] text-left px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-lg text-slate-600 transition-colors cursor-pointer flex items-center justify-between w-full"
                    >
                      <span>{q}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 hover:text-indigo-600 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about attendance, score prediction..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs transition-colors"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !inputText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl disabled:bg-slate-100 disabled:text-slate-400 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
