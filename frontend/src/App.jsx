import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/Profile';
import CandidateSkills from './pages/candidate/Skills';
import CandidateResume from './pages/candidate/Resume';
import BrowseJobs from './pages/candidate/BrowseJobs';
import JobDetails from './pages/candidate/JobDetails';
import MyApplications from './pages/candidate/MyApplications';
import SkillGap from './pages/candidate/SkillGap';
import Recommendations from './pages/candidate/Recommendations';
import InterviewPreparation from './pages/candidate/InterviewPreparation';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterProfile from './pages/recruiter/Profile';
import CompanyPage from './pages/recruiter/Company';
import RecruiterJobs from './pages/recruiter/Jobs';
import CreateJob from './pages/recruiter/CreateJob';
import EditJob from './pages/recruiter/EditJob';
import Applicants from './pages/recruiter/Applicants';
import CandidateRanking from './pages/recruiter/CandidateRanking';

import AdminDashboard from './pages/admin/Dashboard';
import AdminAnalytics from './pages/admin/Analytics';
import AdminUsers from './pages/admin/Users';
import AdminJobs from './pages/admin/Jobs';
import AdminApplications from './pages/admin/Applications';

// Guard restricting unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Initializing HireAI Session...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Guard restricting candidate role
const CandidateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'candidate' && user.role !== 'admin') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  return children;
};

// Guard restricting recruiter role
const RecruiterRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'recruiter' && user.role !== 'admin') {
    return <Navigate to="/candidate/dashboard" replace />;
  }
  return children;
};

// Guard restricting admin role
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return user.role === 'recruiter' 
      ? <Navigate to="/recruiter/dashboard" replace /> 
      : <Navigate to="/candidate/dashboard" replace />;
  }
  return children;
};

// Guard redirecting authenticated users away from public login/register
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return user.role === 'recruiter' 
      ? <Navigate to="/recruiter/dashboard" replace /> 
      : <Navigate to="/candidate/dashboard" replace />;
  }
  return children;
};

// Smart Switch for generic /dashboard route
const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return user.role === 'recruiter' 
    ? <Navigate to="/recruiter/dashboard" replace /> 
    : <Navigate to="/candidate/dashboard" replace />;
};

function AppContent() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        
        <Route 
          path="/login" 
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } 
        />

        {/* Generic Dashboard Redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Protected Candidate Routes */}
        <Route 
          path="/candidate/dashboard" 
          element={
            <CandidateRoute>
              <CandidateDashboard />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/profile" 
          element={
            <CandidateRoute>
              <CandidateProfile />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/skills" 
          element={
            <CandidateRoute>
              <CandidateSkills />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/resume" 
          element={
            <CandidateRoute>
              <CandidateResume />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/jobs" 
          element={
            <CandidateRoute>
              <BrowseJobs />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/jobs/:jobId" 
          element={
            <CandidateRoute>
              <JobDetails />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/applications" 
          element={
            <CandidateRoute>
              <MyApplications />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/skill-gap" 
          element={
            <CandidateRoute>
              <SkillGap />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/skill-gap/:jobId" 
          element={
            <CandidateRoute>
              <SkillGap />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/recommendations" 
          element={
            <CandidateRoute>
              <Recommendations />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/interview-prep" 
          element={
            <CandidateRoute>
              <InterviewPreparation />
            </CandidateRoute>
          } 
        />
        <Route 
          path="/candidate/interview-prep/:jobId" 
          element={
            <CandidateRoute>
              <InterviewPreparation />
            </CandidateRoute>
          } 
        />

        {/* Protected Recruiter Routes */}
        <Route 
          path="/recruiter/dashboard" 
          element={
            <RecruiterRoute>
              <RecruiterDashboard />
            </RecruiterRoute>
          } 
        />
        <Route 
          path="/recruiter/profile" 
          element={
            <RecruiterRoute>
              <RecruiterProfile />
            </RecruiterRoute>
          } 
        />
        <Route 
          path="/recruiter/company" 
          element={
            <RecruiterRoute>
              <CompanyPage />
            </RecruiterRoute>
          } 
        />
        <Route 
          path="/recruiter/jobs" 
          element={
            <RecruiterRoute>
              <RecruiterJobs />
            </RecruiterRoute>
          } 
        />
        <Route 
          path="/recruiter/jobs/create" 
          element={
            <RecruiterRoute>
              <CreateJob />
            </RecruiterRoute>
          } 
        />
        <Route 
          path="/recruiter/jobs/edit/:jobId" 
          element={
            <RecruiterRoute>
              <EditJob />
            </RecruiterRoute>
          } 
        />
        <Route 
          path="/recruiter/applicants" 
          element={
            <RecruiterRoute>
              <Applicants />
            </RecruiterRoute>
          } 
        />
        <Route 
          path="/recruiter/rankings" 
          element={
            <RecruiterRoute>
              <CandidateRanking />
            </RecruiterRoute>
          } 
        />
        <Route 
          path="/recruiter/jobs/:jobId/rankings" 
          element={
            <RecruiterRoute>
              <CandidateRanking />
            </RecruiterRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/jobs" 
          element={
            <AdminRoute>
              <AdminJobs />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/applications" 
          element={
            <AdminRoute>
              <AdminApplications />
            </AdminRoute>
          } 
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
