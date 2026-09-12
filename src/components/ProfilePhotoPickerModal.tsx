import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, Image as ImageIcon, Camera, Check, CheckCircle2, 
  RefreshCw, FolderOpen, AlertCircle, Trash2, Search, 
  Sparkles, ShieldCheck, ArrowRight, Laptop, Film, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AVATAR_GALLERY, GalleryAvatar } from '../data/avatarGallery';
import { processImageFile } from '../utils/imageUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string;
  studentName: string;
  registerNumber: string;
  onSelectAvatar: (url: string) => Promise<void> | void;
  isLoading?: boolean;
  initialTab?: 'system-files' | 'gallery' | 'camera' | 'web-url';
}

type ModeTab = 'system-files' | 'gallery' | 'camera' | 'web-url';

export const ProfilePhotoPickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  studentName,
  registerNumber,
  onSelectAvatar,
  isLoading = false,
  initialTab = 'system-files'
}) => {
  const [activeTab, setActiveTab] = useState<ModeTab>(initialTab);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(currentAvatarUrl || AVATAR_GALLERY[0].url);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{ name: string; size: string; resolution: string } | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'scholars' | 'tech' | 'campus' | 'abstract'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [urlPreviewError, setUrlPreviewError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Camera capture states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'system-files');
      setSelectedAvatarUrl(currentAvatarUrl || AVATAR_GALLERY[0].url);
      setErrorMessage(null);
      setAppliedNotice(false);
    } else {
      stopCamera();
    }
  }, [isOpen, currentAvatarUrl, initialTab]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraError(null);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access denied:', err);
      setCameraError('Camera access not granted or unavailable on this device. You can upload an image from System Files instead.');
      setCameraActive(false);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const size = Math.min(video.videoWidth || 512, video.videoHeight || 512);
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const sx = ((video.videoWidth || 512) - size) / 2;
      const sy = ((video.videoHeight || 512) - size) / 2;

      ctx.drawImage(video, sx, sy, size, size, 0, 0, 512, 512);
      const snapshotUrl = canvas.toDataURL('image/jpeg', 0.9);

      setSelectedAvatarUrl(snapshotUrl);
      setSelectedFileMeta({
        name: `Webcam_Snapshot_${Date.now()}.jpg`,
        size: '~120 KB',
        resolution: '512 x 512'
      });
      stopCamera();
      setActiveTab('system-files');
    } catch (e) {
      console.error('Failed to capture snapshot', e);
    }
  };

  if (!isOpen) return null;

  const handleFilePicked = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG).');
      return;
    }

    setProcessingFile(true);
    setErrorMessage(null);

    try {
      const result = await processImageFile(file);
      setSelectedAvatarUrl(result.dataUrl);
      setSelectedFileMeta({
        name: file.name,
        size: `${result.sizeKb} KB`,
        resolution: `${result.width} × ${result.height} px (Optimized)`
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing selected system file.');
    } finally {
      setProcessingFile(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFilePicked(file);
    }
  };

  const handleApply = async () => {
    if (!selectedAvatarUrl) return;
    try {
      await onSelectAvatar(selectedAvatarUrl);
      setAppliedNotice(true);
      setTimeout(() => {
        setAppliedNotice(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to apply avatar:', err);
    }
  };

  const filteredGallery = AVATAR_GALLERY.filter(item => {
    const matchesCategory = galleryCategory === 'all' || item.category === galleryCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl bg-slate-900/98 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-4 text-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">Student Profile Photo</h3>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  {registerNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose a photo from your <span className="text-indigo-300 font-semibold">System Files</span> or pick from our curated <span className="text-cyan-300 font-semibold">Gallery</span>.
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

        {/* Mode Tabs */}
        <div className="px-5 sm:px-6 border-b border-slate-800 bg-slate-950/40 flex gap-2 overflow-x-auto py-2.5 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('system-files');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'system-files'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>From System Files</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('gallery');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Curated Gallery ({AVATAR_GALLERY.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              startCamera();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'camera'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Webcam Snapshot</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('web-url');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'web-url'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Direct Web URL</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-rose-500/10 border-b border-rose-500/30 px-6 py-2.5 text-xs text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Main Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: FROM SYSTEM FILES */}
          {activeTab === 'system-files' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Local System File Upload</h4>
                    <p className="text-xs text-slate-400">
                      Upload any image from your computer, phone gallery, downloads, or local storage.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  JPG, PNG, WEBP, SVG
                </span>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center group ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-950/30 scale-[0.99]'
                    : 'border-slate-700/80 hover:border-indigo-500/80 bg-slate-950/50 hover:bg-slate-900/60'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFilePicked(file);
                  }}
                />

                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all mb-4 shadow-lg shadow-indigo-600/10">
                  <Upload className="w-7 h-7" />
                </div>

                <h5 className="text-base font-bold text-white mb-1">
                  Drag & Drop Profile Picture Here
                </h5>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  or click to browse files on your device. Images are automatically center-cropped to a crisp scholar avatar.
                </p>

                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Browse System Files</span>
                </button>
              </div>

              {/* Selected File Details / Processing */}
              {processingFile && (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3 text-xs text-cyan-300">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Processing and optimizing image from system file...</span>
                </div>
              )}

              {selectedFileMeta && (
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200 truncate max-w-[220px] sm:max-w-xs">{selectedFileMeta.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {selectedFileMeta.size} • {selectedFileMeta.resolution}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Ready to Apply
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURATED GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-5">
              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All Photos' },
                    { id: 'scholars', label: '🎓 Scholars' },
                    { id: 'tech', label: '💻 Tech & Coders' },
                    { id: 'campus', label: '🏛️ Campus & Labs' },
                    { id: 'abstract', label: '⚡ Insignias' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGalleryCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        galleryCategory === cat.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gallery..."
                    className="w-full sm:w-48 pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {filteredGallery.map((item) => {
                  const isSelected = selectedAvatarUrl === item.url;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedAvatarUrl(item.url);
                        setSelectedFileMeta(null);
                      }}
                      className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer p-1 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-500/20 scale-[1.02]'
                          : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square w-full rounded-xl overflow-hidden relative">
                        <img 
                          src={item.url} 
                          alt={item.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: WEBCAM SNAPSHOT */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                {cameraActive ? (
                  <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-2xl">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border border-cyan-400/40 rounded-2xl pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Live Camera Snapshot</h4>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">
                        Use your device's built-in webcam or camera to take a real-time scholar profile photo.
                      </p>
                    </div>
                    {cameraError && (
                      <p className="text-xs text-rose-400 max-w-sm bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                        {cameraError}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Start Camera</span>
                    </button>
                  </div>
                )}

                {cameraActive && (
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={handleCaptureSnapshot}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Snap Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DIRECT WEB URL */}
          {activeTab === 'web-url' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  Image Web URL (HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => {
                      setCustomUrlInput(e.target.value);
                      setUrlPreviewError(false);
                    }}
                    placeholder="https://example.com/my-photo.jpg or GitHub avatar URL"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput.trim()) {
                        setSelectedAvatarUrl(customUrlInput.trim());
                        setSelectedFileMeta({
                          name: 'Web Image Link',
                          size: 'Remote CDN',
                          resolution: 'Auto scaled'
                        });
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Load
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Tip: You can use your GitHub avatar like <span className="font-mono text-cyan-400">https://github.com/username.png</span>
                </p>
              </div>
            </div>
          )}

          {/* Current Selection Preview & Live ID Card preview */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={selectedAvatarUrl} 
                  alt="Selected Avatar Preview" 
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-400/20"
                />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 absolute -bottom-1 -right-1 ring-2 ring-slate-950" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Active Selected Avatar
                </span>
                <p className="text-sm font-black text-white">{studentName}</p>
                <p className="text-xs text-slate-400 font-mono">ID: {registerNumber}</p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Scholar Format</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading || !selectedAvatarUrl}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
              appliedNotice
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/25'
            } disabled:opacity-50`}
          >
            {appliedNotice ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Photo Applied!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Set as Profile Picture'}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
