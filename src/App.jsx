import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import Chatbot from './components/Chatbot/Chatbot';

// Lazy-loaded public pages for instant zero-lag loading & small bundle
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));
const HonorsPage = lazy(() => import('./pages/HonorsPage'));

// Lazy-loaded Admin pages (decoupled from public bundle)
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const QuickEditorPage = lazy(() => import('./pages/admin/QuickEditorPage'));
const ManageProfile = lazy(() => import('./pages/admin/ManageProfile'));
const ManageExperience = lazy(() => import('./pages/admin/ManageExperience'));
const ManageEducation = lazy(() => import('./pages/admin/ManageEducation'));
const ManageSkills = lazy(() => import('./pages/admin/ManageSkills'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageCertificates = lazy(() => import('./pages/admin/ManageCertificates'));
const ManageHonors = lazy(() => import('./pages/admin/ManageHonors'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: '#00d2ff',
      fontSize: '0.95rem',
      fontWeight: 500,
      letterSpacing: '0.5px',
      gap: '10px'
    }}>
      <div style={{
        width: '18px',
        height: '18px',
        border: '2px solid rgba(0, 210, 255, 0.2)',
        borderTopColor: '#00d2ff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span>Loading...</span>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <HashRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="certificates" element={<CertificatesPage />} />
                <Route path="honors" element={<HonorsPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="quick-editor" element={<QuickEditorPage />} />
                  <Route path="profile" element={<ManageProfile />} />
                  <Route path="experience" element={<ManageExperience />} />
                  <Route path="education" element={<ManageEducation />} />
                  <Route path="skills" element={<ManageSkills />} />
                  <Route path="projects" element={<ManageProjects />} />
                  <Route path="certificates" element={<ManageCertificates />} />
                  <Route path="honors" element={<ManageHonors />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
        <Chatbot />
      </LangProvider>
    </ThemeProvider>
  );
}
