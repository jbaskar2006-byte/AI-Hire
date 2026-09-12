import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  RefreshCw, 
  Briefcase, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Zap,
  Target
} from 'lucide-react';
import { getInterviewQuestions, generateInterviewQuestions } from '../../services/interviewService';
import { getAllJobs } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';

export default function InterviewPreparation() {
  const { jobId: urlJobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(urlJobId ? parseInt(urlJobId) : '');
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Interactive practice state stored in localStorage per question
  const [practicedMap, setPracticedMap] = useState({});
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [copiedId, setCopiedId] = useState(null);

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
      fetchQuestions(selectedJobId);
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
      console.error("Failed to load jobs for interview prep:", err);
      setLoading(false);
    }
  };

  const fetchQuestions = async (jobIdToFetch) => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await getInterviewQuestions(jobIdToFetch, user.id);
      setQuestionsData(res);
      loadPracticedState(res?.questions);
    } catch (err) {
      console.error("Failed to load interview questions:", err);
      const detail = extractErrorMsg(err, "Failed to load interview questions.");
      setErrorMessage(detail);
      setQuestionsData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedJobId || !user) return;
    setGenerating(true);
    setErrorMessage('');
    try {
      const res = await generateInterviewQuestions(selectedJobId, user.id, 12);
      setQuestionsData(res);
      loadPracticedState(res?.questions);
    } catch (err) {
      console.error("Failed to generate interview questions:", err);
      const detail = extractErrorMsg(err, "Failed to generate interview questions.");
      setErrorMessage(detail);
    } finally {
      setGenerating(false);
    }
  };

  const loadPracticedState = (questionsList) => {
    if (!questionsList) return;
    const initialMap = {};
    questionsList.forEach(q => {
      const saved = localStorage.getItem(`practiced_q_${user?.id}_${q.id}`);
      initialMap[q.id] = saved === 'true';
    });
    setPracticedMap(initialMap);
  };

  const togglePracticed = (qId) => {
    const newState = !practicedMap[qId];
    setPracticedMap(prev => ({ ...prev, [qId]: newState }));
    localStorage.setItem(`practiced_q_${user?.id}_${qId}`, newState.toString());
  };

  const toggleExpandedAnswer = (qId) => {
    setExpandedAnswers(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryBadgeStyle = (category) => {
    switch (category) {
      case 'Technical':
        return 'bg-indigo-900/60 text-indigo-300 border-indigo-700/50';
      case 'HR':
        return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50';
      case 'Project':
        return 'bg-purple-900/60 text-purple-300 border-purple-700/50';
      case 'Skill-Based':
        return 'bg-amber-900/60 text-amber-300 border-amber-700/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getCategoryGuidance = (category, questionText) => {
    switch (category) {
      case 'Technical':
        return "Structure your response using foundational definitions, architectural trade-offs, edge cases, and performance implications. Mention real-world experience where applicable.";
      case 'HR':
        return "Use the STAR method (Situation, Task, Action, Result). Highlight communication, problem-solving under pressure, ownership, and team collaboration.";
      case 'Project':
        return "Explain system architecture, technical constraints, scale, performance optimizations, and your individual contribution to project success.";
      case 'Skill-Based':
        return "Acknowledge existing technical overlaps, demonstrate rapid learning aptitude, and describe how you quickly adopt new frameworks/libraries.";
      default:
        return "Be concise, confident, and provide practical examples from past projects.";
    }
  };

  const filteredQuestions = questionsData?.questions ? (
    activeCategory === 'All' 
      ? questionsData.questions 
      : questionsData.questions.filter(q => q.category === activeCategory)
  ) : [];

  const totalQuestionsCount = questionsData?.questions?.length || 0;
  const practicedCount = Object.values(practicedMap).filter(Boolean).length;
  const progressPercent = totalQuestionsCount > 0 ? Math.round((practicedCount / totalQuestionsCount) * 100) : 0;

  const categoriesList = ['All', 'Technical', 'HR', 'Project', 'Skill-Based'];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-slate-950 text-white p-8 border border-purple-500/20 shadow-xl">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="/images/candidate_interview_room.png" 
            alt="AI Interview Practice Room" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> AI Interview Question Generator
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Intelligent Interview Prep
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Tailored questions generated dynamically from job requirements, candidate skills, experience level, and skill gap analysis.
            </p>
          </div>

          {/* Job Selection Controls */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(parseInt(e.target.value))}
              className="bg-slate-900/90 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-500 min-w-[240px]"
            >
              <option value="" disabled>Select Target Position...</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerate}
              disabled={generating || !selectedJobId}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/25 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generating...' : 'Re-Generate AI Questions'}
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

      {/* Main Content */}
      {loading ? (
        <div className="p-16 border border-slate-800 rounded-2xl bg-slate-900/40 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-3" />
          Generating intelligent interview question bank for target job role...
        </div>
      ) : !questionsData ? (
        <div className="p-16 border border-slate-800 rounded-2xl bg-slate-900/40 text-center">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No Target Position Selected</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
            Please select a job position above to view or generate tailored interview questions.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Practice Progress Bar Card */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  <span>Position: {questionsData.job_title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Track your practice progress across Technical, HR, Project, and Skill-Based interview domains.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-purple-400">
                    {practicedCount} / {totalQuestionsCount} Practiced
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {progressPercent}% Complete
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
            {categoriesList.map(category => {
              const count = category === 'All' 
                ? totalQuestionsCount 
                : (questionsData.questions_by_category?.[category]?.length || 0);

              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isActive 
                      ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20' 
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Questions Grid */}
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/30 text-slate-400">
              No interview questions found in category '{activeCategory}'.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const isPracticed = !!practicedMap[q.id];
                const isExpanded = !!expandedAnswers[q.id];

                return (
                  <div 
                    key={q.id || idx}
                    className={`p-6 rounded-2xl border transition-all duration-200 ${
                      isPracticed 
                        ? 'bg-slate-900/40 border-slate-800/80 opacity-90' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40 shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Practice Toggle Checkbox */}
                        <button
                          onClick={() => togglePracticed(q.id)}
                          title={isPracticed ? "Mark as Unpracticed" : "Mark as Practiced"}
                          className="mt-1 flex-shrink-0 transition-transform active:scale-95"
                        >
                          {isPracticed ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>

                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider border ${getCategoryBadgeStyle(q.category)}`}>
                              {q.category}
                            </span>
                            {isPracticed && (
                              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                                ✓ Practiced
                              </span>
                            )}
                          </div>

                          <h4 className={`text-base font-semibold ${isPracticed ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {q.question}
                          </h4>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => copyToClipboard(q.question, q.id)}
                          title="Copy Question"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-xs font-semibold flex items-center gap-1"
                        >
                          {copiedId === q.id ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => toggleExpandedAnswer(q.id)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl transition text-xs font-semibold flex items-center gap-1"
                        >
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                          <span className="hidden sm:inline">Answer Guide</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Answer Guidance Dropdown */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950/60 -mx-6 -mb-6 p-6 rounded-b-2xl space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                          <Zap className="w-3.5 h-3.5" /> Key Answer Focus Points ({q.category}):
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {getCategoryGuidance(q.category, q.question)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
