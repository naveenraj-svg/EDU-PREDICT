import React from 'react';
import { StudentProfile, PersonalizedRecommendations as IRecommendations } from '../types';
import { 
  BrainCircuit, Calendar, ExternalLink, ShieldAlert, 
  CheckCircle2, BookOpen, Star, RefreshCw, Compass, Clock, Sparkles, Check, ChevronRight,
  Video, Play, Award, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  student: StudentProfile;
  lastUpdatedTrigger?: number;
}

export const PersonalizedRecommendations: React.FC<Props> = ({ student, lastUpdatedTrigger = 0 }) => {
  const [data, setData] = React.useState<IRecommendations | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'diagnostics' | 'studyPlan' | 'resources' | 'videos' | 'strategies'>('diagnostics');
  const [completedTasks, setCompletedTasks] = React.useState<Record<string, boolean>>({});

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/student/${student.registerNumber}/recommendations`);
      if (!res.ok) {
        throw new Error('Failed to load personalized recommendations');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError('Could not establish secure connection to the AI Advisor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecommendations();
  }, [
    student.registerNumber, 
    student.attendance, 
    student.internalMarks, 
    student.assignmentScore, 
    student.studyHours, 
    lastUpdatedTrigger
  ]);

  const toggleTask = (weekIndex: number, taskIndex: number) => {
    const key = `${weekIndex}-${taskIndex}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl p-12 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-400 animate-spin" />
          <BrainCircuit className="w-8 h-8 text-indigo-400 absolute top-4 left-4 animate-pulse" />
        </div>
        <p className="text-lg font-black text-white tracking-tight">AI Advisor Reasoning In Progress</p>
        <p className="text-xs text-slate-400 mt-2 text-center max-w-sm">
          Synthesizing historical cohorts, risk parameters, and study velocity to engineer an optimized curriculum...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-950/20 border border-rose-500/30 p-8 rounded-3xl flex flex-col items-center justify-center text-center backdrop-blur-xl">
        <ShieldAlert className="w-12 h-12 text-rose-400 mb-3" />
        <p className="text-sm font-black text-white">Advisory Engine Interrupted</p>
        <p className="text-xs text-rose-300 mt-1 max-w-md">{error || 'An unexpected error occurred.'}</p>
        <button 
          onClick={fetchRecommendations}
          className="mt-4 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-600/20"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-trigger AI Inference
        </button>
      </div>
    );
  }

  // Calculate task completion progress
  const totalTasks = data.studyPlan.reduce((acc, week) => acc + week.tasks.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div id="ai-personalized-recommendations" className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 relative overflow-hidden border-b border-slate-800/80">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <BrainCircuit className="w-7 h-7 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Adaptive AI Advisor
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                  Sem VI Calibration
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1 tracking-tight">Personalized Learning Roadmap</h3>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchRecommendations}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer self-start md:self-auto shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> 
            <span>Recalibrate Insights</span>
          </motion.button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 px-6 py-2.5 flex flex-wrap gap-2">
        {[
          { id: 'diagnostics', label: 'AI Diagnostic Review', icon: Compass },
          { id: 'studyPlan', label: 'Adaptive Study Plan', icon: Calendar },
          { id: 'resources', label: 'Curated Resources', icon: BookOpen },
          { id: 'videos', label: 'Degree Video Pathways', icon: Video },
          { id: 'strategies', label: 'Strategic Interventions', icon: Star },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40' 
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'diagnostics' && (
            <motion.div
              key="diagnostics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Executive Summary */}
              <div className="p-6 rounded-2xl bg-slate-950/70 border border-indigo-500/20 relative shadow-inner">
                <span className="absolute -top-3 left-6 text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-0.5 rounded-full">
                  Holistic Evaluation
                </span>
                <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed pt-2">
                  "{data.aiAnalysis.summary}"
                </p>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-sm">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Validated Strengths
                  </h4>
                  <ul className="space-y-3">
                    {data.aiAnalysis.strengths.map((strength, i) => (
                      <li key={i} className="flex gap-3 items-start text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-sm">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Vulnerability Points
                  </h4>
                  <ul className="space-y-3">
                    {data.aiAnalysis.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex gap-3 items-start text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'studyPlan' && (
            <motion.div
              key="studyPlan"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Checklist Progress Header */}
              <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-black text-white">Course Mastery Progress</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Track weekly sprint objectives to systematically extinguish academic vulnerabilities.</p>
                  </div>
                  <span className="text-2xl font-black text-cyan-400 font-mono">{progressPercent}% Completed</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Weekly breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.studyPlan.map((week, wIdx) => (
                  <div key={wIdx} className="bg-slate-950/50 border border-slate-800/90 rounded-2xl p-6 shadow-inner hover:border-slate-700/80 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                        {week.week}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" /> {week.suggestedHours}h/wk
                      </span>
                    </div>
                    <p className="text-sm font-black text-white mb-4 tracking-tight">{week.focusTopic}</p>
                    <div className="space-y-2.5">
                      {week.tasks.map((task, tIdx) => {
                        const taskKey = `${wIdx}-${tIdx}`;
                        const isDone = !!completedTasks[taskKey];
                        return (
                          <div 
                            key={tIdx} 
                            onClick={() => toggleTask(wIdx, tIdx)}
                            className={`flex gap-3 items-start p-3 rounded-xl border transition-all cursor-pointer select-none ${
                              isDone 
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-400 line-through' 
                                : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all shrink-0 ${
                              isDone ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-950'
                            }`}>
                              {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs leading-relaxed">{task}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {data.learningResources.map((res, idx) => {
                const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(res.searchQuery)}`;
                const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(res.searchQuery)}`;
                return (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-6 shadow-inner flex flex-col hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.topic}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        res.type === 'Video' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                        res.type === 'Interactive Course' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                        res.type === 'Book' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {res.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white mb-2">{res.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed flex-grow mb-4">{res.description}</p>
                    <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-slate-800/80">
                      <a 
                        href={searchUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-all shadow-md shadow-rose-600/20"
                      >
                        YouTube <ExternalLink className="w-3 h-3" />
                      </a>
                      <a 
                        href={googleUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all border border-slate-700"
                      >
                        Google <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Degree-Specific Academic Video Pathways</h4>
                    <p className="text-xs text-slate-300">
                      Curated future university lectures and core milestone videos aligned to your {student.department} degree curriculum.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('degree-academic-videos-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Explore Full Video Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(data.futureAcademicVideos || []).map((video, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/60 border border-slate-800/90 hover:border-indigo-500/50 p-5 rounded-2xl flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {video.platform}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {video.semesterTarget}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {video.whyRecommended}
                      </p>
                    </div>

                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.searchQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 hover:border-indigo-400/50 text-xs font-bold transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch on {video.platform}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'strategies' && (
            <motion.div
              key="strategies"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {data.improvementStrategies.map((strategy, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800/90 p-6 rounded-2xl flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-black text-white">{strategy.title}</h4>
                      <div className="flex gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          strategy.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          strategy.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          {strategy.difficulty}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          strategy.impact === 'High' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                          strategy.impact === 'Medium' ? 'bg-slate-800 text-slate-300 border-slate-700' :
                          'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                          {strategy.impact} Impact
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      <strong className="text-slate-100 font-bold block mb-1">Recommended Action:</strong>
                      {strategy.actionableStep}
                    </p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 uppercase tracking-wider font-semibold">Milestone Target</span>
                    <span className="font-mono font-bold text-cyan-400">{strategy.milestone}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
