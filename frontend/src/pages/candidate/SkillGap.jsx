import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Sparkles, 
  RefreshCw, 
  Briefcase, 
  ArrowLeft, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { getSkillGap } from '../../services/recommendationService';
import { getAllJobs } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';

export default function SkillGap() {
  const { jobId: urlJobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(urlJobId ? parseInt(urlJobId) : '');
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const extractErrorMsg = (err, fallback) => {
    const detail = err.response?.data?.detail;
    if (!detail) return err.message || fallback;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const item = detail[0];
      return typeof item === 'string' ? item : (item.msg || JSON.stringify(item));
    }
    if (typeof detail === 'object' && detail !== null) {
      return detail.message || detail.msg || JSON.stringify(detail);
    }
    return fallback;
  };

  useEffect(() => {
    fetchJobsList();
  }, []);

  useEffect(() => {
    if (selectedJobId && user) {
      fetchGapAnalysis(selectedJobId);
    } else if (!selectedJobId) {
      setLoading(false);
    }
  }, [selectedJobId, user]);

  const fetchJobsList = async () => {
    try {
      const res = await getAllJobs();
      const jobList = Array.isArray(res) ? res : (res?.items || res?.jobs || []);
      setJobs(jobList);
      if (!selectedJobId && jobList.length > 0) {
        setSelectedJobId(jobList[0].id);
      } else if (!selectedJobId) {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load jobs list for skill gap:", err);
      setLoading(false);
    }
  };

  const fetchGapAnalysis = async (jobIdToFetch) => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await getSkillGap(jobIdToFetch, user.id);
      setGapData(res);
    } catch (err) {
      console.error("Failed to load skill gap data:", err);
      const detail = extractErrorMsg(err, "Failed to analyze skill gap for this position.");
      setErrorMessage(detail);
      setGapData(null);
    } finally {
      setLoading(false);
    }
  };

  const getCoverageColor = (coverage) => {
    if (coverage >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (coverage >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950/80 via-emerald-950/60 to-slate-950 text-white p-8 border border-emerald-500/20 shadow-xl">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="/images/skill_gap_analysis.png" 
            alt="AI Skill Gap Radar Analysis" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" /> AI Skill Gap Analysis
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Skill Coverage & Recommendations
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Identify matched vs missing skills for target software engineering roles and receive personalized learning advice.
            </p>
          </div>

          {/* Job Selection Controls */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(parseInt(e.target.value))}
              className="bg-slate-900/90 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 min-w-[240px]"
            >
              <option value="" disabled>Select Target Position...</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => selectedJobId && fetchGapAnalysis(selectedJobId)}
              disabled={loading || !selectedJobId}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Re-Analyze Gap
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Main Body */}
      {loading ? (
        <div className="p-16 border border-slate-800 rounded-2xl bg-slate-900/40 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
          Analyzing required skills & evaluating skill gap coverage...
        </div>
      ) : !gapData ? (
        <div className="p-16 border border-slate-800 rounded-2xl bg-slate-900/40 text-center">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No Position Selected</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
            Please select a target job position above to compute skill gap coverage and learning recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Skill Coverage Score Bar Card */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Target Role: {gapData.job_title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Required skill fulfillment index evaluated against your candidate skill matrix.
                </p>
              </div>

              <div className={`px-4 py-2 rounded-2xl border font-extrabold text-xl ${getCoverageColor(gapData.skill_coverage)}`}>
                {gapData.skill_coverage}% Skill Coverage
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${gapData.skill_coverage}%` }}
              />
            </div>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills (✓) */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Satisfied Skills ({gapData.matched_skills.length})
              </h3>
              {gapData.matched_skills && gapData.matched_skills.length > 0 ? (
                <div className="space-y-2">
                  {gapData.matched_skills.map((skill, idx) => (
                    <div key={idx} className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-xs font-semibold text-emerald-300">
                      <span className="text-emerald-400 font-extrabold text-sm">✓</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No matching job skills satisfied yet.</p>
              )}
            </div>

            {/* Missing Skills (✗) */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2 border-b border-slate-800 pb-3">
                <XCircle className="w-5 h-5 text-rose-400" />
                Missing Skill Gaps ({gapData.missing_skills.length})
              </h3>
              {gapData.missing_skills && gapData.missing_skills.length > 0 ? (
                <div className="space-y-2">
                  {gapData.missing_skills.map((skill, idx) => (
                    <div key={idx} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-xs font-semibold text-rose-300">
                      <span className="text-rose-400 font-extrabold text-sm">✗</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium">
                  🎉 Excellent! You satisfy all required technical skills for this job position!
                </div>
              )}
            </div>
          </div>

          {/* Learning Recommendations Cards */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Tailored Learning Recommendations
            </h3>

            {gapData.learning_recommendations && gapData.learning_recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gapData.learning_recommendations.map((rec, idx) => (
                  <div key={idx} className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2.5 hover:border-indigo-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        Missing Skill: <span className="text-indigo-300">{rec.skill_name}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.skill_type === 'Required' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {rec.skill_type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      <strong className="text-slate-200">Recommendation:</strong> {rec.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No missing skills detected! You are fully qualified for this job role.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
