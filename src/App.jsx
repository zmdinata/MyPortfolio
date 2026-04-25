import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import CertificatesPage from './pages/CertificatesPage';
import HonorsPage from './pages/HonorsPage';
import Chatbot from './components/Chatbot/Chatbot';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ManageProfile from './pages/admin/ManageProfile';
import ManageExperience from './pages/admin/ManageExperience';
import ManageEducation from './pages/admin/ManageEducation';
import ManageSkills from './pages/admin/ManageSkills';
import ManageProjects from './pages/admin/ManageProjects';
import ManageCertificates from './pages/admin/ManageCertificates';
import ManageHonors from './pages/admin/ManageHonors';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <HashRouter>
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
        </HashRouter>
        <Chatbot />
      </LangProvider>
    </ThemeProvider>
  );
}
