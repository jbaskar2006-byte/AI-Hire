import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  Building, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle,
  Code,
  Send
} from 'lucide-react';
import { getRecommendedJobs } from '../../services/recommendationService';
import { applyForJob } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';

export default function Recommendations() {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [recommendationsData, setRecommendationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
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
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await getRecommendedJobs();
      setRecommendationsData(res);
    } catch (err) {
      console.error("Failed to load job recommendations:", err);
      const detail = extractErrorMsg(err, "Failed to load job recommendations.");
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApply = async (jobId) => {
    setApplyingJobId(jobId);
    try {
      await applyForJob(jobId);
      showToast("Application submitted successfully!", "success");
      // Refresh recommendations list to reflect applied status
      fetchRecommendations();
    } catch (err) {
      const detail = extractErrorMsg(err, "Failed to submit application.");
      showToast(detail, "error");
    } finally {
      setApplyingJobId(null);
    }
  };

  const getMatchBadgeColor = (score) => {
    if (score >= 85) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 70) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-950 text-white p-8 border border-indigo-500/20 shadow-xl">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="./images/recommendations_job_feed.png" 
            alt="AI Smart Job Feed" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tailored For You
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              AI Job Recommendations
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Job requisitions matched specifically against your candidate skills, experience years, education, and parsed resume text.
            </p>
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/25 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Recommendations
          </button>
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
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-3" />
          Evaluating active job positions against your candidate profile...
        </div>
      ) : !recommendationsData || !recommendationsData.recommendations || recommendationsData.recommendations.length === 0 ? (
        <div className="p-16 border border-slate-800 rounded-2xl bg-slate-900/40 text-center">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No Active Job Openings</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
            There are currently no active job requisitions published in the system to recommend.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Showing top {recommendationsData.total_recommendations} job recommendations for {user?.name || 'Candidate'}</span>
          </div>

          {/* Job Recommendation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendationsData.recommendations.map((job) => (
              <div 
                key={job.job_id}
                className="bg-slate-900/70 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group"
              >
                <div className="space-y-4">
                  {/* Card Top: Title & Match Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-purple-400 flex items-center gap-1.5 mt-1">
                        <Building className="w-3.5 h-3.5" />
                        <span>{job.company_name}</span>
                        <span>•</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {job.location}
                        </span>
                      </p>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1 shrink-0 ${getMatchBadgeColor(job.match_score)}`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Match: {job.match_score}%</span>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-medium">
                      {job.job_type}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" /> {job.min_experience}+ Yrs Exp
                    </span>
                    {job.salary_min && job.salary_max && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-medium text-emerald-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Skill Coverage Progress */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-xs font-medium text-slate-400">
                      <span>Skill Coverage</span>
                      <span className="text-purple-300 font-bold">{job.skill_coverage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                        style={{ width: `${job.skill_coverage}%` }}
                      />
                    </div>
                  </div>

                  {/* Matched Skills Pills */}
                  {job.matched_skills && job.matched_skills.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Satisfied Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.matched_skills.slice(0, 5).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
                            ✓ {s}
                          </span>
                        ))}
                        {job.matched_skills.length > 5 && (
                          <span className="text-[10px] text-slate-500 self-center">+{job.matched_skills.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 gap-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/candidate/jobs/${job.job_id}`}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                    >
                      View Job
                    </Link>
                    <Link
                      to={`/candidate/skill-gap/${job.job_id}`}
                      className="px-3.5 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-xl text-xs font-semibold transition"
                    >
                      Skill Gap Analysis
                    </Link>
                  </div>

                  {job.has_applied ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleQuickApply(job.job_id)}
                      disabled={applyingJobId === job.job_id}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/25 transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{applyingJobId === job.job_id ? 'Applying...' : 'Apply Now'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
