import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import AdminAppShell from './components/layout/AdminAppShell';

// Pages - Public
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ContactPage from './pages/ContactPage';
import EspanholParaCriancas from './pages/EspanholParaCriancas';
import Lessons from './pages/Lessons';

// Pages - Student Dashboard
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ResourcesPage from './pages/ResourcesPage';
import EvaluationsPage from './pages/EvaluationsPage';
import ForumPage from './pages/ForumPage';
import NoticeBoardPage from './pages/NoticeBoardPage';
import LessonDetail from './pages/LessonDetail';

// Pages - Kids Experience
import KidsEvaluationsPage from './pages/KidsEvaluationsPage';
import KidsProfilePage from './pages/KidsProfilePage';

// Admin Pages
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import AdminUserManagementPage from './components/admin/AdminUserManagementPage';
import AdminActivityPage from './components/admin/AdminActivityPage';
import AdminPermissionsPage from './components/admin/AdminPermissionsPage';
import AdminMaterialsPage from './components/admin/AdminMaterialsPage';
import AdminKidsPage from './components/admin/AdminKidsPage';
import AdminOriPage from './components/admin/AdminOriPage';
import AdminSubmissionsPage from './components/admin/AdminSubmissionsPage';
import AdminNoticeBoardPage from './components/admin/AdminNoticeBoardPage';
import AdminSettingsPage from './components/admin/AdminSettingsPage';

// Services
import { courses as courseCatalog, lessons as catalogLessons, defaultUserProgress } from './services/mockData';

const App = () => {
  const { loading } = useAuth();
  const [userProgress, setUserProgress] = useState(defaultUserProgress);
  const [enrichedLessons, setEnrichedLessons] = useState([]);

  useEffect(() => {
    // Initialize lessons with progress data
    const enrichedLessonsData = catalogLessons.map((lesson) => {
      const isCompleted = userProgress.completedLessons.includes(lesson.id);
      const isCurrent = userProgress.currentLesson === lesson.id;

      return {
        ...lesson,
        status: isCompleted ? 'completed' : isCurrent ? 'current' : 'available',
      };
    });

    setEnrichedLessons(enrichedLessonsData);
  }, [userProgress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/espanhol-para-criancas" element={<EspanholParaCriancas />} />

      {/* Student Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppShell userProgress={userProgress}>
              <Dashboard userProgress={userProgress} lessons={enrichedLessons} />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppShell userProgress={userProgress}>
              <ProfilePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppShell userProgress={userProgress}>
              <ResourcesPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluacoes"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppShell userProgress={userProgress}>
              <EvaluationsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/forum"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppShell userProgress={userProgress}>
              <ForumPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cartelera"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppShell userProgress={userProgress}>
              <NoticeBoardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contato"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppShell userProgress={userProgress}>
              <ContactPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lesson/:slug"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppShell userProgress={userProgress}>
              <LessonDetail />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Kids Protected Routes */}
      <Route
        path="/painel-infantil"
        element={
          <ProtectedRoute allowedRoles={['KIDS']}>
            <AppShell userProgress={userProgress}>
              <EspanholParaCriancas />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluacoes-infantil"
        element={
          <ProtectedRoute allowedRoles={['KIDS']}>
            <AppShell userProgress={userProgress}>
              <KidsEvaluationsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil-infantil"
        element={
          <ProtectedRoute allowedRoles={['KIDS']}>
            <AppShell userProgress={userProgress}>
              <KidsProfilePage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminDashboardPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminUserManagementPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/alunos"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminUserManagementPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/atividades"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminActivityPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/permissoes"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminPermissionsPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/materiais"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminMaterialsPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recursos"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminMaterialsPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kids"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminKidsPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/infantil"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminKidsPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ori"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminOriPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/submissions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminSubmissionsPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/submissoes"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminSubmissionsPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notice-board"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminNoticeBoardPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/avisos"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminNoticeBoardPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminSettingsPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/configuracoes"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminSettingsPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/painel"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppShell>
              <AdminDashboardPage />
            </AdminAppShell>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
