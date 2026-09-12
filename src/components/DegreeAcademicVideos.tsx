import React from 'react';
import { StudentProfile } from '../types';
import { 
  AcademicVideo, 
  DEGREE_ACADEMIC_VIDEOS, 
  DEGREE_LIST, 
  getDegreeVideos 
} from '../data/degreeVideos';
import { 
  Play, Video, Bookmark, CheckCircle, Clock, ExternalLink, 
  Search, Sparkles, Filter, Award, BookOpen, GraduationCap, 
  Flame, X, Check, Share2, Compass, ArrowRight, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  student: StudentProfile;
}

export const DegreeAcademicVideos: React.FC<Props> = ({ student }) => {
  const [selectedDegree, setSelectedDegree] = React.useState<string>(student.department || 'Computer Science');
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'core' | 'future-tech' | 'placement' | 'bookmarked'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeVideo, setActiveVideo] = React.useState<AcademicVideo | null>(null);
  
  // Local persistence for bookmarks & watched videos
  const [bookmarkedIds, setBookmarkedIds] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`academic_bookmarks_${student.registerNumber}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [watchedIds, setWatchedIds] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`academic_watched_${student.registerNumber}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // AI-generated personalized video recommendations state
  const [isAiGenerating, setIsAiGenerating] = React.useState(false);
  const [aiCustomRoadmap, setAiCustomRoadmap] = React.useState<{
    focusArea: string;
    recommendedKeywords: string[];
    advisoryNote: string;
  } | null>(null);

  React.useEffect(() => {
    try {
      localStorage.setItem(`academic_bookmarks_${student.registerNumber}`, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds, student.registerNumber]);

  React.useEffect(() => {
    try {
      localStorage.setItem(`academic_watched_${student.registerNumber}`, JSON.stringify(watchedIds));
    } catch (e) {
      console.error(e);
    }
  }, [watchedIds, student.registerNumber]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleWatched = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Get base videos for the degree
  const degreeMatchedVideos = React.useMemo(() => {
    return getDegreeVideos(selectedDegree);
  }, [selectedDegree]);

  // Filter based on category and search query
  const filteredVideos = React.useMemo(() => {
    return degreeMatchedVideos.filter(video => {
      // Category filter
      if (selectedCategory === 'bookmarked') {
        if (!bookmarkedIds.includes(video.id)) return false;
      } else if (selectedCategory !== 'all' && video.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = video.title.toLowerCase().includes(query);
        const matchesInstructor = video.instructor.toLowerCase().includes(query);
        const matchesInstitution = video.institution.toLowerCase().includes(query);
        const matchesOutcomes = video.learningOutcomes.some(o => o.toLowerCase().includes(query));
        const matchesDesc = video.description.toLowerCase().includes(query);
        return matchesTitle || matchesInstructor || matchesInstitution || matchesOutcomes || matchesDesc;
      }

      return true;
    });
  }, [degreeMatchedVideos, selectedCategory, searchQuery, bookmarkedIds]);

  // AI Personalized Future Video Roadmap generator
  const generateAiVideoRoadmap = async () => {
    setIsAiGenerating(true);
    try {
      // Request AI recommendations endpoint to get updated student weak areas
      const res = await fetch(`/api/student/${student.registerNumber}/recommendations`);
      if (res.ok) {
        const data = await res.json();
        const focusTopic = data?.studyPlan?.[0]?.focusTopic || `${student.department} Advanced Topics`;
        const weakness = data?.aiAnalysis?.weaknesses?.[0] || 'core examination mastery';
        
        setAiCustomRoadmap({
          focusArea: `Future Academic Focus: ${focusTopic}`,
          recommendedKeywords: [focusTopic, `${student.department} Final Year Prep`, 'Placement Coding & Architecture'],
          advisoryNote: `Based on your academic profile in ${student.department} (Internal Marks: ${student.internalMarks}%, Attendance: ${student.attendance}%), we recommend prioritizing these specific lecture series to turn ${weakness.toLowerCase()} into your strongest academic asset.`
        });
      }
    } catch (e) {
      setAiCustomRoadmap({
        focusArea: `Future Academic Focus: ${student.department} Core Engineering`,
        recommendedKeywords: [`${student.department} Foundational Mastery`, 'Industry 4.0 Projects', 'GATE Preparation'],
        advisoryNote: `Structured video modules are calibrated for your degree in ${student.department} to accelerate semester outcomes.`
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const totalWatched = watchedIds.filter(id => degreeMatchedVideos.some(v => v.id === id)).length;
  const progressPct = degreeMatchedVideos.length > 0 
    ? Math.round((totalWatched / degreeMatchedVideos.length) * 100) 
    : 0;

  return (
    <div id="degree-academic-videos" className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden mt-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 relative overflow-hidden border-b border-slate-800/80">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-black tracking-widest uppercase px-3 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1.5">
                <Video className="w-3 h-3 text-indigo-400" />
                Degree Academic Video Hub
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                Tailored for: {student.department}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                {student.semester}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Future Academic & Degree Lectures
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Curated lecture series, MIT & Harvard university archives, NPTEL modules, and industry masterclasses tailored to your degree syllabus and upcoming semesters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateAiVideoRoadmap}
              disabled={isAiGenerating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAiGenerating ? 'animate-spin' : 'text-cyan-200'}`} />
              <span>{isAiGenerating ? 'Synthesizing...' : 'AI Video Pathway'}</span>
            </motion.button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              {progressPct}%
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Degree Video Completion</p>
              <p className="text-[11px] text-slate-400">{totalWatched} of {degreeMatchedVideos.length} degree lectures completed</p>
            </div>
          </div>
          <div className="w-full sm:w-64 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Advisory Note Banner (If generated) */}
      <AnimatePresence>
        {aiCustomRoadmap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-indigo-950/40 border-b border-indigo-500/30 p-6 relative overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <BrainCircuit className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300">
                    {aiCustomRoadmap.focusArea}
                  </h4>
                  <button 
                    onClick={() => setAiCustomRoadmap(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {aiCustomRoadmap.advisoryNote}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {aiCustomRoadmap.recommendedKeywords.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(kw)}
                      className="text-[10px] font-semibold bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Search className="w-2.5 h-2.5" />
                      Filter: {kw}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Degree Selection & Category Filter Controls */}
      <div className="bg-slate-950/60 p-6 border-b border-slate-800/80 space-y-4">
        {/* Degree Selector Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-300">Degree Department:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DEGREE_LIST.map((deg) => {
              const isCurrentStudentDegree = student.department?.toUpperCase().includes(deg.toUpperCase());
              const isSelected = selectedDegree === deg;
              return (
                <button
                  key={deg}
                  onClick={() => setSelectedDegree(deg)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {deg}
                  {isCurrentStudentDegree && (
                    <span className="ml-1 text-[9px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded-full">
                      My Degree
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Lectures', icon: BookOpen },
              { id: 'core', label: 'Core Syllabus', icon: Award },
              { id: 'future-tech', label: 'Future-Tech & AI', icon: Flame },
              { id: 'placement', label: 'Interviews & Placement', icon: Compass },
              { id: 'bookmarked', label: `Saved (${bookmarkedIds.length})`, icon: Bookmark },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                      : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, MIT, Stanford, algorithms..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="p-6 sm:p-8">
        {filteredVideos.length === 0 ? (
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Video className="w-12 h-12 text-slate-600 mb-3" />
            <h4 className="text-sm font-black text-white">No Lecture Videos Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {selectedCategory === 'bookmarked'
                ? 'You have not bookmarked any lecture videos yet. Click the bookmark icon on any video to save it.'
                : 'Try adjusting your search query or selecting a different category.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const isBookmarked = bookmarkedIds.includes(video.id);
              const isWatched = watchedIds.includes(video.id);

              return (
                <div
                  key={video.id}
                  className="bg-slate-950/60 border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group relative"
                >
                  {/* Thumbnail / Video Preview area */}
                  <div 
                    onClick={() => setActiveVideo(video)}
                    className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Floating Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/90 group-hover:bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-black/60 group-hover:scale-110 transition-all duration-300">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Platform & Duration Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-cyan-300 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                        {video.platform}
                      </span>
                    </div>

                    {/* Quick action buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleBookmark(video.id, e)}
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Video'}
                        className={`p-1.5 rounded-lg backdrop-blur-md border transition-all cursor-pointer ${
                          isBookmarked 
                            ? 'bg-amber-500 text-slate-950 border-amber-400' 
                            : 'bg-slate-950/70 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => toggleWatched(video.id, e)}
                        title={isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
                        className={`p-1.5 rounded-lg backdrop-blur-md border transition-all cursor-pointer ${
                          isWatched 
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                            : 'bg-slate-950/70 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    {/* Bottom Metadata inside thumbnail */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                      <span className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {video.duration}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-sans font-bold text-[10px] ${
                        video.difficulty === 'Beginner' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' :
                        video.difficulty === 'Intermediate' ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' :
                        'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      }`}>
                        {video.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Semester badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
                          {video.semesterRelevance}
                        </span>
                        {isWatched && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Watched
                          </span>
                        )}
                      </div>

                      <h4 
                        onClick={() => setActiveVideo(video)}
                        className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors leading-snug cursor-pointer mb-2 line-clamp-2"
                      >
                        {video.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
                        <span className="text-slate-300 font-semibold">{video.instructor}</span>
                        <span>•</span>
                        <span>{video.institution}</span>
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {video.description}
                      </p>
                    </div>

                    {/* Key Outcomes */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-800/80 mb-4">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                        Core Takeaways:
                      </span>
                      {video.learningOutcomes.slice(0, 2).map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300 leading-tight">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{outcome}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => setActiveVideo(video)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Watch Inside
                      </button>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.searchQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all border border-slate-800 hover:border-slate-700"
                      >
                        YouTube
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/80 flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">
                      {activeVideo.platform} • {activeVideo.degree}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white line-clamp-1">
                      {activeVideo.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Embedded Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Modal Details Body */}
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white">{activeVideo.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Instructed by <strong className="text-slate-200">{activeVideo.instructor}</strong> ({activeVideo.institution})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWatched(activeVideo.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        watchedIds.includes(activeVideo.id)
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {watchedIds.includes(activeVideo.id) ? 'Completed' : 'Mark Watched'}
                    </button>
                    <button
                      onClick={() => toggleBookmark(activeVideo.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        bookmarkedIds.includes(activeVideo.id)
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={bookmarkedIds.includes(activeVideo.id) ? 'currentColor' : 'none'} />
                      {bookmarkedIds.includes(activeVideo.id) ? 'Saved' : 'Bookmark'}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Lecture Description</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeVideo.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Key Academic Learning Outcomes & Syllabus Milestones
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeVideo.learningOutcomes.map((outcome, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-300 leading-relaxed">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Relevance: <strong>{activeVideo.semesterRelevance}</strong></span>
                    <span>•</span>
                    <span>Duration: <strong>{activeVideo.duration}</strong></span>
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeVideo.searchQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    Open in YouTube Search <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
