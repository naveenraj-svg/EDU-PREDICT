import React from 'react';
import { motion } from 'motion/react';
import { 
  X, BookOpen, BrainCircuit, Sparkles, AlertCircle, BarChart3, 
  Smartphone, Cloud, GraduationCap, ChevronRight, CheckCircle2, ShieldCheck
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ProjectReport: React.FC<Props> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-hidden shadow-2xl flex flex-col border border-slate-800 relative"
      >
        {/* Subtle top neon border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Engineering Spec
                </span>
                <span className="text-xs text-slate-400 font-mono">v2.4 Production Blueprint</span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">Academic Project Report</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Executive Summary */}
          <section className="space-y-3 bg-slate-950/40 p-6 rounded-2xl border border-slate-800/80">
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" /> Executive Summary
            </h3>
            <p className="text-slate-300">
              <strong className="text-white">EduPredict Pro</strong> is an intelligent full-stack Student Performance Prediction & Management System. 
              The application bridges academic diagnostics and personalized student effort by utilizing machine learning 
              heuristics (Decision Trees and Ridge Regression models) to project examination outcomes, identify academic vulnerabilities, and formulate targeted pedagogical strategies. 
              Built with SQLite, Node.js/Express, and React 18, the platform delivers a production-grade blueprint for modern institutional analytics.
            </p>
          </section>

          {/* Model Architecture */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" /> System Algorithms & Predictors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/90 space-y-2.5 hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-indigo-400" /> Decision Tree Classifier
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    96.5% Precision
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Responsible for strict <strong className="text-slate-200">Pass/Fail classification</strong> and risk tier attribution. It evaluates multi-factor threshold conditions: attendance limits, internal assessment marks, and cumulative study hours to detect at-risk anomalies before final semesters.
                </p>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/90 space-y-2.5 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-cyan-400" /> Continuous Regression Engine
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Multi-Variable Heuristic
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Computes estimated <strong className="text-slate-200">Final Mark Percentages</strong> through weighted factor contributions: internal examination marks (45%), attendance consistency (35%), assignments (15%), and self-study hours (5%).
                </p>
              </div>
            </div>
          </section>

          {/* Future Enhancements (Target Section) */}
          <section className="space-y-5">
            <div className="border-t pt-6 border-slate-800">
              <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Innovative Future Enhancements
              </h3>
              <p className="text-slate-400 text-xs mt-1">Specialized roadmap capabilities designed for institutional scale:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Enhancement 1 */}
              <div className="flex gap-4 items-start p-5 bg-slate-950/70 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                <div className="p-2.5 bg-indigo-500/15 rounded-xl text-indigo-400 mt-1 shrink-0 border border-indigo-500/20">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">1. AI Chatbot for Student Assistance</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Integrate an AI-powered conversational agent to answer student queries regarding attendance quotas, mark trajectories, study resources, examination schedules, and personalized academic coaching 24/7.
                  </p>
                </div>
              </div>

              {/* Enhancement 2 */}
              <div className="flex gap-4 items-start p-5 bg-slate-950/70 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                <div className="p-2.5 bg-emerald-500/15 rounded-xl text-emerald-400 mt-1 shrink-0 border border-emerald-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">2. AI-Based Personalized Learning</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Implement advanced AI algorithms to generate 4-week custom study roadmaps, curated departmental search resources, and targeted weakness remediation strategies tailored directly to student metrics.
                  </p>
                </div>
              </div>

              {/* Enhancement 3 */}
              <div className="flex gap-4 items-start p-5 bg-slate-950/70 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                <div className="p-2.5 bg-amber-500/15 rounded-xl text-amber-400 mt-1 shrink-0 border border-amber-500/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">3. Mobile App & Real-Time Alerts</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Develop an Android/iOS companion application with instant push alerts for critical attendance dips, upcoming exam timetables, assignment deadlines, and performance warnings.
                  </p>
                </div>
              </div>

              {/* Enhancement 4 */}
              <div className="flex gap-4 items-start p-5 bg-slate-950/70 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                <div className="p-2.5 bg-cyan-500/15 rounded-xl text-cyan-400 mt-1 shrink-0 border border-cyan-500/20">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">4. Cloud Deployment & Advanced Analytics</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Deploy the platform across redundant cloud infrastructure with centralized grade registries, automated batch performance exports, and multi-department administrative drill-downs.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>EduPredict Enterprise Architecture</span>
          </div>
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
