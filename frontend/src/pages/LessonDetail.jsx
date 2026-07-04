import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonClientPage from '../components/lessons/LessonClientPage';
import { lessons as fallbackLessons } from '../services/mockData';

const LessonDetail = ({ lessons: lessonsProp, onComplete, userProgress, onProgressUpdate }) => {
  const lessons = lessonsProp?.length ? lessonsProp : fallbackLessons;
  const { slug } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [prevLesson, setPrevLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studyTime, setStudyTime] = useState(0);

  // Encontrar la lección actual y las vecinas
  useEffect(() => {
    const currentLesson = lessons.find((item) => item.slug === slug);
    
    if (currentLesson) {
      setLesson(currentLesson);
      
      // Encontrar lección anterior y siguiente
      const currentIndex = lessons.findIndex((item) => item.slug === slug);
      setPrevLesson(currentIndex > 0 ? lessons[currentIndex - 1] : null);
      setNextLesson(currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null);
    }
    
    setIsLoading(false);
  }, [slug, lessons]);

  // Iniciar contador de tiempo de estudio
  useEffect(() => {
    if (!lesson) return;
    
    const timerInterval = setInterval(() => {
      setStudyTime(prev => {
        const newTime = prev + 1;
        // Guardar progreso cada minuto
        saveStudyTime(newTime);
        return newTime;
      });
    }, 60000); // Cada minuto

    // Restaurar tiempo de estudio guardado
    restoreStudyTime();

    return () => {
      clearInterval(timerInterval);
      saveFinalProgress();
    };
  }, [lesson]);

  const saveStudyTime = (minutes) => {
    const savedProgress = localStorage.getItem(`lesson_progress_${slug}`);
    const progress = savedProgress ? JSON.parse(savedProgress) : {};
    progress.studyTime = minutes;
    progress.lastAccess = Date.now();
    localStorage.setItem(`lesson_progress_${slug}`, JSON.stringify(progress));
  };

  const restoreStudyTime = () => {
    const savedProgress = localStorage.getItem(`lesson_progress_${slug}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setStudyTime(progress.studyTime || 0);
    }
  };

  const saveFinalProgress = () => {
    if (!lesson) return;
    
    const progressData = {
      lessonSlug: slug,
      studyTime,
      completed: false,
      lastAccess: Date.now()
    };
    
    localStorage.setItem(`lesson_progress_${slug}`, JSON.stringify(progressData));
    
    // Disparar evento para actualizar dashboard
    window.dispatchEvent(new CustomEvent('lessonProgressUpdated', {
      detail: {
        lessonSlug: slug,
        studyTime,
        timestamp: Date.now()
      }
    }));
  };

  const handleComplete = useCallback((lessonId) => {
    const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]');

    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      localStorage.setItem('completed_lessons', JSON.stringify(completedLessons));

      const totalLessons = lessons.length;
      const progress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
      localStorage.setItem('user_progress_percentage', String(progress));

      showCelebration();

      if (onComplete) {
        onComplete(lessonId);
      }

      window.dispatchEvent(new CustomEvent('lessonCompleted', {
        detail: {
          lessonId,
          lessonSlug: slug,
          completedLessons: completedLessons.length,
          progress,
        },
      }));
    }

    if (nextLesson) {
      setTimeout(() => {
        const goToNext = window.confirm('🎉 ¡Lección completada! ¿Quieres ir a la siguiente lección?');
        if (goToNext) {
          navigate(`/lessons/${nextLesson.slug}`);
        }
      }, 500);
    }
  }, [nextLesson, slug, navigate, onComplete, lessons]);

  const showCelebration = () => {
    // Crear elemento de celebración
    const celebration = document.createElement('div');
    celebration.className = 'celebration-overlay';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-icon">🎉</div>
        <h3>¡Lección Completada!</h3>
        <p>Sigue así, ¡vas por buen camino!</p>
      </div>
    `;
    
    // Estilos de celebración
    celebration.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;
    
    const content = celebration.querySelector('.celebration-content');
    content.style.cssText = `
      background: linear-gradient(135deg, #10b981, #059669);
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
      color: white;
      animation: bounce 0.5s ease;
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      celebration.style.opacity = '0';
      setTimeout(() => celebration.remove(), 300);
    }, 2000);
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/lessons/${nextLesson.slug}`);
    }
  };

  const handlePrevLesson = () => {
    if (prevLesson) {
      navigate(`/lessons/${prevLesson.slug}`);
    }
  };

  // Mostrar loading mientras carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Cargando lección...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Lección no encontrada.</p>
        <button
          onClick={() => navigate('/lessons')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Volver a lecciones
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-detail-container">
      {/* Barra de progreso superior */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${(studyTime / (lesson.duration || 25)) * 100}%` }}
        />
      </div>

      {/* Contenido principal de la lección */}
      <LessonClientPage 
        lesson={lesson}
        onComplete={handleComplete}
        onNext={handleNextLesson}
        onPrevious={handlePrevLesson}
        hasNext={!!nextLesson}
        hasPrevious={!!prevLesson}
        studyTime={studyTime}
      />

      {/* Inyectar estilos de animación */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .lesson-detail-container {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default LessonDetail;