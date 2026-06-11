import React, { useMemo, useState } from 'react';
import { Lock, ClipboardCheck } from 'lucide-react';
import { courses as courseCatalog } from '../services/mockData';

const EvaluationsPage = ({ userProgress }) => {
  const [expandedLevels, setExpandedLevels] = useState(['a1']);

  const courses = useMemo(() => {
    return courseCatalog.map((course, index) => ({
      ...course,
      isLocked: index > 0,
    }));
  }, []);

  const toggleLevel = (levelSlug) => {
    setExpandedLevels((prev) =>
      prev.includes(levelSlug)
        ? prev.filter((level) => level !== levelSlug)
        : [...prev, levelSlug]
    );
  };

  const isEvaluationAvailable = (requiredLesson) => userProgress.completedLessons.length >= requiredLesson;

  return (
    <div className="evaluations-page space-y-8">
      <div className="evaluations-header">
        <h1>Centro de Avaliações</h1>
        <p className="evaluations-subtitle">Valide seu conhecimento nos marcos mais importantes.</p>
      </div>

      <div className="evaluations-section">
        <div className="evaluations-section-header">
          <h2 className="evaluations-section-title">Suas Provas</h2>
          <p className="evaluations-section-description">Complete as avaliações para avançar na sua trilha.</p>
        </div>

        <div className="evaluations-content">
          {courses.map((course) => (
            <div key={course.slug} className={`evaluations-level-card ${course.isLocked ? 'locked' : ''}`}>
              <button
                onClick={() => !course.isLocked && toggleLevel(course.slug)}
                disabled={course.isLocked}
                className="evaluations-level-button"
              >
                <div className="evaluations-level-icon">{course.level}</div>
                <span className="evaluations-level-title">{course.title}</span>
                {course.isLocked ? <Lock className="evaluations-level-lock" /> : null}
              </button>

              {expandedLevels.includes(course.slug) && !course.isLocked && (
                <div className="evaluations-evaluations-container">
                  <div className="evaluations-list">
                    {course.evaluations.map((evaluation) => {
                      const isEvalLocked = !isEvaluationAvailable(evaluation.requiredLesson);

                      return (
                        <div key={evaluation.slug} className={`evaluations-item ${isEvalLocked ? 'locked' : ''}`}>
                          <div className={`evaluations-card ${isEvalLocked ? 'locked' : 'available'}`}>
                            <div className="evaluations-card-content">
                              <div className="evaluations-card-left">
                                <div className={`evaluations-icon-bg ${isEvalLocked ? 'locked' : 'available'}`}>
                                  <ClipboardCheck className={`evaluations-icon ${isEvalLocked ? 'locked' : 'available'}`} />
                                </div>
                                <div className="evaluations-info">
                                  <h3 className={`evaluations-info h3 ${isEvalLocked ? 'locked' : 'available'}`}>
                                    {evaluation.title}
                                  </h3>
                                  <span className={`evaluations-status ${isEvalLocked ? 'locked' : 'available'}`}>
                                    {isEvalLocked ? 'Bloqueada' : 'Liberada'}
                                  </span>
                                </div>
                              </div>
                              {!isEvalLocked ? <button className="evaluations-start-btn">Iniciar</button> : null}
                            </div>
                          </div>
                        </div>
                      );
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

export default EvaluationsPage;
