import React from 'react';
import { Login } from './components/Login';
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { ProjectReport } from './components/ProjectReport';
import { StudentProfile, PredictionResult, AuthState, UserRole } from './types';
import { GraduationCap, Github, LayoutDashboard, UserCircle, LogOut, BookOpen, IdCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [auth, setAuth] = React.useState<AuthState>({ user: null, role: null });
  const [studentData, setStudentData] = React.useState<{ profile: StudentProfile, prediction: PredictionResult } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showReport, setShowReport] = React.useState(false);
  const [showStudentProfile, setShowStudentProfile] = React.useState(false);

  const handleLogin = async (regNo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber: regNo }),
      });
      
      if (!response.ok) throw new Error('Invalid Register Number');
      
      const data = await response.json();
      setAuth({ user: data.user, role: data.role });
      
      if (data.role === 'student') {
        fetchStudentData(regNo);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentData = async (regNo: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/student/${regNo}`);
      const data = await response.json();
      setStudentData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStudent = async (data: Partial<StudentProfile>) => {
    if (!auth.user || auth.role !== 'student') return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          registerNumber: (auth.user as StudentProfile).registerNumber,
          ...data 
        }),
      });
      const updated = await response.json();
      setStudentData(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFullProfile = async (data: Partial<StudentProfile>) => {
    if (!auth.user || auth.role !== 'student') return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/student/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          registerNumber: (auth.user as StudentProfile).registerNumber,
          ...data 
        }),
      });
      const updated = await response.json();
      if (updated.profile) {
        setStudentData({ profile: updated.profile, prediction: updated.prediction });
        setAuth(prev => ({ ...prev, user: updated.profile }));
      }
    } catch (err) {
      console.error('Failed to update student profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadResume = async (file: File) => {
    if (!auth.user || auth.role !== 'student') return;
    // Simulate upload by converting to base64 for this demo
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await fetch('/api/student/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registerNumber: (auth.user as StudentProfile).registerNumber,
          resumeName: file.name,
          resumeUrl: base64
        }),
      });
      fetchStudentData((auth.user as StudentProfile).registerNumber);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    setAuth({ user: null, role: null });
    setStudentData(null);
  };

  if (!auth.role) {
    return <Login onLogin={handleLogin} isLoading={isLoading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-[#070a13] font-sans text-slate-100 relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  EduPredict <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300">Pro</span>
                </h1>
                <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Live Neural Core
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Intelligent Academic Risk & Performance Matrix</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold">
              {auth.role === 'faculty' ? (
                <span className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-indigo-300 shadow-sm">
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" /> Faculty Command
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-cyan-300 shadow-sm">
                  <UserCircle className="w-3.5 h-3.5 text-cyan-400" /> Student Portal
                </span>
              )}
            </div>

            {auth.role === 'student' && (
              <button
                onClick={() => setShowStudentProfile(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 transition-all cursor-pointer shadow-xs"
                title="Open Student Profile Options & Digital ID"
              >
                <IdCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>My Profile</span>
              </button>
            )}

            <button
              onClick={() => setShowReport(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/90 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Project Blueprint</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {auth.role === 'student' && studentData ? (
            <motion.div 
              key="student"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <StudentDashboard 
                profile={studentData.profile}
                prediction={studentData.prediction}
                onUpdate={handleUpdateStudent}
                onUpdateProfile={handleUpdateFullProfile}
                onUploadResume={handleUploadResume}
                isLoading={isLoading}
                isProfileOpenExternal={showStudentProfile}
                onCloseProfileExternal={() => setShowStudentProfile(false)}
              />
            </motion.div>
          ) : auth.role === 'faculty' ? (
            <motion.div 
              key="faculty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    Institutional Administration
                  </span>
                  <span className="text-xs text-slate-400">• Spring 2026 Academic Cohort</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">Faculty Command Center</h2>
                <p className="text-slate-400 text-sm mt-1">Real-time institutional diagnostic matrix, ML risk projections, and cohort interventions.</p>
              </div>
              <FacultyDashboard />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
                <GraduationCap className="w-6 h-6 text-indigo-400 absolute top-3 left-3" />
              </div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading Secure Analytics Stream...</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950/70 border-t border-slate-800/80 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="font-medium text-slate-300">
              EduPredict Pro • Machine Learning Academic Performance Engine
            </p>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">
            Node / Express • SQLite • Decision Tree & Ridge Heuristic Model • React 18
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showReport && <ProjectReport onClose={() => setShowReport(false)} />}
      </AnimatePresence>
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
