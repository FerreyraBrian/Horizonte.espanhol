import React, { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ResourcesPage from './pages/ResourcesPage';
import EvaluationsPage from './pages/EvaluationsPage';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import StudentsPage from './components/admin/StudentsPage';
import AppShell from './components/layout/AppShell';
import AdminAppShell from './components/layout/AdminAppShell';
import { lessons as allLessons } from './services/mockData';

function App() {
  const [userProgress, setUserProgress] = useState({
    completedLessons: [1, 2, 3, 4, 5],
    currentLesson: 6,
    progress: 20,
  });

  const handleCompleteLesson = (lessonId) => {
    setUserProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const completedLessons = [...prev.completedLessons, lessonId].sort((a, b) => a - b);
      const currentLesson = Math.min(30, lessonId + 1);
      const progress = Math.round((completedLessons.length / 30) * 100);
      return { completedLessons, currentLesson, progress };
    });
  };

  const enrichedLessons = useMemo(() => {
    const completed = new Set(userProgress.completedLessons);
    return allLessons.map((lesson) => {
      const previousComplete = lesson.id === 1 || completed.has(lesson.id - 1);
      let status = 'locked';

      if (completed.has(lesson.id)) status = 'completed';
      else if (lesson.id === userProgress.currentLesson) status = 'current';
      else if (previousComplete) status = 'available';

      return { ...lesson, status };
    });
  }, [allLessons, userProgress]);

  const studentRoutes = (
    <AppShell userProgress={userProgress}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard userProgress={userProgress} lessons={enrichedLessons} />} />
        <Route path='/lessons' element={<Lessons lessons={enrichedLessons} />} />
        <Route path='/lessons/:slug' element={<LessonDetail lessons={enrichedLessons} onComplete={handleCompleteLesson} />} />
        <Route path='/profile' element={<ProfilePage userProgress={userProgress} />} />
        <Route path='/resources' element={<ResourcesPage lessons={enrichedLessons} />} />
        <Route path='/evaluations' element={<EvaluationsPage lessons={enrichedLessons} userProgress={userProgress} />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </AppShell>
  );

  const adminRoutes = (
    <AdminAppShell>
      <Routes>
        <Route path='/admin' element={<AdminDashboardPage />} />
        <Route path='/admin/students' element={<StudentsPage />} />
        <Route path='*' element={<Navigate to='/admin' replace />} />
      </Routes>
    </AdminAppShell>
  );

  return <Routes>
    <Route path='/admin/*' element={adminRoutes} />
    <Route path='/*' element={studentRoutes} />
  </Routes>;
}

export default App;
