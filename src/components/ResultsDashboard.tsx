import React from 'react';
import { PredictionResult } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell 
} from 'recharts';
import { 
  CheckCircle2, XCircle, AlertCircle, TrendingUp, Award, 
  Zap, ShieldCheck, Activity, Users, BrainCircuit, Lightbulb, Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  result: PredictionResult;
}

export const ResultsDashboard: React.FC<Props> = ({ result }) => {
  const peerData = [
    { name: 'Your Metric', score: result.peerComparison.student },
    { name: 'Class Avg', score: result.peerComparison.average },
  ];

  const riskBadge = {
    'Low Risk': { text: 'text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-500/30', dot: 'bg-emerald-400' },
    'Medium Risk': { text: 'text-amber-300', bg: 'bg-amber-500/20 border-amber-500/30', dot: 'bg-amber-400' },
    'High Risk': { text: 'text-rose-300', bg: 'bg-rose-500/20 border-rose-500/30', dot: 'bg-rose-400' },
  }[result.riskLevel] || { text: 'text-slate-300', bg: 'bg-slate-500/20 border-slate-500/30', dot: 'bg-slate-400' };

  const motivationColor = {
    'Highly Motivated': 'text-emerald-400',
    'Moderately Motivated': 'text-amber-400',
    'Low Motivation': 'text-rose-400',
  }[result.motivationLevel] || 'text-slate-300';

  const isPass = result.passStatus === 'Pass';
  const isPending = !!result.isExamPending;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Primary Status & Risk Alert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pass/Fail Status Card */}
        <div className={cn(
          "p-8 rounded-3xl border flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl shadow-xl transition-all",
          isPending
            ? "bg-cyan-950/20 border-cyan-500/30 shadow-cyan-950/20"
            : isPass 
              ? "bg-emerald-950/20 border-emerald-500/30 shadow-emerald-950/20" 
              : "bg-rose-950/20 border-rose-500/30 shadow-rose-950/20"
        )}>
          {/* Ambient light glow */}
          <div className={cn(
            "absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none",
            isPending ? "bg-cyan-500/15" : isPass ? "bg-emerald-500/15" : "bg-rose-500/15"
          )} />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            {isPending ? (
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
            ) : isPass ? (
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <XCircle className="w-10 h-10 text-rose-400" />
              </div>
            )}
          </motion.div>

          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
            {isPending ? "Academic Status" : "Predicted Final Assessment Outcome"}
          </span>
          <span className={cn(
            "text-4xl sm:text-5xl font-black tracking-tight",
            isPending ? "text-cyan-400" : isPass ? "text-emerald-400" : "text-rose-400"
          )}>
            {isPending ? "Exams Pending" : result.passStatus}
          </span>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm max-w-sm">
            {isPending
              ? "Student profile enrolled in active cohort. Examination marks and attendance will populate as semester assessments conclude."
              : isPass 
                ? "Current engagement, assignment, and internal scores indicate a strong probability of passing the semester."
                : "Deficiencies detected in key academic milestones. Immediate targeted remediation is recommended."}
          </p>
        </div>

        {/* Early Warning System Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/80 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-400" />
                Early Warning & Risk Matrix
              </h3>
              <span className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5", riskBadge.bg, riskBadge.text)}>
                <span className={cn("w-1.5 h-1.5 rounded-full", riskBadge.dot)} />
                {result.riskLevel}
              </span>
            </div>
            
            {result.riskReasons.length > 0 ? (
              <div className="space-y-2.5">
                {result.riskReasons.map((reason, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300 bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                    <div className={cn("w-2 h-2 rounded-full mt-1 flex-shrink-0", riskBadge.dot)} />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 flex items-center justify-center text-slate-400 text-xs italic bg-slate-950/30 rounded-xl border border-slate-800/50">
                No acute academic vulnerabilities detected in current profile.
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400">Calculated Motivation Index</span>
              <span className={cn("text-xs font-bold font-mono", motivationColor)}>{result.motivationLevel} ({result.motivationScore}%)</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={cn("h-full transition-all duration-1000", isPass ? "bg-gradient-to-r from-indigo-500 to-emerald-400" : "bg-gradient-to-r from-amber-500 to-rose-500")} 
                style={{ width: `${result.motivationScore}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Composite Score', value: `${result.overallPercentage}%`, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Academic Standing', value: result.performanceLevel, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Motivation Score', value: `${result.motivationScore}/100`, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
          { label: 'Algorithm Accuracy', value: `${result.accuracy}%`, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 shadow-lg hover:border-slate-700/80 transition-all">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 border", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xl font-black text-white mt-0.5 tracking-tight font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Timeline */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Performance Progression
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              Evaluated Across Terms
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '14px', 
                    color: '#f8fafc', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' 
                  }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#06b6d4', strokeWidth: 2, stroke: '#090d16' }} 
                  activeDot={{ r: 7, fill: '#818cf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peer Comparison */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Cohort Peer Benchmarking
            </h3>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              {result.peerComparison.category} Tier
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peerData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 600 }} width={90} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '14px', 
                    color: '#f8fafc' 
                  }}
                />
                <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                  {peerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs text-slate-400">
              Relative status: Positioned in the <span className="font-bold text-indigo-400">{result.peerComparison.category} percentile</span> of departmental peers.
            </span>
          </div>
        </div>
      </div>

      {/* Explainable AI & Support Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Explainable AI */}
        <div className="lg:col-span-1 bg-slate-950/90 p-6 sm:p-7 rounded-3xl shadow-xl border border-indigo-500/20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Feature Weights</span>
                <h3 className="text-lg font-black text-white">Explainable AI Core</h3>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed mb-5">
              Decision tree heuristics pinpointed these variables as the primary determinants for your projection:
            </p>

            <div className="space-y-3.5">
              {result.features.sort((a, b) => b.importance - a.importance).map((feat, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">{feat.name}</span>
                    <span className="text-cyan-400 font-bold font-mono">{Math.round(feat.importance * 100)}% weight</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" 
                      style={{ width: `${feat.importance * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 italic">
              "Model Inference: Maintaining attendance above 75% alongside steady internal marks provides the highest statistical protection against risk."
            </p>
          </div>
        </div>

        {/* Recommendation Support Engine */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Target Milestones</span>
                <h3 className="text-lg font-black text-white">Targeted Support Directives</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.suggestions.map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/90 flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
                <div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">{s.title}</span>
                  <span className="text-2xl font-black text-white font-mono block mb-2">{s.target}</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          {result.suggestions.length === 0 && (
            <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-300 font-bold text-sm">Optimal Trajectory</p>
              <p className="text-slate-400 text-xs mt-1">All academic targets are currently satisfied at the target threshold.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
