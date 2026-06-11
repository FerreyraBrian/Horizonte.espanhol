// src/pages/Lessons.jsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Search, BookOpen } from 'lucide-react';

const Lessons = ({ lessons, userProgress, onLessonClick }) => {
  const [expandedLevels, setExpandedLevels] = useState(['a1']);
  const [searchTerm, setSearchTerm] = useState('');

  // Agrupar lecciones por nivel
  const groupedLessons = useMemo(() => {
    const groups = {};
    lessons.forEach(lesson => {
      const level = lesson.level || 'A1';
      if (!groups[level]) groups[level] = [];
      groups[level].push(lesson);
    });
    return groups;
  }, [lessons]);

  const toggleLevel = (level) => {
    setExpandedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto text-slate-300" />
          <p className="mt-4 text-slate-500">Cargando lecciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-container space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Mis Lecciones</h1>
        <p className="text-blue-100 mt-1">Completa las lecciones para avanzar en tu nivel</p>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar lección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Lista de lecciones por nivel */}
      <div className="space-y-4">
        {Object.entries(groupedLessons).map(([level, levelLessons]) => {
          const filteredLessons = searchTerm
            ? levelLessons.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()))
            : levelLessons;

          if (filteredLessons.length === 0) return null;

          return (
            <section key={level} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => toggleLevel(level)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3">
                  {expandedLevels.includes(level) ? (
                    <ChevronDown className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-blue-500" />
                  )}
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{level}</span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Nivel {level}
                  </h2>
                  <span className="text-sm text-slate-500">({filteredLessons.length} lecciones)</span>
                </div>
              </button>

              {expandedLevels.includes(level) && (
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        to={`/lessons/${lesson.slug}`}
                        onClick={() => onLessonClick?.(lesson)}
                        className="block group"
                      >
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-all hover:-translate-y-0.5 bg-white dark:bg-slate-800">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {lesson.title}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                {lesson.shortSummary}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Lessons;