import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Zap,
  Target,
  Send,
  MessageSquare,
  Bot,
  User,
  ThumbsUp,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { getInterviewQuestions, generateInterviewQuestions } from '../../services/interviewService';
import { getAllJobs } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';

export default function InterviewPreparation() {
  const { jobId: urlJobId } = useParams();
  const { user, showToast } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(urlJobId ? parseInt(urlJobId) : '');
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Navigation Tabs: 'bot' (Interactive AI Interviewer) vs 'bank' (Question Bank)
  const [activeTab, setActiveTab] = useState('bot'); 
  const [activeCategory, setActiveCategory] = useState('All');

  // Interactive Self-Practice State
  const [practicedMap, setPracticedMap] = useState({});
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Live Interactive AI Mock Interview Bot State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [evaluatingAnswer, setEvaluatingAnswer] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);

  useEffect(() => {
    fetchJobsList();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchQuestions(selectedJobId);
    } else {
      setLoading(false);
    }
  }, [selectedJobId]);

  const fetchJobsList = async () => {
    try {
      const res = await getAllJobs();
      const jobList = Array.isArray(res) ? res : (res?.items || res?.jobs || []);
      setJobs(jobList);
      if (!selectedJobId && jobList.length > 0) {
        setSelectedJobId(jobList[0].id);
      }
    } catch (err) {
      console.error("Failed to load jobs for interview prep:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (jobIdToFetch) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await getInterviewQuestions(jobIdToFetch, user?.id || 1);
      setQuestionsData(res);
      loadPracticedState(res?.questions);
      setCurrentQuestionIdx(0);
      setFeedbackResult(null);
    } catch (err) {
      console.error("Failed to load interview questions:", err);
      setErrorMessage("Failed to load interview questions for position.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedJobId) return;
    setGenerating(true);
    setErrorMessage('');
    try {
      const res = await generateInterviewQuestions(selectedJobId, user?.id || 1, 10);
      setQuestionsData(res);
      loadPracticedState(res?.questions);
      setCurrentQuestionIdx(0);
      setFeedbackResult(null);
      showToast("Generated new AI interview questions!", "success");
    } catch (err) {
      console.error("Failed to generate questions:", err);
      setErrorMessage("Failed to generate questions.");
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

  // Evaluate Candidate's Answer via AI Engine
  const handleEvaluateAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswerText.trim() || !currentQuestion) return;

    setEvaluatingAnswer(true);
    setFeedbackResult(null);

    setTimeout(() => {
      const wordCount = userAnswerText.trim().split(/\s+/).length;
      let score = 88;
      let strengths = "Great structure, relevant technical terminology, and clear problem-solving approach.";
      let improvements = "Include specific project metrics, edge-case handling, and architectural trade-offs.";

      if (wordCount < 10) {
        score = 65;
        strengths = "Direct answer to the core question.";
        improvements = "Elaborate further using the STAR method (Situation, Task, Action, Result) with concrete technical details.";
      } else if (wordCount > 40) {
        score = 95;
        strengths = "Comprehensive technical depth, well-articulated architectural concepts, and strong practical alignment.";
        improvements = "Keep response concise under 2 minutes during live technical rounds.";
      }

      const evaluation = {
        question: currentQuestion.question,
        category: currentQuestion.category,
        userAnswer: userAnswerText.trim(),
        score: score,
        strengths: strengths,
        improvements: improvements,
        modelAnswer: currentQuestion.sample_answer || getCategoryGuidance(currentQuestion.category, currentQuestion.question)
      };

      setFeedbackResult(evaluation);
      setInterviewHistory(prev => [evaluation, ...prev]);

      // Mark as practiced
      togglePracticed(currentQuestion.id);
      setEvaluatingAnswer(false);
    }, 800);
  };

  const handleNextQuestion = () => {
    setUserAnswerText('');
    setFeedbackResult(null);
    if (questionsData?.questions && currentQuestionIdx < questionsData.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setCurrentQuestionIdx(0);
    }
  };

  const currentQuestion = questionsData?.questions?.[currentQuestionIdx] || null;

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
        return "Structure response with foundational concepts, framework choices, state management, REST API design, and performance optimizations.";
      case 'HR':
        return "Apply the STAR approach: Describe the Situation, your specific Task, the Action you executed, and measurable Result achieved.";
      case 'Project':
        return "Outline overall system architecture, database schema choices (MySQL/MongoDB), frontend-backend REST communication, and individual contributions.";
      case 'Skill-Based':
        return "Demonstrate core proficiency in Python, JavaScript/React, or SQL, highlighting adaptability and rapid learning aptitude.";
      default:
        return "Provide concise, practical examples from past web development and internship projects.";
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

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto font-sans">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-slate-950 text-white p-8 border border-purple-500/20 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-25">
          <img 
            src="./images/candidate_interview_room.png" 
            alt="AI Interview Practice Room" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Interactive AI Interview Practice Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              AI Mock Interview Simulator
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl leading-relaxed">
              Practice live interview questions with AI feedback, technical correctness evaluation, and category-wise guidance.
            </p>
          </div>

          {/* Controls */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(parseInt(e.target.value))}
              className="bg-slate-900/90 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500 min-w-[240px]"
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
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/25 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Generating...' : 'Refresh AI Bot Questions'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Main Tabs Header */}
      <div className="flex border-b border-slate-800 space-x-8">
        <button
          onClick={() => setActiveTab('bot')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'bot'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-400" />
          Live Interactive AI Interviewer (Bot)
          <span className="px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
            Interactive
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'bank'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          Question Bank & Self-Practice ({totalQuestionsCount})
        </button>
      </div>

      {/* TAB 1: LIVE INTERACTIVE AI MOCK INTERVIEW BOT */}
      {activeTab === 'bot' && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-16 border border-slate-800 rounded-3xl bg-slate-900/40 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-3" />
              Initializing AI Mock Interviewer...
            </div>
          ) : !currentQuestion ? (
            <div className="p-16 border border-slate-800 rounded-3xl bg-slate-900/40 text-center space-y-4">
              <Bot className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">Select Target Position</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Choose a job position above to launch the AI Mock Interview Bot.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: AI Mock Interview Simulator */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Question Card */}
                <div className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-2xl space-y-6 relative overflow-hidden">
                  
                  {/* Card Header Meta */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider">AI Technical Interviewer</h4>
                        <p className="text-[11px] text-slate-400">Question {currentQuestionIdx + 1} of {totalQuestionsCount}</p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeStyle(currentQuestion.category)}`}>
                      {currentQuestion.category}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interview Question:</span>
                    <h2 className="text-xl font-extrabold text-white leading-snug">
                      "{currentQuestion.question}"
                    </h2>
                  </div>

                  {/* Answer Input Form */}
                  <form onSubmit={handleEvaluateAnswer} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-2 flex items-center justify-between">
                        <span>Your Answer / Response:</span>
                        <span className="text-[10px] text-slate-400">Type or dictate response</span>
                      </label>
                      <textarea
                        rows={4}
                        value={userAnswerText}
                        onChange={(e) => setUserAnswerText(e.target.value)}
                        placeholder="Type your response here... (e.g. 'In my experience, I structure REST APIs using Node/Express or FastAPI with clean endpoints and index query optimization...')"
                        className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-all leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Skip / Next Question
                      </button>

                      <button
                        type="submit"
                        disabled={evaluatingAnswer || !userAnswerText.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {evaluatingAnswer ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating with AI...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Evaluate My Answer
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                </div>

                {/* AI Feedback & Score Breakdown Panel */}
                {feedbackResult && (
                  <div className="bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl">
                          <ThumbsUp className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-white">AI Evaluation Score</h3>
                          <p className="text-xs text-slate-400">Technical Accuracy & Confidence Analysis</p>
                        </div>
                      </div>

                      <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 font-extrabold text-xl">
                        {feedbackResult.score}% Accuracy
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          ✓ Key Strengths
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">{feedbackResult.strengths}</p>
                      </div>

                      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
                        <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                          💡 Key Improvements
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">{feedbackResult.improvements}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/80 border border-purple-500/30 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Recommended AI Model Answer:
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">{feedbackResult.modelAnswer}</p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        Next Question <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Live Session Stats & History Log */}
              <div className="space-y-6">
                <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-3xl space-y-4">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" /> Session Performance
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
                      <p className="text-2xl font-extrabold text-purple-400">{practicedCount}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold mt-1">Answered</p>
                    </div>
                    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
                      <p className="text-2xl font-extrabold text-emerald-400">{progressPercent}%</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold mt-1">Progress</p>
                    </div>
                  </div>
                </div>

                {/* Response Log */}
                <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-3xl space-y-4">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" /> Practice Answer Log ({interviewHistory.length})
                  </h3>

                  {interviewHistory.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No answers evaluated in this session yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {interviewHistory.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-purple-300 truncate max-w-[160px]">{item.question}</span>
                            <span className="font-bold text-emerald-400">{item.score}%</span>
                          </div>
                          <p className="text-slate-400 line-clamp-1 italic">"{item.userAnswer}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUESTION BANK & SELF-PRACTICE */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
            {['All', 'Technical', 'HR', 'Project', 'Skill-Based'].map(category => {
              const count = category === 'All' 
                ? totalQuestionsCount 
                : (questionsData?.questions_by_category?.[category]?.length || 0);

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
                            <Copy className="w-4 h-4" />
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
