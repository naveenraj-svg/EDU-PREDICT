import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, RefreshCw, GraduationCap, Users, ShieldAlert,
  ArrowRight, BookOpen, User, Bot, BarChart2, Star
} from 'lucide-react';
import { ChatMessage } from '../types';

const QUICK_PROMPTS = [
  { label: "⚠️ High-Risk Diagnostic", text: "Explain who is currently at high academic risk, what their main performance bottlenecks are, and how to help them." },
  { label: "📈 Boost Class Pass Rate", text: "Based on current cohort statistics, provide a step-by-step strategy to boost our projected pass rate." },
  { label: "🕒 Attendance Deficiencies", text: "Detail the attendance issues flagged in the system and propose a remediation policy." },
  { label: "📝 Lesson & Lab Adjustments", text: "Suggest targeted practical tutorials or quiz designs for students lagging in assignment scores." }
];

export const FacultyAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'faculty-welcome',
      sender: 'bot',
      text: "### EduPredict Senior Advisor System \n\nHello Professor! 👨‍🏫 I am your **Senior Academic AI Advisor**.\n\nI have fully synchronized with our student databases and calculated current risk categories, average attendance, and mark thresholds. \n\n**What would you like to accomplish today?**\n* Run a comprehensive diagnostic on at-risk students\n* Optimize cohort pass rates before the finals\n* Develop custom study interventions\n\n*Click one of the Quick Consultation prompts below or write your specific question!*",
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
    scrollToBottom();
  }, [messages, isTyping]);

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
        .filter(m => m.id !== 'faculty-welcome')
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
        throw new Error('Failed to fetch advisor advice');
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
      console.error("Faculty chat error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "**Network Timeout Error**\n\nI was unable to retrieve a secure recommendation output. Please make sure the server database is active and retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'faculty-welcome',
        sender: 'bot',
        text: "### EduPredict Senior Advisor System \n\nHello Professor! 👨‍🏫 I am your **Senior Academic AI Advisor**.\n\nI have fully synchronized with our student databases and calculated current risk categories, average attendance, and mark thresholds. \n\n**What would you like to accomplish today?**\n* Run a comprehensive diagnostic on at-risk students\n* Optimize cohort pass rates before the finals\n* Develop custom study interventions\n\n*Click one of the Quick Consultation prompts below or write your specific question!*",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div id="faculty-ai-advisor" className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row h-[600px] hover:border-slate-700/80 transition-all relative">
      {/* Subtle neon top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent z-10" />

      {/* Advisor Sidebar Info */}
      <div className="w-full md:w-80 bg-slate-950/80 p-6 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-black tracking-widest bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full uppercase border border-indigo-500/30">
                Institutional AI
              </span>
              <h3 className="text-base font-black mt-1">Admin Advisor Hub</h3>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Leverages predictive algorithms and cohort metrics to formulate macro pedagogical interventions, identify bottlenecks, and calibrate syllabus coverage.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Focus Areas</span>
              <div className="flex flex-col gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Early Intervention Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Pass Rate Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Custom Tutorial Designs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 mt-6 md:mt-0">
          <button 
            onClick={handleResetChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Advisory Session
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-950/40 h-full">
        {/* Chat Message Box */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={msg.id} className={`flex gap-3.5 items-start ${isBot ? '' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 ${
                  isBot 
                    ? 'bg-slate-900 border border-indigo-500/30 text-indigo-400' 
                    : 'bg-indigo-600 border border-indigo-500 text-white'
                }`}>
                  {isBot ? <GraduationCap className="w-5 h-5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[82%] space-y-1`}>
                  <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    isBot 
                      ? 'bg-slate-900/90 text-slate-200 border border-slate-800' 
                      : 'bg-indigo-600 text-white shadow-indigo-600/20'
                  }`}>
                    {msg.text.split('\n').map((line, i) => {
                      if (line.startsWith('###')) {
                        return <h4 key={i} className="font-bold text-base text-white mt-2 mb-2">{line.replace('###', '').trim()}</h4>;
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <h5 key={i} className="font-bold text-slate-100 mt-2 mb-1">{line.replace(/\*\*/g, '').trim()}</h5>;
                      }
                      if (line.startsWith('* ') || line.startsWith('- ')) {
                        return (
                          <div key={i} className="flex gap-2 items-start ml-2 my-1">
                            <span className={isBot ? "text-indigo-400 font-bold" : "text-indigo-200"}>•</span>
                            <span>{line.substring(2)}</span>
                          </div>
                        );
                      }
                      if (line.match(/^\d+\./)) {
                        return (
                          <div key={i} className="flex gap-2 items-start ml-2 my-1">
                            <span className="font-bold text-indigo-400">{line.match(/^\d+\./)?.[0]}</span>
                            <span>{line.replace(/^\d+\.\s*/, '')}</span>
                          </div>
                        );
                      }
                      return <p key={i} className={line.trim() === '' ? 'h-2' : 'my-1'}>{line}</p>;
                    })}
                  </div>
                  <span className={`text-[10px] text-slate-500 block px-1 ${isBot ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3.5 items-start">
              <div className="w-8.5 h-8.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 shadow-sm text-xs flex items-center gap-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
                </div>
                <span>Advisor generating pedagogical analysis from student database...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Consultation Prompts */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/60">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
            Quick Consultations
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt.text)}
                disabled={isTyping}
                className="py-1.5 px-3 rounded-xl border border-slate-800 text-slate-300 text-xs font-semibold bg-slate-900 hover:bg-slate-800 hover:border-indigo-500/40 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-4 bg-slate-950/90 border-t border-slate-800 flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder="Ask the Senior Advisor anything about this student cohort..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-slate-800 cursor-pointer shadow-md shadow-indigo-600/30"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
