import React from 'react';
import { GraduationCap, LogIn, ShieldCheck, Sparkles, Cpu, ArrowRight, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onLogin: (regNo: string) => void;
  isLoading: boolean;
  error: string | null;
}

interface PresetItem {
  label: string;
  regNo: string;
  role: string;
  displayTag: string;
  icon: any;
  color: string;
}

const DEFAULT_PRESETS: PresetItem[] = [
  { label: 'NAVEEEN', regNo: '2428K0344', role: 'Student • Computer Science', displayTag: 'REG NO', icon: UserCheck, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
  { label: 'Faculty Admin', regNo: 'ADMIN123', role: 'Institutional Portal', displayTag: 'ADMIN123', icon: Cpu, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10' },
];

export const Login: React.FC<Props> = ({ onLogin, isLoading, error }) => {
  const [regNo, setRegNo] = React.useState('');
  const [presets, setPresets] = React.useState<PresetItem[]>(DEFAULT_PRESETS);

  React.useEffect(() => {
    fetch('/api/faculty/all')
      .then(res => res.json())
      .then((data: Array<{ profile: any }>) => {
        if (Array.isArray(data) && data.length > 0) {
          const studentPresets: PresetItem[] = data.slice(0, 2).map((item, idx) => ({
            label: item.profile.name || `Student ${item.profile.registerNumber}`,
            regNo: item.profile.registerNumber,
            role: item.profile.department ? `Student • ${item.profile.department}` : 'Student • REG NO Access',
            displayTag: 'REG NO',
            icon: UserCheck,
            color: idx === 0 
              ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' 
              : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10'
          }));

          setPresets([
            ...studentPresets,
            { label: 'Faculty Admin', regNo: 'ADMIN123', role: 'Institutional Portal', displayTag: 'ADMIN123', icon: Cpu, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10' }
          ]);
        }
      })
      .catch(() => {
        // Keep default presets
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanReg = regNo.trim();
    if (cleanReg) {
      // If user literally types 'REG NO', default to first enrolled student
      if (cleanReg.toUpperCase() === 'REG NO') {
        const defaultStudent = presets.find(p => p.displayTag === 'REG NO')?.regNo || '2428K0344';
        onLogin(defaultStudent);
      } else {
        onLogin(cleanReg);
      }
    }
  };

  const handleSelectPreset = (presetRegNo: string) => {
    setRegNo(presetRegNo);
    onLogin(presetRegNo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070a13] p-4 relative overflow-hidden font-sans">
      {/* Dynamic ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-slate-900/85 backdrop-blur-2xl p-8 sm:p-9 rounded-3xl shadow-2xl border border-slate-800/90 relative overflow-hidden">
          {/* Subtle top neon border accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* Logo & Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="relative mb-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-4 ring-slate-950 animate-pulse" />
            </motion.div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                AI Engine v2.4
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              EduPredict <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300">Pro</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 max-w-xs">
              Next-Gen Academic Performance Prediction & Early Intervention Matrix
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  REG NO
                </label>
                <span className="text-[10px] text-cyan-400/90 font-mono">REG NO or ADMIN123</span>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                  placeholder="Enter REG NO or ADMIN123"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all pl-11 text-sm font-semibold tracking-wide"
                  required
                />
                <LogIn className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 absolute left-3.5 top-3.5 transition-colors" />
              </div>

              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Role-based encryption active
                </span>
                <span className="text-[11px] text-emerald-400/90 font-mono">
                  ● Ready
                </span>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-xs font-semibold flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Connecting to Academic Node...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Enter Academic Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="mt-7 pt-6 border-t border-slate-800/80">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">
              Quick Switch Demo Roles
            </span>
            <div className="space-y-2">
              {presets.map((preset) => (
                <button
                  key={preset.regNo}
                  type="button"
                  onClick={() => handleSelectPreset(preset.regNo)}
                  disabled={isLoading}
                  className="w-full p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-all group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${preset.color}`}>
                      <preset.icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {preset.label}
                      </div>
                      <div className="text-[10px] text-slate-400">{preset.role}</div>
                      {preset.displayTag === 'REG NO' && (
                        <div className="text-[9px] font-mono text-cyan-400 mt-0.5">
                          REG NO: <span className="font-bold">{preset.regNo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <code className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                    {preset.displayTag}
                  </code>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
