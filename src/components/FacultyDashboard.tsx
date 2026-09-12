import React from 'react';
import { FacultyStats, StudentProfile, PredictionResult } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, TrendingUp, AlertTriangle, Award, Search, 
  Filter, Download, ExternalLink, FileText, UserPlus, Pencil, Trash2, X, PlusCircle,
  BrainCircuit, Sparkles, Clock, CheckCircle2, Sliders, ShieldCheck, KeyRound, ArrowRight, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FacultyAdvisor } from './FacultyAdvisor';
import { AdminChatbot } from './AdminChatbot';
import { PersonalizedRecommendations } from './PersonalizedRecommendations';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

export const FacultyDashboard: React.FC = () => {
  const [stats, setStats] = React.useState<FacultyStats | null>(null);
  const [students, setStudents] = React.useState<{ profile: StudentProfile, prediction: PredictionResult }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'at-risk' | 'top' | 'pending-exams'>('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<StudentProfile | null>(null);
  const [selectedAiStudent, setSelectedAiStudent] = React.useState<StudentProfile | null>(null);
  const [deleteConfirmRegNo, setDeleteConfirmRegNo] = React.useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = React.useState({
    registerNumber: '',
    name: '',
    department: '',
    mobile: '',
    attendance: 0,
    internalMarks: 0,
    assignmentScore: 0,
    studyHours: 0
  });

  const [modalError, setModalError] = React.useState<string | null>(null);
  const [modalLoading, setModalLoading] = React.useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        fetch('/api/faculty/stats'),
        fetch('/api/faculty/all')
      ]);
      setStats(await statsRes.json());
      setStudents(await studentsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setSelectedStudent(null);
    setFormData({
      registerNumber: '',
      name: '',
      department: '',
      mobile: '',
      attendance: 0,
      internalMarks: 0,
      assignmentScore: 0,
      studyHours: 0
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (student: StudentProfile) => {
    setSelectedStudent(student);
    setFormData({
      registerNumber: student.registerNumber,
      name: student.name,
      department: student.department,
      mobile: student.mobile,
      attendance: student.attendance,
      internalMarks: student.internalMarks,
      assignmentScore: student.assignmentScore,
      studyHours: student.studyHours
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);

    const isEdit = !!selectedStudent;
    const url = isEdit ? '/api/faculty/student/edit' : '/api/faculty/student/add';

    const payload = isEdit 
      ? { ...formData, oldRegisterNumber: selectedStudent.registerNumber }
      : formData;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setModalError(err.message || 'Error occurred');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteStudent = async (regNo: string) => {
    try {
      const res = await fetch(`/api/faculty/student/${regNo}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete student.');
      }
      setDeleteConfirmRegNo(null);
      await fetchData();
    } catch (err: any) {
      setModalError(err.message || 'Failed to delete student.');
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.profile.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.profile.registerNumber.toLowerCase().includes(search.toLowerCase()) ||
                         s.profile.department.toLowerCase().includes(search.toLowerCase());
    
    const isPending = s.prediction.isExamPending || (s.profile.attendance === 0 && s.profile.internalMarks === 0);

    const matchesFilter = filter === 'all' || 
                         (filter === 'at-risk' && !isPending && s.prediction.riskLevel !== 'Low Risk') ||
                         (filter === 'top' && !isPending && s.prediction.performanceLevel === 'Excellent') ||
                         (filter === 'pending-exams' && isPending);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
          <BrainCircuit className="w-8 h-8 text-indigo-400 absolute top-4 left-4 animate-pulse" />
        </div>
        <p className="text-white font-bold text-base">Loading Faculty & Institutional Telemetry...</p>
        <p className="text-slate-400 text-xs mt-1">Aggregating predictive models, risk distributions, and student records</p>
      </div>
    );
  }

  const perfData = stats ? Object.entries(stats.performanceDistribution).map(([name, value]) => ({ name, value })) : [];
  const riskData = stats ? [
    { name: 'High Risk', value: stats.riskDistribution.high, color: '#ef4444' },
    { name: 'Medium Risk', value: stats.riskDistribution.medium, color: '#f59e0b' },
    { name: 'Low Risk', value: stats.riskDistribution.low, color: '#10b981' },
  ] : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Admin Academic AI Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Institutional AI Portal
              </span>
              <span className="text-xs text-slate-300 font-medium">Real-Time Cohort Diagnostics & Admin Intelligence</span>
            </div>
            <h3 className="text-xl font-black mt-1 tracking-tight">Admin & Faculty AI Academic Advisor Active</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Empowered with real-time risk classification, student profile editing (including REG NO), and pre-exam candidate onboarding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto relative z-10 shrink-0">
          <button
            onClick={() => {
              const el = document.getElementById('faculty-ai-advisor');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                el.classList.add('ring-4', 'ring-indigo-500', 'ring-offset-2', 'ring-offset-slate-950');
                setTimeout(() => el.classList.remove('ring-4', 'ring-indigo-500', 'ring-offset-2', 'ring-offset-slate-950'), 2500);
              }
            }}
            className="flex-1 md:flex-none px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult Institutional Advisor</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled Students</p>
            <p className="text-3xl font-black text-white mt-1 font-mono tracking-tight">{stats.totalStudents}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Active across all departments</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cohort Pass Rate</p>
            <p className="text-3xl font-black text-emerald-400 mt-1 font-mono tracking-tight">{stats.passRate}%</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Evaluated against 40% cutoff</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Percentage</p>
            <p className="text-3xl font-black text-cyan-400 mt-1 font-mono tracking-tight">{stats.averageScore}%</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Weighted performance metric</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students At Risk</p>
            <p className="text-3xl font-black text-rose-400 mt-1 font-mono tracking-tight">{stats.riskDistribution.high}</p>
            <span className="text-[11px] text-rose-400/80 mt-1 block">Requires high-priority intervention</span>
          </div>
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">Performance Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Cohort categorization across academic tiers</p>
            </div>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              ML Categorization
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={perfData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={6} dataKey="value">
                  {perfData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '14px', 
                    color: '#f8fafc',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                  }}
                />
                <Legend 
                  formatter={(value) => <span className="text-xs font-semibold text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">Risk Level Analysis</h3>
              <p className="text-xs text-slate-400 mt-0.5">Early warning triage based on attendance & exam marks</p>
            </div>
            <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
              Triage Matrix
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '14px', 
                    color: '#f8fafc',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Academic Advisor for Admin & Faculty */}
      <FacultyAdvisor />

      {/* Student Management Table */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                Institutional Records
              </span>
              <span className="text-xs text-slate-400">Total: {students.length} candidates</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mt-1">Student Directory & Academic Registry</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage candidates, edit Register Numbers (REG NO), add new profiles without exam scores, and trigger student-specific AI Advisors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search name, REG NO, dept..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64 transition-all"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option value="all">All Cohorts ({students.length})</option>
              <option value="at-risk">At Risk Only</option>
              <option value="top">Top Performers</option>
              <option value="pending-exams">Awaiting Exams (New Students)</option>
            </select>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Student Profile</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <th className="px-6 sm:px-8 py-4 text-[11px] font-bold uppercase tracking-wider">Candidate & REG NO</th>
                <th className="px-6 sm:px-8 py-4 text-[11px] font-bold uppercase tracking-wider">Academic Examination Data</th>
                <th className="px-6 sm:px-8 py-4 text-[11px] font-bold uppercase tracking-wider">Predicted Status</th>
                <th className="px-6 sm:px-8 py-4 text-[11px] font-bold uppercase tracking-wider">Risk Level</th>
                <th className="px-6 sm:px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-right">Actions & Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-500 text-sm">
                    No students matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const isPending = s.prediction.isExamPending || (s.profile.attendance === 0 && s.profile.internalMarks === 0);

                  return (
                    <tr key={s.profile.registerNumber} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 sm:px-8 py-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1.5px] rounded-2xl shrink-0">
                            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400 font-black text-sm">
                              {s.profile.name[0]}
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm tracking-tight">{s.profile.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 text-[11px] font-bold flex items-center gap-1">
                                <span className="text-cyan-400/60 text-[9px]">REG NO:</span>
                                <span>{s.profile.registerNumber}</span>
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {s.profile.department}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 sm:px-8 py-5">
                        {isPending ? (
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Awaiting Exam Generation</span>
                            </span>
                            <p className="text-[10px] text-slate-500">
                              Profile added prior to examinations.
                            </p>
                            <button
                              onClick={() => openEditModal(s.profile)}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>+ Record Marks</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">Attendance:</span>
                              <span className={`font-mono font-bold ${s.profile.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {s.profile.attendance}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">Internal Marks:</span>
                              <span className="font-mono font-bold text-white">
                                {s.profile.internalMarks}/100
                              </span>
                              <span className="text-[10px] text-slate-500">
                                ({s.profile.studyHours}h study/wk)
                              </span>
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="px-6 sm:px-8 py-5">
                        {isPending ? (
                          <div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              Enrolled (Pre-Exam)
                            </span>
                            <p className="text-[10px] text-slate-500 mt-1">Pending Exam Period</p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${s.prediction.passStatus === 'Pass' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                              <span className="text-sm font-black font-mono text-white">
                                {s.prediction.overallPercentage}%
                              </span>
                              <span className={`text-xs font-bold ${s.prediction.passStatus === 'Pass' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                ({s.prediction.passStatus})
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase font-black mt-1 font-mono tracking-wider">
                              {s.prediction.performanceLevel} Level
                            </p>
                          </div>
                        )}
                      </td>

                      <td className="px-6 sm:px-8 py-5">
                        {isPending ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800/80 text-slate-400 border border-slate-700/60">
                            Unassessed
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            s.prediction.riskLevel === 'High Risk' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                            s.prediction.riskLevel === 'Medium Risk' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {s.prediction.riskLevel}
                          </span>
                        )}
                      </td>

                      <td className="px-6 sm:px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Student AI Advisor Trigger */}
                          <button 
                            onClick={() => setSelectedAiStudent(s.profile)}
                            title="Open AI Academic Advisor for Student" 
                            className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-indigo-500/30 shadow-md shadow-indigo-500/10"
                          >
                            <BrainCircuit className="w-3.5 h-3.5" />
                            <span>AI Advisor</span>
                          </button>

                          {/* Resume View */}
                          {s.profile.resumeUrl && (
                            <button 
                              onClick={() => window.open(s.profile.resumeUrl, '_blank')}
                              title="View Candidate Resume" 
                              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-700"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit Register Number & Full Profile */}
                          <button 
                            onClick={() => openEditModal(s.profile)}
                            title="Edit Register Number & Profile Details" 
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-700"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete Student */}
                          <button 
                            onClick={() => setDeleteConfirmRegNo(s.profile.registerNumber)}
                            title="Remove Student Record" 
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {/* Add/Edit Student Modal */}
        {isModalOpen && (
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
              className="bg-slate-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col border border-slate-800 my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-500/20 p-2.5 rounded-2xl text-indigo-400 border border-indigo-500/30">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">
                      {selectedStudent ? 'Edit Student & Register Number' : 'Enlist New Student Candidate'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedStudent 
                        ? 'Modify student identity, change Register Number (REG NO), or update examination metrics' 
                        : 'Register candidate with or without exam scores (exam metrics can be filled at term end)'}
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                {modalError && (
                  <div className="p-4 bg-rose-950/40 text-rose-300 text-xs rounded-2xl border border-rose-500/30 font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                {/* Section 1: Candidate Identity */}
                <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      Candidate Identity & Profile (Required)
                    </span>
                    {selectedStudent && (
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        Editing Active Record
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Register Number */}
                    <div className="sm:col-span-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Register Number (REG NO) <span className="text-rose-400">*</span>
                        </label>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          Editable - Primary Key
                        </span>
                      </div>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. 2428K0344 or 2026CS101"
                        value={formData.registerNumber}
                        onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        You can change or correct this Register Number anytime. Updates will sync automatically across the database.
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Student Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Akash Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Department <span className="text-rose-400">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Computer Science"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                      />
                    </div>

                    {/* Mobile */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Mobile Number <span className="text-rose-400">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. 9876543210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Academic Examination & Evaluation Metrics */}
                <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      Academic & Examination Data (Optional / Semester End)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Can be filled after exams
                    </span>
                  </div>

                  {/* Informational callout regarding pre-exam enrollment */}
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-slate-300 text-xs flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">Academic End Examination Flexibility</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Internal marks, attendance, assignment score, and study hours can be left at <strong>0 or blank</strong> when adding candidates at semester beginning. You can return and record scores once examinations are conducted.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Attendance Percentage */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Attendance (%) <span className="text-slate-500 font-normal">(Optional)</span>
                      </label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0 or blank"
                        value={formData.attendance === 0 ? '' : formData.attendance}
                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value === '' ? 0 : Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>

                    {/* Internal Exam Marks */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Internal Marks (/100) <span className="text-slate-500 font-normal">(Optional)</span>
                      </label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0 or blank"
                        value={formData.internalMarks === 0 ? '' : formData.internalMarks}
                        onChange={(e) => setFormData({ ...formData, internalMarks: e.target.value === '' ? 0 : Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>

                    {/* Assignment Score */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Assignment Score (/100) <span className="text-slate-500 font-normal">(Optional)</span>
                      </label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0 or blank"
                        value={formData.assignmentScore === 0 ? '' : formData.assignmentScore}
                        onChange={(e) => setFormData({ ...formData, assignmentScore: e.target.value === '' ? 0 : Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>

                    {/* Study Hours */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Study Hours / Wk <span className="text-slate-500 font-normal">(Optional)</span>
                      </label>
                      <input 
                        type="number"
                        min="0"
                        max="168"
                        placeholder="0 or blank"
                        value={formData.studyHours === 0 ? '' : formData.studyHours}
                        onChange={(e) => setFormData({ ...formData, studyHours: e.target.value === '' ? 0 : Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={modalLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {modalLoading ? 'Processing...' : selectedStudent ? 'Save Candidate Updates' : 'Enlist Student Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmRegNo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-800 space-y-4"
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-rose-500/20 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400">
                  <Trash2 className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-white">Remove Student Record?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you sure you want to remove candidate with REG NO <strong className="text-white font-mono">{deleteConfirmRegNo}</strong>? All telemetry and prediction metrics will be purged.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setDeleteConfirmRegNo(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteStudent(deleteConfirmRegNo)}
                  className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Student-Specific AI Academic Advisor Modal */}
        {selectedAiStudent && (
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
              className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-800 my-6"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                        Admin Academic Intelligence
                      </span>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        REG NO: {selectedAiStudent.registerNumber}
                      </span>
                    </div>
                    <h3 className="text-xl font-black mt-0.5">
                      {selectedAiStudent.name}'s AI Remediation & Learning Plan
                    </h3>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedAiStudent(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 bg-slate-950/60">
                <PersonalizedRecommendations student={selectedAiStudent} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Academic Advisor for Admin Portal */}
      <AdminChatbot />
    </motion.div>
  );
};
