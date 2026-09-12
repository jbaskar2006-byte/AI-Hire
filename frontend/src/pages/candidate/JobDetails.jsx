import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getJobById } from '../../services/jobService';
import { applyForJob as submitApplication } from '../../services/applicationService';
import { getMatchScore } from '../../services/matchService';
import { 
  Building, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Code, 
  Globe, 
  Share2, 
  AlertCircle,
  Send
} from 'lucide-react';

export const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await getJobById(jobId);
        setJob(data);
        setHasApplied(data.has_applied || false);

        if (user && user.role === 'candidate') {
          getMatchScore(jobId, user.id)
            .then(res => setMatchData(res))
            .catch(err => console.log("AI match score fetch:", err));
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
        showToast('Failed to load job details', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, user]);

  const handleApply = async () => {
    if (!user) {
      showToast('Please log in as a candidate to apply', 'info');
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      showToast('Recruiters cannot apply for jobs', 'error');
      return;
    }
    if (hasApplied) {
      showToast('You have already applied for this job', 'info');
      return;
    }

    setApplying(true);
    try {
      await submitApplication(jobId);
      showToast('Application submitted successfully!', 'success');
      setHasApplied(true);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit application';
      showToast(msg, 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-6">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Fetching job specification details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-center flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Job Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          The requested job position does not exist or has been removed by the recruiter.
        </p>
        <Link 
          to="/candidate/jobs"
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  const reqSkills = job.skills?.filter(s => s.skill_type === 'required') || [];
  const prefSkills = job.skills?.filter(s => s.skill_type === 'preferred') || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 space-y-8 font-sans">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Search</span>
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            showToast('Job link copied to clipboard!', 'info');
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2-Columns: Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  {job.company?.name ? job.company.name.charAt(0).toUpperCase() : <Building className="w-7 h-7" />}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {job.title}
                  </h1>
                  <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{job.company?.name || 'Company'}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  {job.job_type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  job.status === 'active' 
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {job.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Location</span>
                <span className="font-bold text-white flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {job.location}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Experience</span>
                <span className="font-bold text-white flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  {job.min_experience}+ Years
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Salary Range</span>
                <span className="font-bold text-emerald-300 flex items-center gap-1 mt-1 truncate">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  {job.salary_min && job.salary_max
                    ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                    : 'Negotiable'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Deadline</span>
                <span className="font-bold text-amber-300 flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'}
                </span>
              </div>
            </div>
          </div>

          {/* Candidate AI Match Breakdown Card */}
          {matchData && (
            <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Your AI Job Match Score</h3>
                    <p className="text-[11px] text-slate-400">
                      {matchData.explanation || "Your score is based on skills, experience, education and resume relevance."}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-extrabold text-white">{matchData.final_score}%</span>
                  <span className="text-[10px] text-indigo-300 block font-semibold">Match Score</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Skill Match</span>
                  <span className="text-sm font-bold text-indigo-400">{matchData.skill_score}%</span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Experience</span>
                  <span className="text-sm font-bold text-blue-400">{matchData.experience_score}%</span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Education</span>
                  <span className="text-sm font-bold text-purple-400">{matchData.education_score}%</span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Similarity</span>
                  <span className="text-sm font-bold text-teal-400">{matchData.similarity_score}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Job Description */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Job Description & Responsibilities
            </h3>
            <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {job.description}
            </div>
          </div>

          {/* Required & Preferred Skills Matrix */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" />
              Required & Preferred Skill Matrix
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
                  Required Technical Skills
                </h4>
                {reqSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {reqSkills.map((s, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold">
                        {s.skill_name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No specific required skills listed.</p>
                )}
              </div>

              {prefSkills.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2.5">
                    Preferred / Nice-to-Have Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {prefSkills.map((s, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold">
                        {s.skill_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right 1-Column: Company Sidebar & Application Widget */}
        <div className="space-y-8">
          
          {/* Apply Widget Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 space-y-6 sticky top-24 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Apply For This Job</h3>
              <p className="text-xs text-slate-400">
                Submit your profile and resume details directly to the recruiter.
              </p>
            </div>

            {hasApplied ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-300">Application Submitted</h4>
                <p className="text-xs text-slate-300">
                  You have successfully applied for this job position. Track status in My Applications.
                </p>
                <Link
                  to="/candidate/applications"
                  className="inline-block mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl transition-all"
                >
                  View My Applications
                </Link>
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying || job.status !== 'active'}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {applying ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
            )}

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>Applicants:</span>
                <strong className="text-white">{job.applications_count || 0}</strong>
              </div>
              <div className="flex justify-between">
                <span>Posted On:</span>
                <strong className="text-white">{new Date(job.created_at).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>

          {/* Company Card */}
          {job.company && (
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About Company</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-sm border border-slate-700">
                  {job.company.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{job.company.name}</h4>
                  <p className="text-xs text-slate-400">{job.company.industry || 'Technology'}</p>
                </div>
              </div>

              {job.company.location && (
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.company.location}</span>
                </p>
              )}

              {job.company.website && (
                <a
                  href={job.company.website.startsWith('http') ? job.company.website : `https://${job.company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 pt-2 border-t border-slate-800"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Website</span>
                </a>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default JobDetails;
