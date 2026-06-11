import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, PlayCircle, ClipboardCheck, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react';
import { courses as courseCatalog } from '../services/mockData';

const Dashboard = ({ userProgress, lessons: enrichedLessons }) => {
  const [expandedLevels, setExpandedLevels] = useState(['a1']);

  const displayCourses = useMemo(() => {
    const lessonsBySlug = new Map(enrichedLessons.map((lesson) => [lesson.slug, lesson]));

    return courseCatalog.map((course, index) => ({
      ...course,
      isLocked: index > 0,
      lessons: course.lessons.map((lesson) => lessonsBySlug.get(lesson.slug) || { ...lesson, status: 'locked' }),
    }));
  }, [enrichedLessons]);

  const totalLessons = enrichedLessons.length;
  const completedLessonsCount = userProgress.completedLessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  const toggleLevel = (levelSlug) => {
    setExpandedLevels((prev) =>
      prev.includes(levelSlug)
        ? prev.filter((level) => level !== levelSlug)
        : [...prev, levelSlug]
    );
  };

  const getLessonStatus = (lesson) => {
    if (lesson.status === 'completed') {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        label: 'Concluída',
        isLocked: false,
      };
    }

    if (lesson.status === 'current') {
      return {
        icon: <PlayCircle className="h-5 w-5 text-orange-500" />,
        label: 'Atual',
        isLocked: false,
      };
    }

    if (lesson.status === 'available') {
      return {
        icon: <PlayCircle className="h-5 w-5 text-primary" />,
        label: 'Disponível',
        isLocked: false,
      };
    }

    return {
      icon: <Lock className="h-5 w-5 text-gray-400" />,
      label: 'Bloqueada',
      isLocked: true,
    };
  };

  return (
    <div className="dashboard-page space-y-8">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Painel do Aluno</h1>
          <p className="dashboard-subtitle">Sua jornada para a fluência começa aqui.</p>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <div>
            <h2 className="progress-title">Resumo do seu Trabalho</h2>
            <p className="progress-description">Veja o reflexo da sua dedicação constante.</p>
          </div>
          <GraduationCap className="h-10 w-10 text-orange-500" />
        </div>
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-primary">Progresso Geral</span>
            <span className="text-sm font-bold text-orange-500">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Concluídas</p>
              <p className="stat-value">{completedLessonsCount}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total do Curso</p>
              <p className="stat-value">{totalLessons}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="learning-path">
        <div className="learning-path-header">
          <h2 className="learning-path-title">Trilha de Aprendizagem</h2>
          <p className="learning-path-description">Complete as aulas para desbloquear novos desafios.</p>
        </div>
        <div className="learning-path-content">
          {displayCourses.map((course) => (
            <div key={course.slug} className="mb-4">
              <button
                onClick={() => !course.isLocked && toggleLevel(course.slug)}
                disabled={course.isLocked}
                className={`level-button ${course.isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {expandedLevels.includes(course.slug) ? (
                  <ChevronDown className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-primary" />
                )}
                <div className="level-icon">{course.level}</div>
                <span className="level-title">{course.title}</span>
                {course.isLocked ? <Lock className="h-4 w-4 text-gray-400 ml-auto" /> : null}
              </button>

              {expandedLevels.includes(course.slug) && !course.isLocked && (
                <div className="lessons-grid">
                  {course.lessons.map((lesson, index) => {
                    const status = getLessonStatus(lesson);
                    const lessonNumber = index + 1;
                    const evaluationMilestones = [9, 18, course.lessons.length];

                    const lessonComponent = status.isLocked ? (
                      <div key={lesson.slug} className="lesson-card lesson-locked">
                        <div className="lesson-content">
                          {status.icon}
                          <div className="flex-1">
                            <p className="lesson-title">{lesson.title}</p>
                            <p className="lesson-status">{status.label}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link key={lesson.slug} to={`/lessons/${lesson.slug}`} className="lesson-card">
                        <div className="lesson-content">
                          {status.icon}
                          <div className="flex-1">
                            <p className="lesson-title">{lesson.title}</p>
                            <p className="lesson-status">{status.label}</p>
                          </div>
                        </div>
                      </Link>
                    );

                    if (evaluationMilestones.includes(lessonNumber)) {
                      const evalNum = evaluationMilestones.indexOf(lessonNumber) + 1;
                      return [
                        lessonComponent,
                        <Link key={`eval-${lesson.slug}`} to="/evaluations" className="evaluation-card">
                          <div className="evaluation-content">
                            <div className="evaluation-icon-bg">
                              <ClipboardCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="evaluation-title">Avaliação {evalNum}</p>
                              <p className="evaluation-status">Testar Nível</p>
                            </div>
                          </div>
                        </Link>,
                      ];
                    }

                    return lessonComponent;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
