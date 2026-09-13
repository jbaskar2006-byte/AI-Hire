import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BrainCircuit, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderGit2, 
  Award, 
  Clock, 
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { uploadResume, getLatestResume, getResumeHistory } from '../../services/resumeService';
import { useAuth } from '../../context/AuthContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];

export default function Resume() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [latestResume, setLatestResume] = useState(null);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'history'

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [latestRes, historyRes] = await Promise.all([
        getLatestResume().catch(() => ({ resume: null })),
        getResumeHistory().catch(() => ({ resumes: [] }))
      ]);

      if (latestRes && latestRes.resume) {
        setLatestResume(latestRes.resume);
      } else {
        setLatestResume(null);
      }

      if (historyRes && historyRes.resumes) {
        setResumeHistory(historyRes.resumes);
      }
    } catch (err) {
      console.error("Error fetching resume data:", err);
      setErrorMessage("Failed to load resume details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return "No file selected.";
    const ext = "." + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Invalid file format (${ext}). Only PDF (.pdf) and Word (.docx) files are supported.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).`;
    }
    return null;
  };

  const handleFileSelect = (file) => {
    setErrorMessage('');
    setSuccessMessage('');
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    performUpload(file);
  };

  const performUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });

      setSuccessMessage("Resume uploaded and analyzed successfully! Profile skills updated.");
      if (res && res.resume) {
        setLatestResume(res.resume);
        setActiveTab('analysis');
      }
      // Refresh history
      fetchResumeData();
    } catch (err) {
      console.error("Resume upload failed:", err);
      const detail = err.response?.data?.detail || "Upload failed. Please check the file and try again.";
      setErrorMessage(detail);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white p-8 shadow-xl border border-blue-500/20">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="./images/resume_builder_ai.png" 
            alt="AI Resume Optimizer Engine" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> AI Resume Engine
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Resume Analysis & Parser
            </h1>
            <p className="mt-2 text-blue-200 max-w-2xl text-sm sm:text-base">
              Upload your latest resume to automatically parse skills, experience, education, and enhance your candidate profile completeness.
            </p>
          </div>
          <button
            onClick={fetchResumeData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-medium transition backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="flex-1">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="flex-1">{successMessage}</p>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' 
            : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf,.docx" 
          className="hidden" 
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <UploadCloud className="w-10 h-10 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Drag & Drop your resume here, or <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-400 hover:text-blue-300 underline font-semibold focus:outline-none"
              >
                browse files
              </button>
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Supports <span className="font-semibold text-slate-300">PDF (.pdf)</span> and <span className="font-semibold text-slate-300">Word (.docx)</span> up to 10 MB.
            </p>
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="w-full max-w-md space-y-2 mt-4">
              <div className="flex justify-between text-xs text-blue-300 font-medium">
                <span>Uploading & Parsing Resume...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-8">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            AI Resume Analysis
            {latestResume && (
              <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                Latest
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Upload History ({resumeHistory.length})
          </button>
        </div>

        {/* Tab 1: AI Analysis */}
        {activeTab === 'analysis' && (
          <div>
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
                Loading resume analysis...
              </div>
            ) : !latestResume ? (
              <div className="p-12 border border-slate-800 rounded-2xl bg-slate-900/40 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white">No Resume Uploaded Yet</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mt-1 mb-4">
                  Upload your resume above to get instant AI-extracted skills, education details, and section insights.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 transition"
                >
                  Upload Resume Now
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Resume File Overview Meta */}
                <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                      <FileCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        {latestResume.original_filename}
                        <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md font-medium uppercase">
                          {latestResume.file_type}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>Size: {formatFileSize(latestResume.file_size)}</span>
                        <span>•</span>
                        <span>Uploaded: {formatDate(latestResume.uploaded_at)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-300">
                      Total Skills Extracted: <strong className="text-white text-sm">{latestResume.total_skills_count || 0}</strong>
                    </span>
                  </div>
                </div>

                {/* Personal Information & Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-slate-400">Extracted Name</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {latestResume.personal_info?.name || user?.name || "Candidate"}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-slate-400">Extracted Email</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {latestResume.personal_info?.email || user?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-slate-400">Extracted Phone</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {latestResume.personal_info?.phone || "Not specified in resume"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Categorized Skills Section */}
                <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    Extracted Skills Matrix
                  </h3>

                  {latestResume.skills_by_category && Object.keys(latestResume.skills_by_category).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(latestResume.skills_by_category).map(([cat, skills]) => (
                        <div key={cat} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl space-y-2">
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                            <span>{cat}</span>
                            <span className="text-slate-500 text-[10px]">{skills.length} skills</span>
                          </h4>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {skills.map((skill) => (
                              <span 
                                key={skill}
                                className="px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : latestResume.all_extracted_skills && latestResume.all_extracted_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {latestResume.all_extracted_skills.map((skill) => (
                        <span 
                          key={skill}
                          className="px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No specific technical skills identified in resume text.</p>
                  )}
                </div>

                {/* Grid: Education & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Education */}
                  <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                      Education
                    </h3>
                    {latestResume.education && latestResume.education.length > 0 ? (
                      <ul className="space-y-2">
                        {latestResume.education.map((edu, idx) => (
                          <li key={idx} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs text-slate-200">
                            {edu}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No explicit degree / education details detected.</p>
                    )}
                  </div>

                  {/* Work Experience */}
                  <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                      Work Experience & Roles
                    </h3>
                    {latestResume.experience && latestResume.experience.length > 0 ? (
                      <ul className="space-y-2">
                        {latestResume.experience.map((exp, idx) => (
                          <li key={idx} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs text-slate-200">
                            {exp}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No work experience lines parsed.</p>
                    )}
                  </div>
                </div>

                {/* Grid: Projects & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Projects */}
                  <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <FolderGit2 className="w-5 h-5 text-purple-400" />
                      Extracted Projects
                    </h3>
                    {latestResume.projects && latestResume.projects.length > 0 ? (
                      <ul className="space-y-2">
                        {latestResume.projects.map((proj, idx) => (
                          <li key={idx} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs text-slate-200">
                            {proj}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No projects explicitly referenced.</p>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      Certifications
                    </h3>
                    {latestResume.certifications && latestResume.certifications.length > 0 ? (
                      <ul className="space-y-2">
                        {latestResume.certifications.map((cert, idx) => (
                          <li key={idx} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs text-slate-200">
                            {cert}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No certifications found in resume text.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload History */}
        {activeTab === 'history' && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Resume Version History</h3>
            {resumeHistory.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No uploaded resume history recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                    <tr>
                      <th className="p-3">File Name</th>
                      <th className="p-3">Format</th>
                      <th className="p-3">Size</th>
                      <th className="p-3">Skills Parsed</th>
                      <th className="p-3">Analysis Status</th>
                      <th className="p-3">Uploaded At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {resumeHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 font-semibold text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          {item.original_filename}
                        </td>
                        <td className="p-3 uppercase">{item.file_type}</td>
                        <td className="p-3">{formatFileSize(item.file_size)}</td>
                        <td className="p-3 font-bold text-blue-400">{item.extracted_skills_count}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {item.analysis_status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{formatDate(item.uploaded_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
