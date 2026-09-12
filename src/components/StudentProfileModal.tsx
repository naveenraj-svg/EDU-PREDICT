import React from 'react';
import { StudentProfile, PredictionResult } from '../types';
import { 
  X, User, Mail, Phone, Building2, BookOpen, Briefcase, 
  Github, Linkedin, Award, ShieldCheck, CheckCircle2, 
  Save, Sparkles, QrCode, IdCard, ExternalLink, GraduationCap,
  Calendar, HeartHandshake, Code, Camera, Upload, FolderOpen,
  Image as ImageIcon, RefreshCw, Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfilePhotoPickerModal } from './ProfilePhotoPickerModal';
import { AVATAR_GALLERY } from '../data/avatarGallery';
import { processImageFile } from '../utils/imageUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  prediction: PredictionResult;
  onSave: (data: Partial<StudentProfile>) => Promise<void>;
  isLoading: boolean;
}

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics'
];

export const StudentProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  prediction,
  onSave,
  isLoading
}) => {
  const [activeTab, setActiveTab] = React.useState<'identity' | 'academic' | 'career' | 'idcard'>('identity');
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = React.useState(false);
  const [photoPickerTab, setPhotoPickerTab] = React.useState<'system-files' | 'gallery' | 'camera'>('system-files');
  const [isDraggingDirect, setIsDraggingDirect] = React.useState(false);
  const [isProcessingDirect, setIsProcessingDirect] = React.useState(false);
  const directFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleDirectFile = async (file: File) => {
    try {
      setIsProcessingDirect(true);
      const res = await processImageFile(file);
      setFormData(prev => ({ ...prev, avatarUrl: res.dataUrl }));
      setSuccessMsg('Profile photo updated from system file!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Error processing system image:', err);
    } finally {
      setIsProcessingDirect(false);
    }
  };

  const [formData, setFormData] = React.useState({
    name: profile.name || '',
    department: profile.department || 'Computer Science',
    mobile: profile.mobile || '',
    email: profile.email || `${profile.name.toLowerCase().replace(/\s+/g, '')}@student.edu`,
    semester: profile.semester || 'Semester VI (Third Year)',
    bio: profile.bio || 'Aspiring software engineer passionate about machine learning systems, full-stack web architectures, and algorithms.',
    targetCareer: profile.targetCareer || 'Full Stack Engineer / AI Specialist',
    skills: profile.skills || 'React, TypeScript, Python, Node.js, SQL, Machine Learning',
    githubUrl: profile.githubUrl || 'https://github.com',
    linkedinUrl: profile.linkedinUrl || 'https://linkedin.com',
    guardianName: profile.guardianName || 'Dr. R. K. Sharma',
    guardianPhone: profile.guardianPhone || '9876500000',
    avatarUrl: profile.avatarUrl || AVATAR_GALLERY[0].url,
  });

  React.useEffect(() => {
    setFormData({
      name: profile.name || '',
      department: profile.department || 'Computer Science',
      mobile: profile.mobile || '',
      email: profile.email || `${profile.name.toLowerCase().replace(/\s+/g, '')}@student.edu`,
      semester: profile.semester || 'Semester VI (Third Year)',
      bio: profile.bio || 'Aspiring software engineer passionate about machine learning systems, full-stack web architectures, and algorithms.',
      targetCareer: profile.targetCareer || 'Full Stack Engineer / AI Specialist',
      skills: profile.skills || 'React, TypeScript, Python, Node.js, SQL, Machine Learning',
      githubUrl: profile.githubUrl || 'https://github.com',
      linkedinUrl: profile.linkedinUrl || 'https://linkedin.com',
      guardianName: profile.guardianName || 'Dr. R. K. Sharma',
      guardianPhone: profile.guardianPhone || '9876500000',
      avatarUrl: profile.avatarUrl || AVATAR_GALLERY[0].url,
    });
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      setSuccessMsg('Profile records synchronized successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-slate-900/95 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 text-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Top Accent Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => {
                setPhotoPickerTab('system-files');
                setIsPhotoPickerOpen(true);
              }}
              className="relative group cursor-pointer"
              title="Click to update profile photo from System Files or Gallery"
            >
              <img 
                src={formData.avatarUrl} 
                alt={formData.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/20 group-hover:border-indigo-400 group-hover:scale-105 transition-all"
              />
              <div className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <Camera className="w-5 h-5 text-cyan-300" />
                <span className="text-[9px] font-bold mt-0.5">Edit</span>
              </div>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 absolute -bottom-1 -right-1 ring-2 ring-slate-950 animate-pulse" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  Student Scholar Profile
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  REG NO: {profile.registerNumber}
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ● Active Enrolled
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">{formData.name || profile.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dept. of {formData.department}</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-slate-400">{formData.semester}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 sm:px-8 border-b border-slate-800/80 bg-slate-950/30 flex gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-2.5">
          {[
            { id: 'identity', label: 'Identity & Contact', icon: User },
            { id: 'academic', label: 'Academic Standing', icon: GraduationCap },
            { id: 'career', label: 'Career & Skills', icon: Briefcase },
            { id: 'idcard', label: 'Digital Student ID', icon: IdCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-500/10 border-b border-emerald-500/30 px-6 py-2.5 text-xs font-bold text-emerald-300 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Body - Tab Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: IDENTITY & CONTACT */}
          {activeTab === 'identity' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" /> Personal & Matriculation Details
                </h3>
                <p className="text-xs text-slate-400">Institutional records and primary contact details for academic communication.</p>
              </div>

              {/* Profile Avatar & Photo Manager (From System Files & Gallery) */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Camera className="w-4 h-4 text-indigo-400" /> Profile Picture & Scholar Avatar
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload directly from your device's System Files or choose from our curated scholar Gallery.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Hidden system file input */}
                    <input 
                      type="file" 
                      ref={directFileInputRef}
                      accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectFile(file);
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => directFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Upload System File</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPickerTab('gallery');
                        setIsPhotoPickerOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Browse Gallery</span>
                    </button>
                  </div>
                </div>

                {/* Dropzone & Preview Row */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Avatar Preview with drag/drop */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingDirect(true);
                    }}
                    onDragLeave={() => setIsDraggingDirect(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingDirect(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleDirectFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => {
                      setPhotoPickerTab('system-files');
                      setIsPhotoPickerOpen(true);
                    }}
                    className={`relative p-2 rounded-2xl border-2 transition-all cursor-pointer group shrink-0 ${
                      isDraggingDirect 
                        ? 'border-cyan-400 bg-cyan-950/40 scale-105' 
                        : 'border-indigo-500/40 bg-slate-900/90 hover:border-indigo-400'
                    }`}
                    title="Drop image here or click to choose from system files / gallery"
                  >
                    <img 
                      src={formData.avatarUrl} 
                      alt="Profile Avatar"
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover" 
                    />
                    {isProcessingDirect ? (
                      <div className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-slate-950/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                        <Upload className="w-4 h-4 text-cyan-300 mb-0.5" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-center">Change</span>
                      </div>
                    )}
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 absolute -bottom-1 -right-1 ring-2 ring-slate-950" />
                  </div>

                  {/* Info + Quick Selection Strip */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Quick Pick from Gallery ({AVATAR_GALLERY.length} available)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPickerTab('gallery');
                          setIsPhotoPickerOpen(true);
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                      >
                        View All Gallery →
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {AVATAR_GALLERY.slice(0, 7).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, avatarUrl: item.url }))}
                          className={`relative rounded-xl overflow-hidden p-0.5 border-2 transition-all cursor-pointer ${
                            formData.avatarUrl === item.url 
                              ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/30' 
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                          title={item.name}
                        >
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            referrerPolicy="no-referrer" 
                            className="w-10 h-10 rounded-[8px] object-cover" 
                          />
                          {formData.avatarUrl === item.url && (
                            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPickerTab('gallery');
                          setIsPhotoPickerOpen(true);
                        }}
                        className="w-10 h-10 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/60 hover:bg-indigo-600/10 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-indigo-300 transition-all cursor-pointer"
                        title="Browse Full Avatar Gallery"
                      >
                        +17
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Register Number (REG NO)
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={profile.registerNumber} 
                      disabled 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono font-bold text-sm cursor-not-allowed opacity-90" 
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-mono">
                      Institutional ID
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Primary key verified with university registrar.</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Candidate Full Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter student full name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-semibold" 
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Department / Stream
                  </label>
                  <select 
                    value={formData.department} 
                    onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-semibold cursor-pointer"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Academic Semester & Cohort
                  </label>
                  <input 
                    type="text" 
                    value={formData.semester} 
                    onChange={e => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                    placeholder="e.g. Semester VI (Third Year)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-semibold" 
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.mobile} 
                      onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-semibold" 
                      required
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="student@institution.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-semibold" 
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Emergency & Guardian Contact */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-indigo-400" /> Guardian & Emergency Contact
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Guardian / Parent Name</label>
                    <input 
                      type="text" 
                      value={formData.guardianName}
                      onChange={e => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
                      placeholder="Parent / Guardian Name"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-medium focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Guardian Contact Phone</label>
                    <input 
                      type="text" 
                      value={formData.guardianPhone}
                      onChange={e => setFormData(prev => ({ ...prev, guardianPhone: e.target.value }))}
                      placeholder="Emergency Phone Number"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-medium focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Synchronizing Profile...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ACADEMIC STANDING */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-400" /> Academic Standing & Metrics
                </h3>
                <p className="text-xs text-slate-400">Current semester performance diagnostics and official university records.</p>
              </div>

              {/* Status Banner */}
              {prediction.isExamPending ? (
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300">Awaiting Semester Examination Conduct</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Your profile is actively registered. Once internal examinations and attendance cycles complete, performance analytics will automatically compute.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Projected Grade</span>
                    <div className="text-2xl font-black text-white font-mono">{prediction.overallPercentage}%</div>
                    <span className="text-[11px] text-indigo-400 font-semibold">{prediction.performanceLevel} Category</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Risk Assessment</span>
                    <div className={`text-2xl font-black font-mono ${
                      prediction.riskLevel === 'Low Risk' ? 'text-emerald-400' :
                      prediction.riskLevel === 'Medium Risk' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {prediction.riskLevel}
                    </div>
                    <span className="text-[11px] text-slate-400">Early Intervention Matrix</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Motivation Index</span>
                    <div className="text-2xl font-black text-cyan-400 font-mono">{prediction.motivationScore}/100</div>
                    <span className="text-[11px] text-slate-400">{prediction.motivationLevel}</span>
                  </div>
                </div>
              )}

              {/* Metric Breakdown Table */}
              <div className="bg-slate-950/60 rounded-2xl border border-slate-800/90 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation Parameter</span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recorded Standing</span>
                </div>
                <div className="divide-y divide-slate-800/60 text-xs">
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-slate-400">Classroom Lecture Attendance</span>
                    <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                      {profile.attendance}%
                    </span>
                  </div>
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-slate-400">Internal Examination Marks</span>
                    <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                      {profile.internalMarks}/100
                    </span>
                  </div>
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-slate-400">Continuous Assessment / Assignments</span>
                    <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                      {profile.assignmentScore}/100
                    </span>
                  </div>
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-slate-400">Dedicated Weekly Self-Study</span>
                    <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                      {profile.studyHours} hrs/week
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAREER & SKILLS */}
          {activeTab === 'career' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" /> Career Aspirations & Technical Portfolio
                </h3>
                <p className="text-xs text-slate-400">Highlight career objectives, technical domains, and portfolio links for faculty placement coordination.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Target Career Role / Industry Focus
                </label>
                <input 
                  type="text" 
                  value={formData.targetCareer} 
                  onChange={e => setFormData(prev => ({ ...prev, targetCareer: e.target.value }))}
                  placeholder="e.g. Full Stack Developer, Machine Learning Engineer, Cloud Architect"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 outline-none text-sm font-semibold" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Professional Bio / Scholar Summary
                </label>
                <textarea 
                  rows={3}
                  value={formData.bio} 
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Brief statement of academic focus, interests, and career aims..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 outline-none text-sm font-normal resize-none" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Technical Skills (Comma Separated)
                </label>
                <input 
                  type="text" 
                  value={formData.skills} 
                  onChange={e => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="e.g. React, Node.js, Python, PostgreSQL, Machine Learning, Docker"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 outline-none text-sm font-semibold font-mono" 
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.skills.split(',').map((s, i) => s.trim() && (
                    <span key={i} className="text-[10px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-md">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    GitHub Profile
                  </label>
                  <div className="relative">
                    <input 
                      type="url" 
                      value={formData.githubUrl} 
                      onChange={e => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder="https://github.com/username"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 outline-none text-sm font-mono" 
                    />
                    <Github className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <input 
                      type="url" 
                      value={formData.linkedinUrl} 
                      onChange={e => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 outline-none text-sm font-mono" 
                    />
                    <Linkedin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Saving Skills...' : 'Update Career Portfolio'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: DIGITAL STUDENT ID CARD */}
          {activeTab === 'idcard' && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="text-center max-w-md">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
                  <IdCard className="w-4 h-4 text-indigo-400" /> Digital Institutional ID Badge
                </h3>
                <p className="text-xs text-slate-400">Cryptographically verifiable student identity for university access and campus services.</p>
              </div>

              {/* ID Badge Card Graphic */}
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-6 rounded-3xl border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                {/* Holographic shimmer line */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600" />

                {/* University Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white tracking-wider uppercase">EduPredict University</div>
                      <div className="text-[9px] text-slate-400 font-mono">Academic ID • Valid 2024-2027</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>

                {/* Photo & Info */}
                <div className="py-5 flex items-center gap-4">
                  <img 
                    src={formData.avatarUrl} 
                    alt={formData.name} 
                    referrerPolicy="no-referrer" 
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shrink-0" 
                  />
                  <div>
                    <h4 className="text-base font-black text-white">{formData.name}</h4>
                    <p className="text-xs text-indigo-300 font-semibold">{formData.department}</p>
                    <div className="mt-2 space-y-0.5 text-[11px] font-mono text-slate-400">
                      <div>REG NO: <span className="text-cyan-400 font-bold">{profile.registerNumber}</span></div>
                      <div>PHONE: <span className="text-slate-300">{formData.mobile}</span></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Barcode / QR Simulation */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-10 h-10 text-indigo-400" />
                    <div className="text-[9px] font-mono text-slate-500 leading-tight">
                      ENC: {profile.registerNumber}#EDU<br />
                      SECURE DIGITAL TOKEN
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400 font-mono">AUTHORIZED SCHOLAR</div>
                    <div className="text-xs font-bold text-slate-200">Session 2026</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer"
                >
                  <IdCard className="w-4 h-4 text-indigo-400" />
                  <span>Print ID Card</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">EduPredict Pro Security Matrix • Encrypted Student Record</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>

      {/* Full Multi-Source Profile Photo Picker Modal (System Files & Gallery) */}
      <ProfilePhotoPickerModal
        isOpen={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        currentAvatarUrl={formData.avatarUrl}
        studentName={formData.name || profile.name}
        registerNumber={profile.registerNumber}
        initialTab={photoPickerTab}
        onSelectAvatar={(url) => {
          setFormData(prev => ({ ...prev, avatarUrl: url }));
          setSuccessMsg('Selected avatar applied to profile!');
          setTimeout(() => setSuccessMsg(null), 3000);
        }}
      />
    </div>
  );
};
