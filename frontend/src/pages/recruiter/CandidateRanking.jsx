import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Sparkles, 
  Briefcase, 
  User, 
  RefreshCw, 
  Filter, 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  X,
  Code,
  Info
} from 'lucide-react';
import { getRankedCandidates, calculateMatch } from '../../services/matchService';
import recruiterService from '../../services/recruiterService';

export default function CandidateRanking() {
  const { jobId: urlJobId } = useParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(urlJobId ? parseInt(urlJobId) : '');
  const [rankingData, setRankingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedCandidateModal, setSelectedCandidateModal] = useState(null);
  const [sortBy, setSortBy] = useState('final_score'); // 'final_score' | 'skill_score' | 'experience_score'

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchRankings(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchRecruiterJobs = async () => {
    try {
      const jobList = await recruiterService.getJobs();
      setJobs(jobList || []);
      if (!selectedJobId && jobList && jobList.length > 0) {
        setSelectedJobId(jobList[0].id);
      }
    } catch (err) {
      console.error("Failed to load recruiter jobs:", err);
    }
  };

  const fetchRankings = async (jobIdToFetch) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await getRankedCandidates(jobIdToFetch);
      setRankingData(res);
    } catch (err) {
      console.error("Failed to fetch candidate rankings:", err);
      const detail = err.response?.data?.detail || "Failed to load candidate rankings for this job.";
      setErrorMessage(detail);
      setRankingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateAll = async () => {
    if (!selectedJobId || !rankingData || !rankingData.rankings) return;
    setCalculating(true);
    setErrorMessage('');
    try {
      await Promise.all(
        rankingData.rankings.map(c => calculateMatch(selectedJobId, c.candidate_id).catch(() => null))
      );
      await fetchRankings(selectedJobId);
    } catch (err) {
      console.error("Recalculation error:", err);
      setErrorMessage("Failed to recalculate some candidate scores.");
    } finally {
      setCalculating(false);
    }
  };

  const sortedRankings = React.useMemo(() => {
    if (!rankingData || !rankingData.rankings) return [];
    return [...rankingData.rankings].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [rankingData, sortBy]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (score >= 45) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-8 border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> AI Candidate Scoring & Ranking
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              AI Candidate Ranking
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Rank candidates based on weighted multi-factor AI scoring (Skill Match 40%, Experience 20%, Education 10%, Resume Similarity 30%).
            </p>
          </div>

          {/* Job Selector Dropdown */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(parseInt(e.target.value))}
              className="bg-slate-900/90 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 min-w-[220px]"
            >
              <option value="" disabled>Select Job Position...</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.status})
                </option>
              ))}
            </select>

            <button
              onClick={handleRecalculateAll}
              disabled={calculating || loading || !selectedJobId}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${calculating ? 'animate-spin' : ''}`} />
              Recalculate AI Rankings
            </button>
          </div>
        </div>
      </div>

      {/* Responsible AI Mandatory Disclaimer Banner */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-amber-300 text-xs sm:text-sm">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400" />
        <p className="flex-1 font-medium">
          <strong className="font-semibold text-white">Responsible AI Disclaimer:</strong> AI Recommendation – Final hiring decision remains with the recruiter. Demographics (gender, age, race, religion, photo) are strictly excluded from score calculations.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Main Content & Table */}
      {loading ? (
        <div className="p-16 border border-slate-800 rounded-2xl bg-slate-900/40 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-3" />
          Evaluating AI candidate rankings & matrix...
        </div>
      ) : !rankingData || !rankingData.rankings || rankingData.rankings.length === 0 ? (
        <div className="p-16 border border-slate-800 rounded-2xl bg-slate-900/40 text-center">
          <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No Candidate Rankings Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
            No applicants or candidate profiles are available for this job position yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Ranked Candidates</p>
                <p className="text-2xl font-extrabold text-white">{rankingData.total_candidates}</p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Top Candidate Match</p>
                <p className="text-2xl font-extrabold text-amber-400">
                  {rankingData.rankings[0]?.final_score || 0}%
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Position</p>
                <p className="text-sm font-bold text-white truncate max-w-[180px]">{rankingData.job_title}</p>
              </div>
            </div>
          </div>

          {/* Table Toolbar / Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/40 p-4 border border-slate-800 rounded-2xl">
            <div className="text-xs font-medium text-slate-300">
              Showing candidate leaderboard sorted by <strong className="text-indigo-400 uppercase">{sortBy.replace('_', ' ')}</strong>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value="final_score">Final AI Match Score</option>
                <option value="skill_score">Skill Match Score</option>
                <option value="experience_score">Experience Score</option>
                <option value="similarity_score">Resume Similarity</option>
              </select>
            </div>
          </div>

          {/* Candidate Leaderboard Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-4 w-16">Rank</th>
                    <th className="p-4">Candidate</th>
                    <th className="p-4 text-center">Skill (40%)</th>
                    <th className="p-4 text-center">Exp (20%)</th>
                    <th className="p-4 text-center">Edu (10%)</th>
                    <th className="p-4 text-center">Similarity (30%)</th>
                    <th className="p-4 text-center">Final AI Score</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {sortedRankings.map((item) => (
                    <tr key={item.candidate_id} className="hover:bg-slate-800/40 transition">
                      {/* Rank Medal */}
                      <td className="p-4 text-center font-bold text-sm">
                        {item.medal ? (
                          <span className="text-xl" title={`Rank ${item.rank}`}>{item.medal}</span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs mx-auto">
                            {item.rank}
                          </span>
                        )}
                      </td>

                      {/* Candidate Name & Info */}
                      <td className="p-4">
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          {item.candidate_name}
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                            {item.application_status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.email} • {item.experience_years} Yrs Exp • {item.location || 'Location N/A'}
                        </p>
                      </td>

                      {/* Component Scores */}
                      <td className="p-4 text-center">
                        <span className="font-semibold text-indigo-300">{item.skill_score}%</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-semibold text-blue-300">{item.experience_score}%</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-semibold text-purple-300">{item.education_score}%</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-semibold text-teal-300">{item.similarity_score}%</span>
                      </td>

                      {/* Final AI Match Score Badge */}
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1.5 rounded-xl border font-extrabold text-sm inline-block ${getScoreColor(item.final_score)}`}>
                          {item.final_score}%
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedCandidateModal(item)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                        >
                          Breakdown <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Score Breakdown Modal */}
      {selectedCandidateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedCandidateModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xl">
                {selectedCandidateModal.medal || `#${selectedCandidateModal.rank}`}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {selectedCandidateModal.candidate_name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedCandidateModal.email} • {selectedCandidateModal.experience_years} Years Experience
                </p>
              </div>
            </div>

            {/* Final Match Score Summary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Overall AI Match Score</p>
                <p className="text-2xl font-extrabold text-white mt-0.5">{selectedCandidateModal.final_score}% Match</p>
              </div>
              <span className={`px-4 py-2 rounded-xl font-extrabold text-base border ${getScoreColor(selectedCandidateModal.final_score)}`}>
                Rank #{selectedCandidateModal.rank}
              </span>
            </div>

            {/* Factor Score Progress Bars */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matching Factors Breakdown</h4>

              {/* Skill Match (40%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Skill Match (Weight 40%)</span>
                  <span className="text-indigo-400 font-bold">{selectedCandidateModal.skill_score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${selectedCandidateModal.skill_score}%` }} />
                </div>
              </div>

              {/* Experience Match (20%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Experience Match (Weight 20%)</span>
                  <span className="text-blue-400 font-bold">{selectedCandidateModal.experience_score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${selectedCandidateModal.experience_score}%` }} />
                </div>
              </div>

              {/* Education Match (10%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Education Match (Weight 10%)</span>
                  <span className="text-purple-400 font-bold">{selectedCandidateModal.education_score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${selectedCandidateModal.education_score}%` }} />
                </div>
              </div>

              {/* Resume Similarity (30%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Resume Similarity TF-IDF (Weight 30%)</span>
                  <span className="text-teal-400 font-bold">{selectedCandidateModal.similarity_score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: `${selectedCandidateModal.similarity_score}%` }} />
                </div>
              </div>
            </div>

            {/* Matched & Missing Skills Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Matched Job Skills
                </h5>
                {selectedCandidateModal.matched_skills && selectedCandidateModal.matched_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCandidateModal.matched_skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">No direct required/preferred skills matched.</p>
                )}
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Missing Job Skills
                </h5>
                {selectedCandidateModal.missing_skills && selectedCandidateModal.missing_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCandidateModal.missing_skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-400 font-medium pt-1">All required skills met!</p>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
