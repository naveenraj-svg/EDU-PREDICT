import React from 'react';
import { StudentProfile, PredictionResult } from '../types';
import { ResultsDashboard } from './ResultsDashboard';
import { StudentProfileModal } from './StudentProfileModal';
import { PersonalizedRecommendations } from './PersonalizedRecommendations';
import { DegreeAcademicVideos } from './DegreeAcademicVideos';
import { 
  User, Mail, Phone, Building2, FileText, Upload, 
  Download, Edit3, Save, RefreshCw, AlertCircle, Sparkles, Sliders, CheckCircle2,
  IdCard, UserCheck, Briefcase, ExternalLink, Camera, Image as ImageIcon,
  Video, BrainCircuit, BookOpen, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfilePhotoPickerModal } from './ProfilePhotoPickerModal';

interface Props {
  profile: StudentProfile;
  prediction: PredictionResult;
  onUpdate: (data: Partial<StudentProfile>) => void;
  onUpdateProfile?: (data: Partial<StudentProfile>) => Promise<void>;
  onUploadResume: (file: File) => void;
  isLoading: boolean;
  isProfileOpenExternal?: boolean;
  onCloseProfileExternal?: () => void;
}

export const StudentDashboard: React.FC<Props> = ({ 
  profile, 
  prediction, 
  onUpdate, 
  onUpdateProfile,
  onUploadResume,
  isLoading,
  isProfileOpenExternal = false,
  onCloseProfileExternal
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = React.useState(false);
  const [photoPickerTab, setPhotoPickerTab] = React.useState<'system-files' | 'gallery' | 'camera'>('system-files');
  const [photoUpdateSuccess, setPhotoUpdateSuccess] = React.useState<string | null>(null);

  // Sync external profile trigger from top header navigation
  const showProfile = isProfileModalOpen || isProfileOpenExternal;
  const handleCloseProfile = () => {
    setIsProfileModalOpen(false);
    if (onCloseProfileExternal) onCloseProfileExternal();
  };
  const [editData, setEditData] = React.useState({
    attendance: profile.attendance,
    internalMarks: profile.internalMarks,
    assignmentScore: profile.assignmentScore,
    studyHours: profile.studyHours,
  });

  // Sync editData when profile updates from external
  React.useEffect(() => {
    setEditData({
      attendance: profile.attendance,
      internalMarks: profile.internalMarks,
      assignmentScore: profile.assignmentScore,
      studyHours: profile.studyHours,
    });
  }, [profile.attendance, profile.internalMarks, profile.assignmentScore, profile.studyHours]);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUploadResume(file);
  };

  const applyQuickPreset = (type: 'optimal' | 'moderate') => {
    if (type === 'optimal') {
      setEditData({
        attendance: Math.min(100, editData.attendance + 15),
        internalMarks: Math.min(100, editData.internalMarks + 12),
        assignmentScore: Math.min(100, editData.assignmentScore + 10),
        studyHours: Math.min(40, editData.studyHours + 6),
      });
    } else {
      setEditData({
        attendance: 85,
        internalMarks: 75,
        assignmentScore: 80,
        studyHours: 18,
      });
    }
    if (!isEditing) setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Photo Update Success Notification */}
        <AnimatePresence>
          {photoUpdateSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:col-span-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-emerald-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{photoUpdateSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:col-span-2">
          <div 
            className="relative group cursor-pointer" 
            onClick={() => {
              setPhotoPickerTab('system-files');
              setIsPhotoPickerOpen(true);
            }}
            title="Click to update photo from System Files or Gallery"
          >
            <div className="w-22 h-22 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20 overflow-hidden group-hover:scale-105 transition-all">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              ) : (
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            
            {/* Quick Camera Action Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPhotoPickerTab('system-files');
                setIsPhotoPickerOpen(true);
              }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg border-2 border-slate-900 transition-transform hover:scale-110 cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            <div className="absolute inset-0 bg-slate-950/70 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider p-1">
              <Camera className="w-5 h-5 text-cyan-400 mb-0.5" />
              <span>Update Photo</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Active Scholar
              </span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 flex items-center gap-1">
                <span className="text-cyan-300/70 font-semibold">REG NO:</span>
                <span className="font-bold">{profile.registerNumber}</span>
              </span>
              {profile.targetCareer && (
                <span className="text-[10px] font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-cyan-400" />
                  <span>{profile.targetCareer}</span>
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{profile.name}</h2>
                <p className="text-slate-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 mt-1">
                  <Building2 className="w-4 h-4 text-slate-500" /> 
                  <span>Department of {profile.department}</span>
                </p>
              </div>

              {/* Dedicated Profile & Photo Buttons */}
              <div className="self-start sm:self-center flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPickerTab('system-files');
                    setIsPhotoPickerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700/80 hover:border-cyan-500/50 text-xs font-bold transition-all shadow-sm cursor-pointer group"
                  title="Upload from System Files or Choose from Gallery"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>Change Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-400 text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer group"
                >
                  <IdCard className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>Profile Options & ID</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3.5">
              <span className="text-xs bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-xl text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-indigo-400" /> {profile.mobile}
              </span>
              {profile.email && (
                <span className="text-xs bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-xl text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-cyan-400" /> {profile.email}
                </span>
              )}
              <span className="text-xs bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-xl text-slate-300 flex items-center gap-1.5 font-mono">
                {profile.semester || 'Sem VI • 2026 Batch'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Resume Card */}
        <div className="flex flex-col justify-center">
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/90 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Career Dossier
              </span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>

            {profile.resumeName ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                      {profile.resumeName}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      if (profile.resumeUrl) {
                        const win = window.open();
                        win?.document.write(`<iframe src="${profile.resumeUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                      }
                    }}
                    className="text-indigo-400 hover:text-indigo-300 p-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors cursor-pointer"
                    title="View / Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                <label className="cursor-pointer flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 text-[11px] font-semibold py-1">
                  <Upload className="w-3.5 h-3.5" /> Replace Resume PDF
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer group flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/80 transition-all">
                <Upload className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors mb-1" />
                <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-300 transition-colors">
                  Upload Student Resume
                </span>
                <span className="text-[10px] text-slate-400">PDF, DOC up to 5MB</span>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Section Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-950/70 border border-slate-800/90 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pl-3">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Quick Sections:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => document.getElementById('simulation-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Effort Simulation</span>
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Risk & Predictions</span>
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('ai-recommendations-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Recommendations</span>
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('degree-academic-videos-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>Degree Academic Videos</span>
          </button>
        </div>
      </div>

      {/* Self-Assessment Simulation Sandbox */}
      <motion.div 
        id="simulation-section"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800/80 relative scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                Interactive Simulation Sandbox
              </span>
              {isEditing && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                  ● Uncommitted Changes
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2 mt-1">
              <Sliders className="w-5 h-5 text-indigo-400" />
              What-If Performance Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tweak effort levels to simulate outcomes and assess risk volatility in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isEditing && (
              <button
                onClick={() => applyQuickPreset('optimal')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>+Goal Boost</span>
              </button>
            )}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 ${
                isEditing 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-emerald-600/20' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Commit Simulation</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Modify Effort Parameters</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Attendance', key: 'attendance', min: 0, max: 100, unit: '%', color: 'from-cyan-500 to-indigo-500', desc: 'Lecture engagement' },
            { label: 'Internal Marks', key: 'internalMarks', min: 0, max: 100, unit: '/100', color: 'from-indigo-500 to-purple-500', desc: 'Midterm exams' },
            { label: 'Assignment Score', key: 'assignmentScore', min: 0, max: 100, unit: '/100', color: 'from-purple-500 to-pink-500', desc: 'Continuous assessments' },
            { label: 'Study Hours', key: 'studyHours', min: 0, max: 40, unit: 'h/wk', color: 'from-amber-500 to-emerald-500', desc: 'Weekly self-study' },
          ].map((field) => {
            const currentValue = isEditing 
              ? editData[field.key as keyof typeof editData] 
              : profile[field.key as keyof typeof profile];
            
            return (
              <div 
                key={field.key} 
                className={`p-5 rounded-2xl border transition-all ${
                  isEditing 
                    ? 'bg-slate-950/80 border-indigo-500/30 shadow-md' 
                    : 'bg-slate-950/40 border-slate-800/80'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      {field.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{field.desc}</span>
                  </div>
                  <span className="text-lg font-black text-white font-mono bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
                    {currentValue}{field.unit}
                  </span>
                </div>

                <div className="mt-4">
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    disabled={!isEditing}
                    value={currentValue}
                    onChange={(e) => setEditData(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                    <span>{field.min}{field.unit}</span>
                    <span>{field.max}{field.unit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isEditing && (
          <div className="mt-6 flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Click <strong>"Modify Effort Parameters"</strong> above to test how higher attendance or study hours would improve your predicted grade!</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Prediction Results & Analytics Dashboard */}
      <div id="results-section" className="scroll-mt-24">
        <ResultsDashboard result={prediction} />
      </div>

      {/* Personalized AI Recommendations & Study Plan */}
      <div id="ai-recommendations-section" className="scroll-mt-24">
        <PersonalizedRecommendations student={profile} />
      </div>

      {/* Degree-Specific Academic Video Hub */}
      <div id="degree-academic-videos-section" className="scroll-mt-24">
        <DegreeAcademicVideos student={profile} />
      </div>

      {/* Profile Photo Picker Modal (System Files & Gallery) */}
      <ProfilePhotoPickerModal
        isOpen={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        currentAvatarUrl={profile.avatarUrl}
        studentName={profile.name}
        registerNumber={profile.registerNumber}
        initialTab={photoPickerTab}
        onSelectAvatar={async (url) => {
          if (onUpdateProfile) {
            await onUpdateProfile({ avatarUrl: url });
          } else {
            onUpdate({ avatarUrl: url });
          }
          setPhotoUpdateSuccess('Profile photo updated successfully!');
          setTimeout(() => setPhotoUpdateSuccess(null), 3000);
        }}
      />

      {/* Comprehensive Student Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <StudentProfileModal
            isOpen={showProfile}
            onClose={handleCloseProfile}
            profile={profile}
            prediction={prediction}
            onSave={onUpdateProfile || (async (data) => onUpdate(data))}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
