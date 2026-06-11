import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ToyBrick, Palmtree, PlayCircle, ClipboardCheck } from 'lucide-react';
import { kidsCourses } from '../services/mockData';

const EspanholParaCriancas = () => {
  const [expandedLevels, setExpandedLevels] = useState(kidsCourses.map((course) => course.slug));

  const levelIcons = [
    <Star key="l1" className="h-8 w-8 text-yellow-400 fill-yellow-400" />,
    <ToyBrick key="l2" className="h-8 w-8 text-red-500 fill-red-500" />,
    <Palmtree key="l3" className="h-8 w-8 text-green-500" />,
  ];

  const toggleLevel = (levelSlug) => {
    setExpandedLevels((prev) =>
      prev.includes(levelSlug)
        ? prev.filter((level) => level !== levelSlug)
        : [...prev, levelSlug]
    );
  };

  const getLessonStatus = () => ({
    icon: <PlayCircle className="h-5 w-5 text-orange-500" />,
    label: 'Ver Aula',
    isLocked: false,
  });

  return (
    <div className="space-y-8">
      <div className="kids-header">
        <h1>Espanhol para Crianças</h1>
        <p className="kids-subtitle">Uma aventura no espanhol para os pequenos!</p>
      </div>

      <div className="kids-section">
        <div className="kids-section-header">
          <div>
            <h2 className="kids-section-title">Níveis de Aventura</h2>
            <p className="kids-section-description">Explore todas as aulas e desafios disponíveis.</p>
          </div>
          <Link to="/evaluacoes-infantil">
            <button className="btn-outline">
              <ClipboardCheck className="h-4 w-4" />
              Ver Avaliações
            </button>
          </Link>
        </div>

        <div className="pt-6 space-y-4">
          {kidsCourses.map((course, index) => (
            <div key={course.slug} className="kids-level-card">
              <button onClick={() => toggleLevel(course.slug)} className="kids-level-button">
                <div className="kids-level-icon">{levelIcons[index]}</div>
                <span className="kids-level-title">{course.title}</span>
              </button>

              {expandedLevels.includes(course.slug) && (
                <div className="kids-lessons-container">
                  <div className="kids-lessons-grid">
                    {course.lessons.map((lesson, lessonIndex) => {
                      const status = getLessonStatus();
                      const lessonNumber = lessonIndex + 1;
                      const evaluationMilestones = [9, 18, 27].filter((milestone) => milestone <= course.lessons.length);

                      const lessonComponent = (
                        <Link key={lesson.slug} to={`/lessons/${lesson.slug}`} className="kids-lesson-card">
                          <div className="kids-lesson-content">
                            <div className="kids-lesson-icon-bg">{status.icon}</div>
                            <div className="flex-1">
                              <p className="kids-lesson-title">{lesson.title}</p>
                              <p className="kids-lesson-status">{status.label}</p>
                            </div>
                          </div>
                        </Link>
                      );

                      if (evaluationMilestones.includes(lessonNumber)) {
                        const evalNum = evaluationMilestones.indexOf(lessonNumber) + 1;
                        return [
                          lessonComponent,
                          <Link key={`eval-${lesson.slug}`} to="/evaluacoes-infantil" className="kids-evaluation-card">
                            <div className="kids-evaluation-content">
                              <div className="kids-evaluation-icon-bg">
                                <ClipboardCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="kids-evaluation-title">Avaliação de Módulo {evalNum}</p>
                                <p className="kids-evaluation-status">Testar Conhecimento</p>
                              </div>
                            </div>
                          </Link>,
                        ];
                      }

                      return lessonComponent;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EspanholParaCriancas;